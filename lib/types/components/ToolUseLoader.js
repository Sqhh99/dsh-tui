import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from '../ui.js';
import { useBlink } from '../hooks/useBlink.js';
import { BLACK_CIRCLE } from '../cc/figures.js';
/**
 * The status dot on tool-call rows (ported from the leak's ToolUseLoader):
 * blinking `●` while running, green on success, red on error, dim when queued.
 * Uses themed Text so `success`/`error` resolve; the settled colors are the
 * brighter subagent green/red so a collapsed header is still readable.
 */
export function ToolUseLoader({ isError, isUnresolved, shouldAnimate, }) {
    const [ref, isBlinking] = useBlink(shouldAnimate);
    const color = isUnresolved
        ? 'inactive'
        : isError
            ? 'red_FOR_SUBAGENTS_ONLY'
            : 'green_FOR_SUBAGENTS_ONLY';
    const char = !shouldAnimate || isBlinking || isError || !isUnresolved
        ? BLACK_CIRCLE
        : ' ';
    return (_jsx(Box, { ref: ref, minWidth: 2, children: _jsx(Text, { color: color, dimColor: isUnresolved, children: char }) }));
}
