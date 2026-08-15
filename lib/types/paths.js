/**
 * Product paths and environment lookup. Writes go to ~/.dsh-tui. Reads try
 * that directory first, then ~/.dsh-cc so a previous install's prefs still
 * apply once.
 */
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
/** Directory this product writes preference files into. */
export const PREFS_DIR = join(homedir(), '.dsh-tui');
/** Previous product prefs directory; read-only fallback. */
export const LEGACY_PREFS_DIR = join(homedir(), '.dsh-cc');
/**
 * First non-empty environment value among the given names.
 * @param names - Preferred name first, then compatibility aliases.
 * @returns The value, or undefined when every name is unset or empty.
 */
export function envVar(...names) {
    for (const name of names) {
        const value = process.env[name];
        if (value !== undefined && value.trim() !== '')
            return value;
    }
    return undefined;
}
/**
 * Read a preference file from ~/.dsh-tui, then ~/.dsh-cc.
 * @param filename - Basename under the prefs directory.
 * @param dir - Override the primary directory (tests).
 * @returns File text, or undefined when neither location has the file.
 */
export function readPrefText(filename, dir = PREFS_DIR) {
    for (const root of dir === PREFS_DIR ? [PREFS_DIR, LEGACY_PREFS_DIR] : [dir]) {
        const path = join(root, filename);
        if (!existsSync(path))
            continue;
        try {
            return readFileSync(path, 'utf8');
        }
        catch {
            // Unreadable file is the same as missing: the caller applies its default.
        }
    }
    return undefined;
}
