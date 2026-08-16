import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from '../ui.js';
import { t } from '../i18n.js';
import { Pane } from './design-system/Pane.js';
import { ListItem } from './design-system/ListItem.js';
import { Byline } from './design-system/Byline.js';
import { KeyboardShortcutHint } from './design-system/KeyboardShortcutHint.js';
import { STATUS_SEGMENTS } from '../statusLinePrefs.js';
/** i18n key for each segment's row label. */
const LABEL_KEY = {
    contextBar: 'statusline-segment-contextBar',
    model: 'statusline-segment-model',
    tps: 'statusline-segment-tps',
    effort: 'statusline-segment-effort',
    cache: 'statusline-segment-cache',
    tokens: 'statusline-segment-tokens',
    git: 'statusline-segment-git',
    cwd: 'statusline-segment-cwd',
    title: 'statusline-segment-title',
    hint: 'statusline-segment-hint',
};
/**
 * `/statusline` segment editor, in the same Pane + ListItem style as the other
 * pickers. Unlike them this is a multi-toggle, so `isSelected` (the ✓) means
 * "this segment is on" rather than "this is the one chosen value" — the
 * ModelPicker's direct ListItem mapping rather than the single-choice Select.
 *
 * The footer below re-renders from the same draft, so toggling previews live.
 */
export function StatusLinePicker({ draft, focusIndex, }) {
    return (_jsxs(Pane, { color: "permission", children: [_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: "remember", bold: true, children: t('statusline-title') }) }), STATUS_SEGMENTS.map((segment, index) => (_jsx(ListItem, { isFocused: index === focusIndex, isSelected: draft[segment], children: t(LABEL_KEY[segment]) }, segment)))] }), _jsx(Text, { dimColor: true, italic: true, children: _jsxs(Byline, { children: [_jsx(KeyboardShortcutHint, { shortcut: "Space", action: t('statusline-hint-toggle'), bold: true }), _jsx(KeyboardShortcutHint, { shortcut: "Enter", action: t('statusline-hint-save') }), _jsx(KeyboardShortcutHint, { shortcut: "Esc", action: t('statusline-hint-cancel') })] }) })] }));
}
