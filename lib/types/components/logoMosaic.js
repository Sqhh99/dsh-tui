import { wordmarkColumns } from './bigfont.js';
import { LOGO_ASPECT, LOGO_BITS, LOGO_HEIGHT, LOGO_WIDTH } from './logoBitmap.js';
/** Hide the whale when the wordmark column would not fit beside it. */
export const WHALE_MIN_COLUMNS = 20;
/** Roughly half the wordmark, the whale-to-text ratio of docs/assets/logo.png. */
export const WHALE_MAX_COLUMNS = 30;
/** `DEEPSEEK` at 8×6 glyph columns plus 7 letter gaps. */
export const WORDMARK_COLUMNS = wordmarkColumns('DEEPSEEK');
export const WHALE_GAP = 4;
export const LOGO_MASK = {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    bits: LOGO_BITS,
};
/**
 * Packed-bit test.
 * @param mask - 1-bit image.
 * @param x - Column in `mask` space.
 * @param y - Row in `mask` space.
 * @returns Whether that pixel is ink.
 */
export function bitAt(mask, x, y) {
    if (x < 0 || y < 0 || x >= mask.width || y >= mask.height)
        return false;
    const rowBytes = Math.ceil(mask.width / 8);
    const byte = mask.bits[y * rowBytes + (x >> 3)] ?? 0;
    return (byte & (0x80 >> (x & 7))) !== 0;
}
/**
 * Whale box that fits beside the wordmark and keeps the mask aspect
 * against a 1:2 terminal cell.
 * @param columns - Full terminal width.
 * @param aspect - Width / height of the whale mask.
 * @returns Cell size, or `null` when the whale would be too narrow.
 */
export function whaleCellSize(columns, aspect = LOGO_ASPECT) {
    const available = columns - WORDMARK_COLUMNS - WHALE_GAP;
    if (available < WHALE_MIN_COLUMNS)
        return null;
    const whaleCols = Math.min(WHALE_MAX_COLUMNS, available);
    // A half-block row is two pixels tall, so the box keeps `aspect` when its
    // row count is half the column count divided by it.
    const rows = Math.max(6, Math.round(whaleCols / (2 * aspect)));
    return { columns: whaleCols, rows };
}
/**
 * Half-block cell: upper and lower pixel → `▀` / `▄` / `█` / space.
 * These glyphs are in every Windows Terminal / VS Code font; sextants are not.
 * @param upper - Top pixel is ink.
 * @param lower - Bottom pixel is ink.
 * @returns One terminal cell.
 */
export function halfBlockChar(upper, lower) {
    if (upper && lower)
        return '█';
    if (upper)
        return '▀';
    if (lower)
        return '▄';
    return ' ';
}
/**
 * Unicode 13 sextant for a 2×3 bit mask (bit0=TL, 1=TR, 2=ML, 3=MR, 4=BL, 5=BR).
 * @param mask - Six-bit pattern.
 * @returns One terminal cell.
 */
export function sextantChar(mask) {
    const bits = mask & 63;
    if (bits === 0)
        return ' ';
    if (bits === 21)
        return '▌';
    if (bits === 42)
        return '▐';
    if (bits === 63)
        return '█';
    let skipped = 0;
    if (bits > 21)
        skipped++;
    if (bits > 42)
        skipped++;
    return String.fromCodePoint(0x1fb00 + bits - 1 - skipped);
}
/**
 * Braille cell for an 8-dot 2×4 mask (bit0=dot1 … bit7=dot8).
 * @param mask - Eight-bit pattern.
 * @returns One terminal cell.
 */
export function brailleChar(mask) {
    return String.fromCodePoint(0x2800 + (mask & 0xff));
}
export function preferGlyphs() {
    const value = process.env.DSH_TUI_LOGO_GLYPHS;
    if (value === 'braille' || value === 'sextant' || value === 'half')
        return value;
    // Half-blocks, even though braille packs 2×4 samples per cell instead of
    // 1×2. The whale is a filled silhouette, and braille draws its dots with
    // gaps around them, so a solid region comes out as a dot screen rather than
    // a solid body. `█` fills the cell, which is what the reference logo wants.
    return 'half';
}
/**
 * Sample `mask` onto a `columns`-wide mosaic painted with `ink`.
 * @param mask - 1-bit source.
 * @param columns - Terminal columns for this box (not the full screen).
 * @param ink - Truecolor foreground for ink cells.
 * @param options - Glyph set and optional explicit row count.
 * @returns One ANSI string per terminal row, each `columns` cells wide.
 */
export function mosaicRows(mask, columns, ink, options) {
    const glyphs = options?.glyphs ?? 'half';
    const pxW = glyphs === 'half' ? 1 : 2;
    const pxH = glyphs === 'braille' ? 4 : glyphs === 'sextant' ? 3 : 2;
    const aspect = mask.width / mask.height;
    const rows = options?.rows ?? Math.max(10, Math.round((columns * 0.5) / aspect));
    const destW = columns * pxW;
    const destH = rows * pxH;
    const out = [];
    for (let cy = 0; cy < rows; cy++) {
        const cells = [];
        for (let cx = 0; cx < columns; cx++) {
            if (glyphs === 'braille') {
                cells.push(brailleChar(sampleBraille(mask, cx, cy, destW, destH)));
            }
            else if (glyphs === 'sextant') {
                cells.push(sextantChar(sampleSextant(mask, cx, cy, destW, destH)));
            }
            else {
                cells.push(sampleHalf(mask, cx, cy, destW, destH));
            }
        }
        out.push(paintRow(cells, ink));
    }
    return out;
}
function sampleHalf(mask, cx, cy, destW, destH) {
    return halfBlockChar(sampleMask(mask, cx, cy * 2, destW, destH), sampleMask(mask, cx, cy * 2 + 1, destW, destH));
}
function sampleSextant(mask, cx, cy, destW, destH) {
    let bits = 0;
    for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 2; sx++) {
            if (sampleMask(mask, cx * 2 + sx, cy * 3 + sy, destW, destH)) {
                bits |= 1 << (sy * 2 + sx);
            }
        }
    }
    return bits;
}
/** Braille dots: 1 4 / 2 5 / 3 6 / 7 8 → bits 0,3 / 1,4 / 2,5 / 6,7. */
const BRAILLE_DOT = [
    [0, 3],
    [1, 4],
    [2, 5],
    [6, 7],
];
function sampleBraille(mask, cx, cy, destW, destH) {
    let bits = 0;
    for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 2; sx++) {
            if (sampleMask(mask, cx * 2 + sx, cy * 4 + sy, destW, destH)) {
                bits |= 1 << BRAILLE_DOT[sy][sx];
            }
        }
    }
    return bits;
}
function sampleMask(mask, px, py, destW, destH) {
    const x0 = Math.floor((px * mask.width) / destW);
    const x1 = Math.max(x0 + 1, Math.floor(((px + 1) * mask.width) / destW));
    const y0 = Math.floor((py * mask.height) / destH);
    const y1 = Math.max(y0 + 1, Math.floor(((py + 1) * mask.height) / destH));
    let ink = 0;
    let total = 0;
    for (let y = y0; y < y1 && y < mask.height; y++) {
        for (let x = x0; x < x1 && x < mask.width; x++) {
            total++;
            if (bitAt(mask, x, y))
                ink++;
        }
    }
    return total > 0 && ink * 2 >= total;
}
function paintRow(cells, ink) {
    const line = cells.join('').replace(/ +$/, '');
    if (line.length === 0)
        return '';
    return `\x1b[38;2;${ink.r};${ink.g};${ink.b}m${line}\x1b[0m`;
}
