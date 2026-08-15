import React from 'react';
import { type Theme } from '../theme.js';
import { type Rgb } from './bigfont.js';
/**
 * Brand ramp for the wordmark, left to right: `remember` is the palette's
 * strongest brand blue against its own background and `claude` the mid one,
 * so the ramp falls away from the reader in both light and dark without
 * needing separate stops — and user themes inherit it with no extra keys.
 * Falls back to flat ink on `dark-ansi`, which has no truecolor to ramp.
 */
export declare function brandRamp(theme: Theme, fallback: Rgb): Rgb[];
/**
 * Splash: the whale from docs/assets/deepseek.png as a solid half-block
 * silhouette, the two-line wordmark ramped through the theme's brand blues,
 * then model / effort / version and the cwd. Narrow terminals drop the whale
 * and leave the wordmark standing alone.
 */
export declare function LogoV2({ model, effort, cwd, }: {
    model: string;
    effort?: string | undefined;
    cwd: string;
}): React.ReactNode;
//# sourceMappingURL=LogoV2.d.ts.map