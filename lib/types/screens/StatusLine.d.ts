import React from 'react';
import type { Channel } from '../channel.js';
import { type StatusLinePrefs } from '../statusLinePrefs.js';
/**
 * The footer under the prompt input: one metrics row (model · tps · effort
 * · ctx · cache · tokens on the left, git · cwd · title on the right) and
 * an optional hint row. Context is a short `ctx 23k/1.0M 2.3%` read, not
 * a full-width labeled segment bar.
 *
 * `segments` (the `/statusline` choice, persisted in
 * `~/.dsh-tui/statusline.json`) gates each field individually. It only ever
 * removes: `contextBar` still needs the cordis.yml `contextBar` key on, and a
 * field with nothing to show stays hidden regardless.
 */
export declare function StatusLine({ channel, selectionActive, helpOpen, segments, }: {
    channel: Channel;
    selectionActive?: boolean;
    helpOpen?: boolean;
    segments?: StatusLinePrefs;
}): React.JSX.Element;
//# sourceMappingURL=StatusLine.d.ts.map