export interface BitMask {
    readonly width: number;
    readonly height: number;
    /** Row-major 1-bit, MSB first, each row padded to a whole byte. */
    readonly bits: Uint8Array;
}
export interface Rgb {
    r: number;
    g: number;
    b: number;
}
export type MosaicGlyphs = 'half' | 'braille' | 'sextant';
/** Hide the whale when the wordmark column would not fit beside it. */
export declare const WHALE_MIN_COLUMNS = 20;
/** Roughly half the wordmark, the whale-to-text ratio of docs/assets/logo.png. */
export declare const WHALE_MAX_COLUMNS = 30;
/** `DEEPSEEK` at 8×6 glyph columns plus 7 letter gaps. */
export declare const WORDMARK_COLUMNS: number;
export declare const WHALE_GAP = 4;
export declare const LOGO_MASK: BitMask;
/**
 * Packed-bit test.
 * @param mask - 1-bit image.
 * @param x - Column in `mask` space.
 * @param y - Row in `mask` space.
 * @returns Whether that pixel is ink.
 */
export declare function bitAt(mask: BitMask, x: number, y: number): boolean;
/**
 * Whale box that fits beside the wordmark and keeps the mask aspect
 * against a 1:2 terminal cell.
 * @param columns - Full terminal width.
 * @param aspect - Width / height of the whale mask.
 * @returns Cell size, or `null` when the whale would be too narrow.
 */
export declare function whaleCellSize(columns: number, aspect?: number): {
    columns: number;
    rows: number;
} | null;
/**
 * Half-block cell: upper and lower pixel → `▀` / `▄` / `█` / space.
 * These glyphs are in every Windows Terminal / VS Code font; sextants are not.
 * @param upper - Top pixel is ink.
 * @param lower - Bottom pixel is ink.
 * @returns One terminal cell.
 */
export declare function halfBlockChar(upper: boolean, lower: boolean): string;
/**
 * Unicode 13 sextant for a 2×3 bit mask (bit0=TL, 1=TR, 2=ML, 3=MR, 4=BL, 5=BR).
 * @param mask - Six-bit pattern.
 * @returns One terminal cell.
 */
export declare function sextantChar(mask: number): string;
/**
 * Braille cell for an 8-dot 2×4 mask (bit0=dot1 … bit7=dot8).
 * @param mask - Eight-bit pattern.
 * @returns One terminal cell.
 */
export declare function brailleChar(mask: number): string;
export declare function preferGlyphs(): MosaicGlyphs;
/**
 * Sample `mask` onto a `columns`-wide mosaic painted with `ink`.
 * @param mask - 1-bit source.
 * @param columns - Terminal columns for this box (not the full screen).
 * @param ink - Truecolor foreground for ink cells.
 * @param options - Glyph set and optional explicit row count.
 * @returns One ANSI string per terminal row, each `columns` cells wide.
 */
export declare function mosaicRows(mask: BitMask, columns: number, ink: Rgb, options?: {
    glyphs?: MosaicGlyphs;
    rows?: number;
}): string[];
//# sourceMappingURL=logoMosaic.d.ts.map