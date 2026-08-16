/**
 * Persisted status-line segment visibility (`/statusline` picker choice), kept
 * at `~/.dsh-tui/statusline.json` so the footer layout survives restarts —
 * same pattern as agent-preset.json / working-activity.json.
 *
 * The file is a partial map: only keys the user actually changed need be
 * present, and an unknown key is dropped. A segment added by a later version
 * is therefore absent from an older file and falls back to its default (on)
 * rather than silently disappearing. A missing or corrupt file yields the
 * full default layout.
 *
 * The cordis.yml `contextBar` key stays a separate, harder switch: it turns
 * the bar off for a deployment, and this preference cannot turn it back on.
 */
/**
 * Footer segments in picker order, which is also roughly their order on the
 * status line: the context bar owns row 1, the left group runs
 * model → tps → effort → cache → tokens, the right group git → cwd → title,
 * and the hint owns row 3.
 */
export declare const STATUS_SEGMENTS: readonly ["contextBar", "model", "tps", "effort", "cache", "tokens", "git", "cwd", "title", "hint"];
export type StatusSegment = (typeof STATUS_SEGMENTS)[number];
export type StatusLinePrefs = Record<StatusSegment, boolean>;
/** Every segment on — the footer as it shipped before `/statusline` existed. */
export declare const DEFAULT_STATUS_LINE: StatusLinePrefs;
/**
 * Whether a string names a segment this version knows.
 * @param value - Candidate segment name.
 * @returns True when `value` is a known segment.
 */
export declare function isStatusSegment(value: string): value is StatusSegment;
/**
 * Merge a partial preference over the defaults.
 * @param partial - Segments the user changed, if any.
 * @returns A complete segment map.
 */
export declare function resolveStatusLinePrefs(partial: Partial<StatusLinePrefs> | undefined): StatusLinePrefs;
/**
 * Parse a persisted `{ segment: boolean }` map; unknown keys and non-boolean
 * values are dropped. Anything that is not a JSON object yields undefined.
 * @param text - Raw file contents.
 * @returns The recognized segment flags, or undefined when unparseable.
 */
export declare function parseStatusLinePref(text: string): Partial<StatusLinePrefs> | undefined;
/**
 * The persisted segment flags, or undefined when unset or invalid.
 * @param dir - Prefs directory (injectable for tests).
 * @returns The persisted flags, if any.
 */
export declare function readStatusLinePref(dir?: string): Partial<StatusLinePrefs> | undefined;
/**
 * Persist the chosen segment flags (best effort). The complete map is written
 * so a later version can tell "explicitly off" from "not yet known".
 * @param prefs - Segment flags to persist.
 * @param dir - Prefs directory (injectable for tests).
 * @returns True when the file was written, false on failure.
 */
export declare function writeStatusLinePref(prefs: StatusLinePrefs, dir?: string): boolean;
//# sourceMappingURL=statusLinePrefs.d.ts.map