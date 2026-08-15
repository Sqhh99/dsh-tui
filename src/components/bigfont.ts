import { interpolateColor } from './Spinner/spinnerUtils.js'

/**
 * The splash wordmark font: a 6×7 monoline pixel face traced from
 * docs/assets/logo.png, folded into half-block rows so one glyph occupies
 * 6 terminal columns and 4 rows.
 *
 * Half-blocks make the sprite pixel square: a terminal cell is about 1 wide
 * by 2 tall, so a `▀`/`▄` half is as tall as it is wide. That keeps the
 * 1-pixel strokes of the reference face even in both directions — the older
 * 4×3 face fused its stems and turned `S` into `a`.
 */

export interface Rgb {
  r: number
  g: number
  b: number
}

/** Glyph body height in sprite pixels; the 8th row pads out the last row pair. */
const GLYPH_HEIGHT = 7
const GLYPH_WIDTH = 6
/** Terminal rows one wordmark line occupies, at two sprite pixels per row. */
const FONT_ROWS = 4

/** `#` ink, `.` empty. Six columns by seven rows, monoline strokes. */
const GLYPHS: Record<string, readonly string[]> = {
  D: ['#####.', '#....#', '#....#', '#....#', '#....#', '#....#', '#####.'],
  E: ['######', '#.....', '#.....', '#####.', '#.....', '#.....', '######'],
  P: ['#####.', '#....#', '#....#', '#####.', '#.....', '#.....', '#.....'],
  S: ['.#####', '#.....', '#.....', '.####.', '.....#', '.....#', '#####.'],
  // The arms kink at row 2/4 so a 1-pixel diagonal can still reach both the
  // stem at column 1 and the cap at column 5.
  K: ['#....#', '#...#.', '#.##..', '##....', '#.##..', '#...#.', '#....#'],
  H: ['#....#', '#....#', '#....#', '######', '#....#', '#....#', '#....#'],
  A: ['.####.', '#....#', '#....#', '######', '#....#', '#....#', '#....#'],
  R: ['#####.', '#....#', '#....#', '#####.', '#..#..', '#...#.', '#....#'],
  N: ['#....#', '##...#', '#.#..#', '#..#.#', '#...##', '#....#', '#....#'],
}

/** Drawn for any letter without a glyph, so a typo is visible, not invisible. */
const FALLBACK: readonly string[] = [
  '######',
  '#....#',
  '#....#',
  '#....#',
  '#....#',
  '#....#',
  '######',
]

/** Default columns between letters. */
const TRACKING = 1
/** Columns for a space between words. */
const WORD_GAP = 3

/**
 * Terminal columns a wordmark occupies (gaps between letters, none trailing).
 * @param text - Letters and spaces to measure.
 * @param tracking - Columns between adjacent letters.
 * @returns Width in columns.
 */
export function wordmarkColumns(text: string, tracking: number = TRACKING): number {
  let width = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      width += WORD_GAP
      continue
    }
    if (width > 0 && text[i - 1] !== ' ') width += tracking
    width += GLYPH_WIDTH
  }
  return width
}

/**
 * Letter tracking that sets `text` to exactly `columns` wide, so stacked
 * wordmark lines of different letter counts justify to the same edge as they
 * do in docs/assets/logo.png.
 * @param text - Letters to fit.
 * @param columns - Target width in terminal columns.
 * @returns Tracking to pass to the render functions; at least 1.
 */
export function trackingToFit(text: string, columns: number): number {
  const letters = [...text].filter((ch) => ch !== ' ').length
  if (letters < 2) return TRACKING
  const spare = columns - letters * GLYPH_WIDTH
  return Math.max(TRACKING, Math.floor(spare / (letters - 1)))
}

const esc = (rgb: Rgb): string => `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`
const RESET = '\x1b[39m'

/** Sample a multi-stop ramp. `t` runs 0→1 across the wordmark. */
function rampAt(stops: readonly Rgb[], t: number): Rgb {
  if (stops.length === 1) return stops[0]
  const span = (stops.length - 1) * Math.min(Math.max(t, 0), 1)
  const i = Math.min(Math.floor(span), stops.length - 2)
  return interpolateColor(stops[i], stops[i + 1], span - i)
}

/**
 * Paint `text` in the wordmark face, ramping `stops` left to right.
 * @param text - Text to draw; letters without a glyph fall back to a box.
 * @param stops - One or more colors sampled across the line's width.
 * @param tracking - Columns between letters (see `trackingToFit`).
 * @returns `FONT_ROWS` ANSI strings, one per terminal row.
 */
export function renderBigText(
  text: string,
  stops: readonly Rgb[],
  tracking: number = TRACKING,
): string[] {
  const width = wordmarkColumns(text, tracking)
  // Sprite columns, one per terminal column; `undefined` rows are the gaps.
  const columns: (readonly string[] | undefined)[] = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i] ?? ''
    if (ch === ' ') {
      for (let n = 0; n < WORD_GAP; n++) columns.push(undefined)
      continue
    }
    if (columns.length > 0 && text[i - 1] !== ' ') {
      for (let n = 0; n < tracking; n++) columns.push(undefined)
    }
    const glyph = GLYPHS[ch] ?? FALLBACK
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      columns.push(glyph.map((row) => row[x] ?? '.'))
    }
  }

  const rows: string[] = []
  for (let row = 0; row < FONT_ROWS; row++) {
    const top = row * 2
    let out = ''
    let current = ''
    for (let x = 0; x < columns.length; x++) {
      const glyph = columns[x]
      const upper = glyph !== undefined && top < GLYPH_HEIGHT && glyph[top] === '#'
      const lower = glyph !== undefined && top + 1 < GLYPH_HEIGHT && glyph[top + 1] === '#'
      if (!upper && !lower) {
        if (current !== '') {
          out += RESET
          current = ''
        }
        out += ' '
        continue
      }
      const seq = esc(rampAt(stops, width <= 1 ? 0 : x / (width - 1)))
      if (seq !== current) {
        out += seq
        current = seq
      }
      out += upper && lower ? '█' : upper ? '▀' : '▄'
    }
    if (current !== '') out += RESET
    rows.push(out.replace(/ +$/, ''))
  }
  return rows
}

/**
 * One-color wordmark, no ramp.
 * @param text - Letters to draw.
 * @param color - Ink for every filled cell.
 * @param tracking - Columns between letters.
 * @returns `FONT_ROWS` ANSI rows.
 */
export function renderBigTextSolid(
  text: string,
  color: Rgb,
  tracking: number = TRACKING,
): string[] {
  return renderBigText(text, [color], tracking)
}
