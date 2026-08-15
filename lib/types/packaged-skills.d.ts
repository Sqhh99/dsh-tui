import type { Context } from '@deepseek-ai/cordis';
/**
 * Parse a SKILL.md into name/description/content. Dependency-free: the
 * packaged files use single-line scalar frontmatter fields only.
 *
 * @param raw - the raw SKILL.md text
 * @param fallbackName - directory name used when frontmatter omits `name`
 * @returns the parsed registration fields
 */
export declare function parseSkillMarkdown(raw: string, fallbackName: string): {
    name: string;
    description: string;
    content: string;
};
/**
 * Register every `skills/<name>/SKILL.md` shipped in this package. No-op when
 * the composition mounts no skill registry (bare standalone boots); duplicate
 * or invalid entries are skipped so a skill can never take down the TUI boot.
 *
 * @param ctx - the plugin's cordis context
 */
export declare function registerPackagedSkills(ctx: Context): void;
//# sourceMappingURL=packaged-skills.d.ts.map