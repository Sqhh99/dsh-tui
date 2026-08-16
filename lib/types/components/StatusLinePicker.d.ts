import React from 'react';
import { type StatusLinePrefs } from '../statusLinePrefs.js';
/**
 * `/statusline` segment editor, in the same Pane + ListItem style as the other
 * pickers. Unlike them this is a multi-toggle, so `isSelected` (the ✓) means
 * "this segment is on" rather than "this is the one chosen value" — the
 * ModelPicker's direct ListItem mapping rather than the single-choice Select.
 *
 * The footer below re-renders from the same draft, so toggling previews live.
 */
export declare function StatusLinePicker({ draft, focusIndex, }: {
    draft: StatusLinePrefs;
    focusIndex: number;
}): React.ReactNode;
//# sourceMappingURL=StatusLinePicker.d.ts.map