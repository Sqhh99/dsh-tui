import { describe, expect, it } from 'vitest'
import { parseSkillMarkdown, registerPackagedSkills } from '../src/packaged-skills.ts'

describe('parseSkillMarkdown', () => {
  it('reads kebab-case frontmatter and the body', () => {
    const parsed = parseSkillMarkdown(
      '---\nname: audit\ndescription: Run an audit\n---\n\nDo the audit.\n',
      'fallback',
    )
    expect(parsed).toEqual({ name: 'audit', description: 'Run an audit', content: 'Do the audit.' })
  })

  it('uses the directory name when name is omitted', () => {
    const parsed = parseSkillMarkdown('---\ndescription: x\n---\nbody', 'review')
    expect(parsed.name).toBe('review')
  })
})

describe('registerPackagedSkills', () => {
  it('is a no-op when the composition has no skill registry', () => {
    expect(() => registerPackagedSkills({ get: () => undefined } as never)).not.toThrow()
  })
})
