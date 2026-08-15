/**
 * A 4-row outline block font for the splash wordmark, painted with a
 * horizontal color gradient plus an optional moving highlight. Glyphs are
 * 5 columns wide; only the letters the tagline needs are defined.
 */
export interface Rgb {
    r: number;
    g: number;
    b: number;
}
/**
 * Render `text` in the 4-row outline block font. The gradient runs `from` → `to`
 * across the full line width; a SWEEP_WINDOW-wide highlight mixed toward
 * `flash` travels left to right (one column per `stepMs`).
 * @param text - Text to render; only D, E, P, S, K, H, A, R, N have glyphs.
 * @param time - Elapsed time in milliseconds; drives the sweep. Pass 0 for a static line.
 * @param from - Gradient start color at the left edge.
 * @param to - Gradient end color at the right edge.
 * @param flash - Highlight color mixed into the moving sweep window.
 * @param stepMs - Milliseconds per column of sweep advance (default 60).
 * @returns Four ANSI rows, one per block-font line.
 */
export declare function renderBigText(text: string, time: number, from: Rgb, to: Rgb, flash: Rgb, stepMs?: number): string[];
/**
 * One-color outline word, no sweep. Used by the monochrome splash.
 * @param text - Letters to draw.
 * @param color - Ink color for every filled cell.
 * @returns Four ANSI rows.
 */
export declare function renderBigTextSolid(text: string, color: Rgb): string[];
//# sourceMappingURL=bigfont.d.ts.map