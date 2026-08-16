import { Event } from './event.js';
/**
 * Mouse click event. Fired on left-button release without drag, only when
 * mouse tracking is enabled (i.e. inside <AlternateScreen>).
 *
 * Bubbles from the deepest hit node up through parentNode. Call
 * stopImmediatePropagation() to prevent ancestors' onClick from firing.
 */
export class ClickEvent extends Event {
    /** 0-indexed screen column of the click */
    col;
    /** 0-indexed screen row of the click */
    row;
    /**
     * Click column relative to the current handler's Box (col - box.x).
     * Recomputed by dispatchClick before each handler fires, so an onClick
     * on a container sees coords relative to that container, not to any
     * child the click landed on.
     */
    localCol = 0;
    /** Click row relative to the current handler's Box (row - box.y). */
    localRow = 0;
    /**
     * True if the clicked cell has no visible content (unwritten in the
     * screen buffer — both packed words are 0). Handlers can check this to
     * ignore clicks on blank space to the right of text, so accidental
     * clicks on empty terminal space don't toggle state.
     */
    cellIsBlank;
    /**
     * How many clicks this event closes: 1 for a plain click, 2 for the second
     * click of a double-click (capped there — a triple-click stays with the
     * text-selection path and never reaches the DOM). A handler that wants
     * double-click semantics branches on this and consumes the event; consuming
     * a `clickCount === 2` event suppresses the word-select that would
     * otherwise run in its place.
     *
     * Note that click 1 of a double-click has already been dispatched as its
     * own `clickCount === 1` event by the time this arrives — there is no
     * disambiguation timer, matching the web client's plain
     * `onClick`/`onDoubleClick` pairing.
     */
    clickCount;
    constructor(col, row, cellIsBlank, clickCount = 1) {
        super();
        this.col = col;
        this.row = row;
        this.cellIsBlank = cellIsBlank;
        this.clickCount = clickCount;
    }
}
