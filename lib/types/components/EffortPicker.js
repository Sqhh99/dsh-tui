import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { t } from '../i18n.js';
import { Box, Text } from '../ui.js';
import { Pane } from './design-system/Pane.js';
import { Select } from './Select.js';
import { Byline } from './design-system/Byline.js';
import { KeyboardShortcutHint } from './design-system/KeyboardShortcutHint.js';
/**
 * `/effort` reasoning-tier picker, in the ThemePicker shape: a
 * permission-colored Pane, the adapter's own tiers as Select rows in the
 * adapter's own display order, and the Enter/Esc hint line. The tier that
 * applies when nothing is pinned is marked so the list is readable before
 * the first request reports a live value.
 */
export function EffortPicker({ efforts, focusIndex, currentEffort, defaultEffort, }) {
    const options = efforts.map(effort => ({
        value: effort.id,
        label: effort.id === defaultEffort ? `${effort.name} ${t('effort-default-suffix')}` : effort.name,
        ...effort.description !== undefined ? { description: effort.description } : {},
    }));
    return (_jsxs(Pane, { color: "permission", children: [_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: "remember", bold: true, children: t('effort-title') }) }), _jsx(Select, { options: options, focusIndex: focusIndex, 
                        // Nothing pinned yet = the adapter's default is what is running.
                        selectedValue: currentEffort ?? defaultEffort })] }), _jsx(Text, { dimColor: true, italic: true, children: _jsxs(Byline, { children: [_jsx(KeyboardShortcutHint, { shortcut: "Enter", action: "confirm", bold: true }), _jsx(KeyboardShortcutHint, { shortcut: "Esc", action: "exit" })] }) })] }));
}
