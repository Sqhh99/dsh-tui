import { describe, expect, it } from 'vitest'
import { DEFAULT_MODEL_ROUTE, explicitModelRoute, recordedModelRoute, resolveModelRoute } from '../src/modelRoute.ts'

describe('explicitModelRoute', () => {
  it('requires both halves', () => {
    expect(explicitModelRoute({ provider: 'deepseek-official' })).toBeUndefined()
    expect(explicitModelRoute({ model: 'deepseek-v4-flash' })).toBeUndefined()
    expect(explicitModelRoute({ provider: 'deepseek-official', model: 'deepseek-v4-flash' })).toEqual({
      provider: 'deepseek-official',
      model: 'deepseek-v4-flash',
    })
  })
})

describe('resolveModelRoute', () => {
  it('lets a complete config beat a persisted preference', () => {
    expect(resolveModelRoute(
      { provider: 'other', model: 'other-model' },
      { provider: 'deepseek-official', model: 'deepseek-v4-flash' },
    )).toEqual({ provider: 'other', model: 'other-model' })
  })

  it('ignores a provider-only pin instead of merging with the pref model', () => {
    expect(resolveModelRoute(
      { provider: 'other' },
      { provider: 'deepseek-official', model: 'custom' },
    )).toEqual({ provider: 'deepseek-official', model: 'custom' })
  })

  it('falls back to the harness default', () => {
    expect(resolveModelRoute({}, undefined)).toEqual(DEFAULT_MODEL_ROUTE)
  })
})

describe('recordedModelRoute', () => {
  it('reads the last request/header pair', () => {
    expect(recordedModelRoute([
      { type: 'request/header', data: { header: { config: { provider: 'a', model: 'm1' } } } },
      { type: 'request/header', data: { header: { config: { provider: 'b', model: 'm2' } } } },
    ])).toEqual({ provider: 'b', model: 'm2' })
  })

  it('returns undefined when the log has no header', () => {
    expect(recordedModelRoute([{ type: 'user/message' }])).toBeUndefined()
  })
})
