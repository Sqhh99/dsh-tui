import { describe, expect, it } from 'vitest'
import { LOCAL_COMMANDS, filterCommands, isLocalCommandName, parseCommandName } from '../src/commands.ts'

describe('parseCommandName', () => {
  it('splits name and raw trailing input', () => {
    expect(parseCommandName('/plan off')).toEqual({ name: 'plan', rawInput: ' off' })
  })

  it('rejects non-command text', () => {
    expect(parseCommandName('hello')).toBeUndefined()
    expect(parseCommandName('/ Plan')).toBeUndefined()
  })
})

describe('isLocalCommandName', () => {
  it('matches built-in names with or without a slash', () => {
    expect(isLocalCommandName('/help')).toBe(true)
    expect(isLocalCommandName('resume ')).toBe(true)
    expect(isLocalCommandName('/not-a-command')).toBe(false)
  })
})

describe('filterCommands', () => {
  it('filters by prefix after the slash', () => {
    const names = filterCommands('/re').map(c => c.name)
    expect(names).toContain('resume')
    expect(names).toContain('rewind')
    expect(names).not.toContain('help')
  })

  it('includes every local command in the shipped table', () => {
    expect(LOCAL_COMMANDS.some(c => c.name === 'exit')).toBe(true)
    expect(LOCAL_COMMANDS.some(c => c.name === 'preset')).toBe(true)
    expect(LOCAL_COMMANDS.some(c => c.name === 'statusline')).toBe(true)
    expect(LOCAL_COMMANDS.some(c => c.name === 'effort')).toBe(true)
  })

  it('dispatches the new commands with their arguments', () => {
    expect(isLocalCommandName('/statusline')).toBe(true)
    expect(isLocalCommandName('/effort')).toBe(true)
    expect(parseCommandName('/effort high')).toEqual({ name: 'effort', rawInput: ' high' })
    expect(parseCommandName('/statusline status')).toEqual({ name: 'statusline', rawInput: ' status' })
  })
})
