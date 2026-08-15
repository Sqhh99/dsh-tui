import { describe, expect, it } from 'vitest'
import type { ToolCallView, ToolResultView } from '../src/channel.ts'

function isCallView(value: unknown): value is ToolCallView {
  if (value === null || typeof value !== 'object') return false
  const card = (value as { card?: unknown }).card
  return card === 'generic' || card === 'terminal' || card === 'diff'
}

function isResultView(value: unknown): value is ToolResultView {
  if (value === null || typeof value !== 'object') return false
  const card = (value as { card?: unknown }).card
  return card === 'generic' || card === 'terminal' || card === 'diff' || card === 'read' || card === 'search'
}

describe('tool card views', () => {
  it('accepts the four shipped card kinds', () => {
    expect(isCallView({ card: 'generic', title: 'Read' })).toBe(true)
    expect(isCallView({ card: 'terminal', title: 'ls' })).toBe(true)
    expect(isCallView({ card: 'diff', title: 'Write', diffs: [] })).toBe(true)
    expect(isCallView({ card: 'search' })).toBe(false)
    expect(isResultView({ card: 'search', shape: 'paths', paths: [], truncated: false, total: 0 })).toBe(true)
    expect(isResultView({ card: 'web' })).toBe(false)
  })
})
