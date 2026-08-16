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

import type { ChatRow } from '../channel.js'

/** Row kinds that can head a tool chain. */
const ANCHOR_KINDS: ReadonlySet<ChatRow['kind']> = new Set(['assistant', 'reasoning'])

/**
 * Tool display names: DSH emits lowercase tool ids (`bash`); Claude Code and
 * the web client show capitalized names (`Bash`). Map the common ones, fall
 * back to the id with its first letter uppercased.
 * @param name - The raw dsh tool id.
 * @returns The display name.
 */
export function displayName(name: string): string {
  const KNOWN: Record<string, string> = {
    bash: 'Bash',
    powershell: 'PowerShell',
    read: 'Read',
    glob: 'Glob',
    grep: 'Grep',
    write: 'Write',
    edit: 'Edit',
    todo_write: 'TodoWrite',
    subagent: 'Task',
    web_search: 'WebSearch',
  }
  const mapped = KNOWN[name]
  if (mapped) return mapped
  if (name.length === 0) return name
  return name[0]!.toUpperCase() + name.slice(1)
}

/** One collapsible chain: the anchor row and the tool run that follows it. */
export interface ToolChain {
  /** Row id of the anchor (assistant/reasoning) row — the collapse key. */
  readonly anchorId: number
  /** Number of tool calls in the run. */
  readonly count: number
  /** Distinct tool display names, in first-call order. */
  readonly names: readonly string[]
}

/** A transcript entry to render: either a real row or a collapsed chain. */
export type TranscriptItem =
  | { readonly item: 'row'; readonly id: number; readonly kind: ChatRow['kind']; readonly row: ChatRow }
  | { readonly item: 'chain'; readonly id: number; readonly kind: 'chain'; readonly chain: ToolChain }

/**
 * Index every collapsible chain in `rows` by its anchor row id.
 *
 * Only rows whose tool run is non-empty are indexed, so callers can test
 * "does this row anchor a chain?" with a single lookup.
 * @param rows - The transcript rows, in display order.
 * @returns Chains keyed by anchor row id.
 */
export function findToolChains(rows: readonly ChatRow[]): Map<number, ToolChain> {
  const chains = new Map<number, ToolChain>()
  for (let index = 0; index < rows.length; index++) {
    const anchor = rows[index]!
    if (!ANCHOR_KINDS.has(anchor.kind)) continue
    const names: string[] = []
    const seen = new Set<string>()
    let count = 0
    for (let scan = index + 1; scan < rows.length; scan++) {
      const candidate = rows[scan]!
      if (candidate.kind !== 'tool') break
      count++
      const name = displayName(candidate.tool?.name ?? '')
      if (name !== '' && !seen.has(name)) {
        seen.add(name)
        names.push(name)
      }
    }
    if (count > 0) chains.set(anchor.id, { anchorId: anchor.id, count, names })
  }
  return chains
}

/**
 * The collapsed chain's one-line summary, e.g. `3 tool calls · Read, Bash`
 * (upstream `summarizeAssistantTools`).
 * @param chain - The chain to describe.
 * @returns The summary text, without the leading ellipsis.
 */
export function summarizeToolChain(chain: ToolChain): string {
  const summary = `${chain.count} tool ${chain.count === 1 ? 'call' : 'calls'}`
  return chain.names.length > 0 ? `${summary} · ${chain.names.join(', ')}` : summary
}

/**
 * The synthetic row id a collapsed chain's summary row renders under. Row ids
 * from the channel are positive and monotonically increasing, so negating the
 * anchor's id can never collide with a real row in the margin / measured-height
 * / React-key maps.
 * @param anchorId - The chain anchor's row id.
 * @returns The summary row's id.
 */
export function chainSummaryRowId(anchorId: number): number {
  return -anchorId
}

/**
 * Rewrite the transcript with every collapsed chain folded into one summary
 * entry (upstream `collapseAssistantRecords`). The anchor row itself stays
 * visible; only its tool run is replaced.
 * @param rows - The transcript rows, in display order.
 * @param collapsed - Anchor row ids whose chains are collapsed.
 * @param chains - Chain index from {@link findToolChains}.
 * @returns The entries to render, in display order.
 */
export function collapseToolChains(
  rows: readonly ChatRow[],
  collapsed: ReadonlySet<number>,
  chains: ReadonlyMap<number, ToolChain> = findToolChains(rows),
): TranscriptItem[] {
  const out: TranscriptItem[] = []
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]!
    out.push({ item: 'row', id: row.id, kind: row.kind, row })
    const chain = collapsed.has(row.id) ? chains.get(row.id) : undefined
    if (chain === undefined) continue
    out.push({
      item: 'chain',
      id: chainSummaryRowId(row.id),
      kind: 'chain',
      chain,
    })
    // Skip the folded tool run. `chain.count` is exactly the run length that
    // findToolChains measured over this same list.
    index += chain.count
  }
  return out
}
