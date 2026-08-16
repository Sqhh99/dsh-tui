/**
 * Tool-chain grouping for the transcript, ported from the web client's
 * trajectory view (`ui-trajectory/src/client/TrajectoryTable.tsx`:
 * `assistantToolCalls` / `summarizeAssistantTools` / `collapseAssistantRecords`).
 *
 * A chain is a step head followed by the tool calls that step made. Upstream
 * folds thinking into the assistant `message` cell, so its anchor is always a
 * `message` record; dsh-tui keeps reasoning as its own row kind, so the anchor
 * here is an `assistant` **or** `reasoning` row. The rule is otherwise
 * identical: the chain is the maximal run of immediately-following `tool` rows,
 * and any other row kind ends it.
 *
 * Collapsing keeps the anchor row visible and replaces its tool run with one
 * summary row (`… 3 tool calls · Read, Bash`), exactly as upstream does.
 *
 * This module is deliberately React-free so the grouping is unit-testable
 * without a renderer.
 */
import type { ChatRow } from '../channel.js';
/**
 * Tool display names: DSH emits lowercase tool ids (`bash`); Claude Code and
 * the web client show capitalized names (`Bash`). Map the common ones, fall
 * back to the id with its first letter uppercased.
 * @param name - The raw dsh tool id.
 * @returns The display name.
 */
export declare function displayName(name: string): string;
/** One collapsible chain: the anchor row and the tool run that follows it. */
export interface ToolChain {
    /** Row id of the anchor (assistant/reasoning) row — the collapse key. */
    readonly anchorId: number;
    /** Number of tool calls in the run. */
    readonly count: number;
    /** Distinct tool display names, in first-call order. */
    readonly names: readonly string[];
}
/** A transcript entry to render: either a real row or a collapsed chain. */
export type TranscriptItem = {
    readonly item: 'row';
    readonly id: number;
    readonly kind: ChatRow['kind'];
    readonly row: ChatRow;
} | {
    readonly item: 'chain';
    readonly id: number;
    readonly kind: 'chain';
    readonly chain: ToolChain;
};
/**
 * Index every collapsible chain in `rows` by its anchor row id.
 *
 * Only rows whose tool run is non-empty are indexed, so callers can test
 * "does this row anchor a chain?" with a single lookup.
 * @param rows - The transcript rows, in display order.
 * @returns Chains keyed by anchor row id.
 */
export declare function findToolChains(rows: readonly ChatRow[]): Map<number, ToolChain>;
/**
 * The collapsed chain's one-line summary, e.g. `3 tool calls · Read, Bash`
 * (upstream `summarizeAssistantTools`).
 * @param chain - The chain to describe.
 * @returns The summary text, without the leading ellipsis.
 */
export declare function summarizeToolChain(chain: ToolChain): string;
/**
 * The synthetic row id a collapsed chain's summary row renders under. Row ids
 * from the channel are positive and monotonically increasing, so negating the
 * anchor's id can never collide with a real row in the margin / measured-height
 * / React-key maps.
 * @param anchorId - The chain anchor's row id.
 * @returns The summary row's id.
 */
export declare function chainSummaryRowId(anchorId: number): number;
/**
 * Rewrite the transcript with every collapsed chain folded into one summary
 * entry (upstream `collapseAssistantRecords`). The anchor row itself stays
 * visible; only its tool run is replaced.
 * @param rows - The transcript rows, in display order.
 * @param collapsed - Anchor row ids whose chains are collapsed.
 * @param chains - Chain index from {@link findToolChains}.
 * @returns The entries to render, in display order.
 */
export declare function collapseToolChains(rows: readonly ChatRow[], collapsed: ReadonlySet<number>, chains?: ReadonlyMap<number, ToolChain>): TranscriptItem[];
//# sourceMappingURL=toolChain.d.ts.map