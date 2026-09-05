'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Lets a box be typed into smoothly when the real value it
// controls lives somewhere slow — in our case, the page address.
//
// THE BUG THIS FIXES: the search filters keep every setting in the address bar,
// so a search can be shared and bookmarked. That is worth having, but it made
// the search box impossible to type in. Each keystroke asked the browser to
// change the address, and the address does not change instantly. So the next
// keystroke arrived while the box was still showing the OLD value, replaced it,
// and typing "Marigot" left a box containing "t".
//
// The fix is to keep two copies. The draft is what the person sees and updates
// on every keystroke, so typing feels immediate. The committed value follows a
// short moment after they stop, which is when the address changes and the
// results reload — once, rather than once per letter.
//
// It also watches the committed value, so when it changes from somewhere OTHER
// than this box — the back button, or a "Clear All" — the box follows it.

import { useCallback, useEffect, useRef, useState } from 'react';

export function useDraftValue<T>(
  // The real value: whatever is currently in the page address.
  committed: T,
  // How to write it back. Called once the typing pauses, not on every keystroke.
  commit: (next: T) => void,
  // Long enough to cover normal typing, short enough that the results do not
  // feel like they are lagging behind.
  delay = 350,
): [T, (next: T) => void] {
  const [draft, setDraft] = useState<T>(committed);

  // The last value this box itself produced. Used to tell "the address changed
  // because of what I just typed" from "the address changed for another reason".
  const ours = useRef<T>(committed);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (committed !== ours.current) {
      ours.current = committed;
      setDraft(committed);
    }
  }, [committed]);

  const update = useCallback(
    (next: T) => {
      ours.current = next;
      setDraft(next);

      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => commit(next), delay);
    },
    [commit, delay],
  );

  // A pending write when the page is left would otherwise fire into nothing.
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  return [draft, update];
}

export default useDraftValue;
