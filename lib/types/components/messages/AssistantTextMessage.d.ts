import React from 'react';
import type { ClickEvent } from '../../ink/events/click-event.js';
type Props = {
    text: string;
    /** Adds the top margin between messages (CC: addMargin). */
    addMargin: boolean;
    /** Message-selection mode highlight. */
    isSelected?: boolean;
    /** Row expanded on its own (persistent hover-grey background, CC). */
    isExpanded?: boolean;
    onClick?(event: ClickEvent): void;
};
/**
 * Assistant text message:  bullet + markdown body (ported from the
 * leak's  default branch).
 */
export declare function AssistantTextMessage({ text, addMargin, isSelected, isExpanded, onClick, }: Props): React.ReactNode;
export {};
//# sourceMappingURL=AssistantTextMessage.d.ts.map