import React from 'react';
type Props = {
    isError: boolean;
    isUnresolved: boolean;
    shouldAnimate: boolean;
};
/**
 * The status dot on tool-call rows (ported from the leak's ToolUseLoader):
 * blinking `●` while running, green on success, red on error, dim when queued.
 * Uses themed Text so `success`/`error` resolve; the settled colors are the
 * brighter subagent green/red so a collapsed header is still readable.
 */
export declare function ToolUseLoader({ isError, isUnresolved, shouldAnimate, }: Props): React.ReactNode;
export {};
//# sourceMappingURL=ToolUseLoader.d.ts.map