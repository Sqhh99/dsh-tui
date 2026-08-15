/**
 * Compact side-view whale for the splash, matched to docs/assets/logo.png:
 * body faces left, tail flukes up on the right, white eye and belly, dashed
 * water underneath. Palette: B fill · W contrasting patch · `.` empty.
 */
export interface WhaleFrame {
    readonly name: string;
    readonly rows: readonly string[];
}
/** 28×16 sprite. Even row count so half-block pairing yields 8 terminal rows. */
export declare const WHALE_FRAMES: readonly WhaleFrame[];
export interface OpeningStep {
    readonly frame: number;
    readonly ms: number;
}
/** Short blink, then the static logo pose. */
export declare const OPENING_SEQUENCE: readonly OpeningStep[];
//# sourceMappingURL=whaleFrames.d.ts.map