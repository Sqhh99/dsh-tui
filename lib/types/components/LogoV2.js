import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Box, Text, useTerminalSize } from '../ui.js';
import { getTheme } from '../theme.js';
import { useTheme } from './design-system/ThemeProvider.js';
import { parseRGB } from './Spinner/spinnerUtils.js';
import { renderBigTextSolid } from './bigfont.js';
import { STANDARD_FRAME_INDEX, WhaleArt } from './Whale.js';
import { OPENING_SEQUENCE } from './whaleFrames.js';
const VERSION = (() => {
    try {
        const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'package.json');
        return JSON.parse(readFileSync(pkgPath, 'utf8')).version ?? '0.1.0';
    }
    catch {
        return '0.1.0';
    }
})();
const WHALE_MIN_COLUMNS = 64;
const FULL_WHALE_WIDTH = 28;
const INK_LIGHT = { r: 232, g: 230, b: 224 };
const INK_DARK = { r: 24, g: 24, b: 24 };
function capitalize(text) {
    return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}
function toTriple(color) {
    return [color.r, color.g, color.b];
}
/**
 * Splash matched to docs/assets/logo.png: monochrome leaping whale, 4-row
 * outline wordmark, short blink, then a static header. Narrow terminals
 * drop the whale.
 */
export function LogoV2({ model, effort, cwd, skipIntro = false, }) {
    const [step, setStep] = React.useState(skipIntro ? OPENING_SEQUENCE.length : 0);
    const settled = step >= OPENING_SEQUENCE.length;
    React.useEffect(() => {
        if (settled)
            return;
        const timer = setTimeout(() => {
            setStep(s => s + 1);
        }, OPENING_SEQUENCE[step].ms);
        return () => {
            clearTimeout(timer);
        };
    }, [step, settled]);
    const [themeName] = useTheme();
    const theme = getTheme(themeName);
    const { columns } = useTerminalSize();
    const ink = parseRGB(theme.text) ?? (themeName === 'light' ? INK_DARK : INK_LIGHT);
    const patch = parseRGB(theme.inverseText) ?? (themeName === 'light' ? INK_LIGHT : INK_DARK);
    const showWhale = columns >= WHALE_MIN_COLUMNS;
    const frameIndex = settled ? STANDARD_FRAME_INDEX : OPENING_SEQUENCE[step].frame;
    const bigDeepSeek = renderBigTextSolid('DEEPSEEK', ink);
    const bigHarness = renderBigTextSolid('HARNESS', ink);
    return (_jsx(Box, { flexDirection: "column", marginTop: 1, children: _jsxs(Box, { flexDirection: "row", gap: 3, width: "100%", alignItems: "center", children: [showWhale && (_jsx(WhaleArt, { frameIndex: frameIndex, width: FULL_WHALE_WIDTH, fill: toTriple(ink), patch: toTriple(patch) })), _jsxs(Box, { flexDirection: "column", flexShrink: 1, children: [_jsx(Text, { dimColor: true, wrap: "truncate-end", children: 'dsh-tui  v' + VERSION }), bigDeepSeek.map((row, index) => (_jsx(Text, { wrap: "truncate-end", children: row }, `ds-${index}`))), bigHarness.map((row, index) => (_jsx(Text, { wrap: "truncate-end", children: row }, `h-${index}`))), _jsx(Text, { dimColor: true, wrap: "truncate-end", children: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" }), _jsxs(Text, { wrap: "truncate-end", children: [model, effort !== undefined && _jsx(Text, { dimColor: true, children: '  ·  ' + capitalize(effort) + ' effort' })] }), _jsx(Text, { dimColor: true, wrap: "truncate-end", children: '>_  ' + cwd })] })] }) }));
}
