import React from 'react';
import type { ClickEvent } from '../../ink/events/click-event.js';
import type { ToolRow } from '../../channel.js';
type Props = {
    tool: ToolRow;
    /** Adds the top margin between messages (CC: addMargin). */
    addMargin: boolean;
    /** Ctrl+O verbose: show full args/result instead of previews. */
    verbose: boolean;
    /** Header-only: hide the `⎿` body (settled tools that are not pinned). */
    collapsed?: boolean;
    /** Message-selection mode highlight. */
    isSelected?: boolean;
    /** Row expanded on its own (persistent hover-grey background, CC). */
    isExpanded?: boolean;
    onClick?(event: ClickEvent): void;
};
/**
 * Tool-call card: `● Edit /path` header with a blinking status dot, then the
 * structured body under a `  ⎿  ` gutter — diff hunks in red/green, terminal
 * output, read content — instead of the raw result dump (ported from the
 * leak's `AssistantToolUseMessage.tsx` + the dsh-tools presentation views the
 * channel captures per call).
 */
export declare function AssistantToolUseMessage({ tool, addMargin, verbose, collapsed, isSelected, isExpanded, onClick, }: Props): React.ReactNode;
export {};
//# sourceMappingURL=AssistantToolUseMessage.d.ts.map