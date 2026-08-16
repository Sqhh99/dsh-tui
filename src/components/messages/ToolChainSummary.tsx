import React from 'react'
import { Box, Text } from '../../ui.js'
import type { ClickEvent } from '../../ink/events/click-event.js'
import { stringWidth } from '../../ink/stringWidth.js'
import { truncateToWidth } from '../../ink/truncateToWidth.js'

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
export function ToolChainSummary({
  summary,
  addMargin,
  isSelected = false,
  columns,
  onClick,
}: {
  /** Pre-rendered summary text (`3 tool calls · Read, Bash`). Passed in as a
   *  string rather than the chain object so the memoized row compares by
   *  value — the grouping pass rebuilds its arrays every render. */
  summary: string
  /** Adds the top margin between messages (CC: addMargin). */
  addMargin: boolean
  /** Message-selection mode highlight. */
  isSelected?: boolean
  /** Terminal width, so the summary never wraps onto a second line. */
  columns: number
  onClick?(event: ClickEvent): void
}): React.ReactNode {
  // 2 columns of padding plus the `… ` prefix; leave a cell of slack so a
  // wide-glyph tool name can never spill into a wrap.
  const budget = Math.max(8, columns - 7)
  const text =
    stringWidth(summary) <= budget ? summary : `${truncateToWidth(summary, budget - 1)}…`

  return (
    <Box
      marginTop={addMargin ? 1 : 0}
      paddingLeft={2}
      width="100%"
      backgroundColor={isSelected ? 'messageActionsBackground' : undefined}
      onClick={onClick}
    >
      <Text dimColor>… {text}</Text>
    </Box>
  )
}
