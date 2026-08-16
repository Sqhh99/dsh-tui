import React from 'react';
/** One reasoning tier as the adapter declares it. */
export type EffortOption = {
    id: string;
    name: string;
    description?: string;
};
/**
 * `/effort` reasoning-tier picker, in the ThemePicker shape: a
 * permission-colored Pane, the adapter's own tiers as Select rows in the
 * adapter's own display order, and the Enter/Esc hint line. The tier that
 * applies when nothing is pinned is marked so the list is readable before
 * the first request reports a live value.
 */
export declare function EffortPicker({ efforts, focusIndex, currentEffort, defaultEffort, }: {
    efforts: readonly EffortOption[];
    focusIndex: number;
    /** The pinned tier, when one is in effect (shows the ✓). */
    currentEffort: string | undefined;
    /** The adapter's fallback tier, annotated on its row. */
    defaultEffort: string | undefined;
}): React.ReactNode;
//# sourceMappingURL=EffortPicker.d.ts.map