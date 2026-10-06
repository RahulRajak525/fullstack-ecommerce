// The "drag to quick add" hint shows on one card per page load (the first
// product card that scrolls into view claims it), for the first few loads
// only, and stops for good once the shopper has used the swipe themselves.
const COUNT_KEY = "kora:quick-add-hint-count";
const MAX_SHOWS = 3;
let owner = null;

function shownCount() {
  try {
    return Number(localStorage.getItem(COUNT_KEY)) || 0;
  } catch {
    return 0;
  }
}

function setCount(count) {
  try {
    localStorage.setItem(COUNT_KEY, String(count));
  } catch {
    // Storage blocked: the hint just shows on every load, which is harmless
  }
}

/** True if this card (by id) should show the hint now. */
export function claimSwipeHint(cardId) {
  if (shownCount() >= MAX_SHOWS) return false;
  if (owner === null) owner = cardId;
  return owner === cardId;
}

/** Call when the hint is actually displayed. */
export function markSwipeHintShown() {
  setCount(shownCount() + 1);
}

/** The shopper swiped on their own, so they no longer need the hint. */
export function markSwipeLearned() {
  setCount(MAX_SHOWS);
}
