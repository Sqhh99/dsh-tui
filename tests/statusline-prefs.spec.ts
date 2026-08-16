import { mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_STATUS_LINE,
  STATUS_SEGMENTS,
  isStatusSegment,
  parseStatusLinePref,
  readStatusLinePref,
  resolveStatusLinePrefs,
  writeStatusLinePref,
} from '../src/statusLinePrefs.ts'

function tempDir(label: string): string {
  const dir = join(tmpdir(), `dsh-tui-statusline-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

describe('status line defaults', () => {
  it('ships every segment on, so the footer is unchanged without a pref', () => {
    expect(Object.keys(DEFAULT_STATUS_LINE).sort()).toEqual([...STATUS_SEGMENTS].sort())
    expect(Object.values(DEFAULT_STATUS_LINE).every(Boolean)).toBe(true)
  })

  it('recognizes only known segment names', () => {
    expect(isStatusSegment('model')).toBe(true)
    expect(isStatusSegment('contextBar')).toBe(true)
    expect(isStatusSegment('nonsense')).toBe(false)
  })
})

describe('parseStatusLinePref', () => {
  it('keeps known boolean keys', () => {
    expect(parseStatusLinePref('{"model":false,"git":true}')).toEqual({ model: false, git: true })
  })

  it('drops unknown keys and non-boolean values', () => {
    expect(parseStatusLinePref('{"model":false,"bogus":true,"git":"yes"}')).toEqual({ model: false })
  })

  it('rejects anything that is not a JSON object', () => {
    expect(parseStatusLinePref('null')).toBeUndefined()
    expect(parseStatusLinePref('[1,2]')).toBeUndefined()
    expect(parseStatusLinePref('not json')).toBeUndefined()
  })
})

describe('resolveStatusLinePrefs', () => {
  it('falls back to the default for every key the file omits', () => {
    // A segment introduced in a later version is absent from an older file
    // and must default ON rather than silently disappear.
    const resolved = resolveStatusLinePrefs({ model: false })
    expect(resolved.model).toBe(false)
    expect(resolved.tps).toBe(true)
    expect(resolved.cwd).toBe(true)
  })

  it('returns the full defaults for a missing pref', () => {
    expect(resolveStatusLinePrefs(undefined)).toEqual(DEFAULT_STATUS_LINE)
  })
})

describe('read/write round-trip', () => {
  it('persists and reads back a complete map', () => {
    const dir = tempDir('roundtrip')
    const prefs = { ...DEFAULT_STATUS_LINE, tps: false, title: false }
    expect(writeStatusLinePref(prefs, dir)).toBe(true)
    expect(readStatusLinePref(dir)).toEqual(prefs)
  })

  it('reads undefined from a directory with no pref file', () => {
    expect(readStatusLinePref(tempDir('empty'))).toBeUndefined()
  })
})
