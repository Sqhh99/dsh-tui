import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from '../../ui.js';
import { stringWidth } from '../../ink/stringWidth.js';
import { truncateToWidth } from '../../ink/truncateToWidth.js';
/**
 * The single row a collapsed tool chain folds into, in the web client's
 * collapsed-summary style (`TrajectoryTable.module.css`
 * `.collapsedTurnContent`): a leading `…` as the affordance, then the summary
 * text, both muted — no status dot and no kind badge, which upstream also
 * suppresses on a collapsed row.
 *
 * A single click expands the chain again (upstream: click or Enter/Space on
 * the summary row).
 */
export function ToolChainSummary({ summary, addMargin, isSelected = false, columns, onClick, }) {
    // 2 columns of padding plus the `… ` prefix; leave a cell of slack so a
    // wide-glyph tool name can never spill into a wrap.
    const budget = Math.max(8, columns - 7);
    const text = stringWidth(summary) <= budget ? summary : `${truncateToWidth(summary, budget - 1)}…`;
    return (_jsx(Box, { marginTop: addMargin ? 1 : 0, paddingLeft: 2, width: "100%", backgroundColor: isSelected ? 'messageActionsBackground' : undefined, onClick: onClick, children: _jsxs(Text, { dimColor: true, children: ["\u2026 ", text] }) }));
}
