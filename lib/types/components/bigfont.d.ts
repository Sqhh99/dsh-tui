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
    r: number;
    g: number;
    b: number;
}
/**
 * Terminal columns a wordmark occupies (gaps between letters, none trailing).
 * @param text - Letters and spaces to measure.
 * @param tracking - Columns between adjacent letters.
 * @returns Width in columns.
 */
export declare function wordmarkColumns(text: string, tracking?: number): number;
/**
 * Letter tracking that sets `text` to exactly `columns` wide, so stacked
 * wordmark lines of different letter counts justify to the same edge as they
 * do in docs/assets/logo.png.
 * @param text - Letters to fit.
 * @param columns - Target width in terminal columns.
 * @returns Tracking to pass to the render functions; at least 1.
 */
export declare function trackingToFit(text: string, columns: number): number;
/**
 * Paint `text` in the wordmark face, ramping `stops` left to right.
 * @param text - Text to draw; letters without a glyph fall back to a box.
 * @param stops - One or more colors sampled across the line's width.
 * @param tracking - Columns between letters (see `trackingToFit`).
 * @returns `FONT_ROWS` ANSI strings, one per terminal row.
 */
export declare function renderBigText(text: string, stops: readonly Rgb[], tracking?: number): string[];
/**
 * One-color wordmark, no ramp.
 * @param text - Letters to draw.
 * @param color - Ink for every filled cell.
 * @param tracking - Columns between letters.
 * @returns `FONT_ROWS` ANSI rows.
 */
export declare function renderBigTextSolid(text: string, color: Rgb, tracking?: number): string[];
//# sourceMappingURL=bigfont.d.ts.map