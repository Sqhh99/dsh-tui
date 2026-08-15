/** Directory this product writes preference files into. */
export declare const PREFS_DIR: string;
/** Previous product prefs directory; read-only fallback. */
export declare const LEGACY_PREFS_DIR: string;
/**
 * First non-empty environment value among the given names.
 * @param names - Preferred name first, then compatibility aliases.
 * @returns The value, or undefined when every name is unset or empty.
 */
export declare function envVar(...names: string[]): string | undefined;
/**
 * Read a preference file from ~/.dsh-tui, then ~/.dsh-cc.
 * @param filename - Basename under the prefs directory.
 * @param dir - Override the primary directory (tests).
 * @returns File text, or undefined when neither location has the file.
 */
export declare function readPrefText(filename: string, dir?: string): string | undefined;
//# sourceMappingURL=paths.d.ts.map