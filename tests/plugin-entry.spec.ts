import { describe, expect, it } from 'vitest'
import { Config, inject, name } from '../src/index.ts'

describe('Cordis plugin face', () => {
  it('exports the registry name and agents injection', () => {
    expect(name).toBe('dsh-tui')
    expect(inject).toEqual(['agents'])
  })

  it('treats route fields as optional so persisted /model can win', () => {
    const parsed = Config({} as never)
    expect(parsed.provider).toBeUndefined()
    expect(parsed.model).toBeUndefined()
    // Fullscreen is on by default: the alt screen is what supplies mouse
    // handling (wheel scroll, select-to-copy, the tool-chain double-click).
    expect(parsed.fullscreen).toBe(true)
    expect(parsed.activity).toBe(true)
  })
})
