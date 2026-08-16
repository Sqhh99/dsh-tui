import { describe, expect, it } from 'vitest'
import type { ChatRow } from '../src/channel.ts'
import {
  chainSummaryRowId,
  collapseToolChains,
  displayName,
  findToolChains,
  summarizeToolChain,
} from '../src/components/toolChain.ts'

let nextId = 1
function row(kind: ChatRow['kind'], toolName?: string): ChatRow {
  const base: ChatRow = { id: nextId++, kind, text: '' }
  if (toolName === undefined) return base
  return {
    ...base,
    tool: {
      callId: `call-${base.id}`,
      name: toolName,
      argsText: '',
      status: 'ok',
      startedAt: 0,
    },
  }
}

describe('displayName', () => {
  it('maps known dsh tool ids to their display names', () => {
    expect(displayName('bash')).toBe('Bash')
    expect(displayName('todo_write')).toBe('TodoWrite')
    expect(displayName('subagent')).toBe('Task')
  })

  it('capitalizes anything else and tolerates an empty id', () => {
    expect(displayName('custom_thing')).toBe('Custom_thing')
    expect(displayName('')).toBe('')
  })
})

describe('findToolChains', () => {
  it('anchors on an assistant row followed by tool rows', () => {
    const rows = [row('user'), row('assistant'), row('tool', 'read'), row('tool', 'bash')]
    const chains = findToolChains(rows)
    expect([...chains.keys()]).toEqual([rows[1]!.id])
    expect(chains.get(rows[1]!.id)).toEqual({
      anchorId: rows[1]!.id,
      count: 2,
      names: ['Read', 'Bash'],
    })
  })

  it('anchors on a reasoning row too — dsh-tui keeps thinking as its own kind', () => {
    const rows = [row('reasoning'), row('tool', 'grep')]
    expect(findToolChains(rows).get(rows[0]!.id)?.count).toBe(1)
  })

  it('ends the run at the first non-tool row', () => {
    const rows = [row('assistant'), row('tool', 'read'), row('user'), row('tool', 'bash')]
    expect(findToolChains(rows).get(rows[0]!.id)?.count).toBe(1)
  })

  it('ignores an anchor with no tool run', () => {
    const rows = [row('assistant'), row('user'), row('tool', 'read')]
    expect(findToolChains(rows).has(rows[0]!.id)).toBe(false)
  })

  it('dedupes repeated tool names but keeps first-call order', () => {
    const rows = [row('assistant'), row('tool', 'bash'), row('tool', 'read'), row('tool', 'bash')]
    expect(findToolChains(rows).get(rows[0]!.id)?.names).toEqual(['Bash', 'Read'])
  })
})

describe('summarizeToolChain', () => {
  it('reads as the web client does', () => {
    expect(summarizeToolChain({ anchorId: 1, count: 3, names: ['Read', 'Bash'] }))
      .toBe('3 tool calls · Read, Bash')
  })

  it('singularizes one call', () => {
    expect(summarizeToolChain({ anchorId: 1, count: 1, names: ['Read'] })).toBe('1 tool call · Read')
  })

  it('drops the name list when there is nothing to name', () => {
    expect(summarizeToolChain({ anchorId: 1, count: 2, names: [] })).toBe('2 tool calls')
  })
})

describe('collapseToolChains', () => {
  it('keeps the anchor and replaces its tool run with one summary entry', () => {
    const rows = [row('user'), row('assistant'), row('tool', 'read'), row('tool', 'bash'), row('user')]
    const anchorId = rows[1]!.id
    const out = collapseToolChains(rows, new Set([anchorId]))
    expect(out.map(entry => entry.kind)).toEqual(['user', 'assistant', 'chain', 'user'])
    const summary = out[2]!
    expect(summary.item).toBe('chain')
    expect(summary.id).toBe(chainSummaryRowId(anchorId))
    // Negated anchor ids can never collide with real (positive) row ids.
    expect(summary.id).toBeLessThan(0)
  })

  it('leaves an expanded chain untouched', () => {
    const rows = [row('assistant'), row('tool', 'read')]
    const out = collapseToolChains(rows, new Set())
    expect(out.map(entry => entry.kind)).toEqual(['assistant', 'tool'])
  })

  it('folds several chains independently', () => {
    const rows = [
      row('assistant'), row('tool', 'read'),
      row('assistant'), row('tool', 'bash'), row('tool', 'grep'),
    ]
    const out = collapseToolChains(rows, new Set([rows[0]!.id, rows[2]!.id]))
    expect(out.map(entry => entry.kind)).toEqual(['assistant', 'chain', 'assistant', 'chain'])
  })

  it('folds only the chains named as collapsed', () => {
    const rows = [
      row('assistant'), row('tool', 'read'),
      row('assistant'), row('tool', 'bash'),
    ]
    const out = collapseToolChains(rows, new Set([rows[2]!.id]))
    expect(out.map(entry => entry.kind)).toEqual(['assistant', 'tool', 'assistant', 'chain'])
  })

  it('never emits a duplicate id, so React keys and height maps stay sound', () => {
    const rows = [row('assistant'), row('tool', 'read'), row('assistant'), row('tool', 'bash')]
    const out = collapseToolChains(rows, new Set([rows[0]!.id, rows[2]!.id]))
    expect(new Set(out.map(entry => entry.id)).size).toBe(out.length)
  })
})
