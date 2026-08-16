import React from 'react';
import type { Channel } from '../channel.js';
import { type StatusLinePrefs } from '../statusLinePrefs.js';
/**
 * The footer under the prompt input, in Claude Code's PromptInputFooter
 * layout: the segmented context progress bar on its own first line, the
 * status line below (left group: model · tokens · think level · cache · tps
 * gauge/sparkline; right group: git · cwd · title, right-aligned), and the
 * mode/hint line last. The right side of the footer shows the latest
 * transient notification (errors in red, warnings in amber — CC style).
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