import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { envVar, readPrefText } from '../src/paths.ts'
import { parseModelPref, readModelPref, writeModelPref } from '../src/modelPrefs.ts'

describe('envVar', () => {
  it('returns the first non-empty name', () => {
    process.env.DSH_TUI_PATHS_TEST_A = 'one'
    process.env.DSH_TUI_PATHS_TEST_B = 'two'
    expect(envVar('DSH_TUI_PATHS_TEST_A', 'DSH_TUI_PATHS_TEST_B')).toBe('one')
    delete process.env.DSH_TUI_PATHS_TEST_A
    expect(envVar('DSH_TUI_PATHS_TEST_A', 'DSH_TUI_PATHS_TEST_B')).toBe('two')
    delete process.env.DSH_TUI_PATHS_TEST_B
    expect(envVar('DSH_TUI_PATHS_TEST_A', 'DSH_TUI_PATHS_TEST_B')).toBeUndefined()
  })
})

describe('model prefs', () => {
  it('parses a complete route and rejects a half pair', () => {
    expect(parseModelPref('{"provider":"p","model":"m"}')).toEqual({ provider: 'p', model: 'm' })
    expect(parseModelPref('{"provider":"p"}')).toBeUndefined()
  })

  it('writes and reads a temp prefs directory', () => {
    const dir = join(tmpdir(), `dsh-tui-prefs-${Date.now()}`)
    mkdirSync(dir, { recursive: true })
    expect(writeModelPref('deepseek-official', 'deepseek-v4-flash', dir)).toBe(true)
    expect(readModelPref(dir)).toEqual({ provider: 'deepseek-official', model: 'deepseek-v4-flash' })
  })

  it('readPrefText returns undefined for a missing file', () => {
    expect(readPrefText('missing.json', join(tmpdir(), 'dsh-tui-no-such-dir'))).toBeUndefined()
  })
})
