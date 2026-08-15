import React from 'react';
import { type WhaleFrame } from './whaleFrames.js';
type Rgb = readonly [number, number, number];
export declare function renderWhaleRows(frame: WhaleFrame, fill?: Rgb, patch?: Rgb): string[];
export declare const STANDARD_FRAME_INDEX = 0;
export declare function WhaleArt({ frameIndex, width, fill, patch, }: {
    frameIndex?: number;
    width?: number;
    fill?: Rgb;
    patch?: Rgb;
}): React.ReactNode;
export {};
//# sourceMappingURL=Whale.d.ts.map