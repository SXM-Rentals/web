'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Remembers whether the sidebar is open or collapsed, so
// the hamburger button in the top bar and the sidebar itself agree about it.
// They sit in different parts of the page and cannot see each other's state, so
// it is kept here where both can read it.
//
// ONE BUTTON, TWO BEHAVIOURS. On a laptop there is room for the sidebar to live
// on screen permanently, so the hamburger shrinks it to a narrow strip of icons
// and back. On a phone there is no such room, so the same button slides it in
// over the page instead and a tap anywhere else closes it again. Which of the
// two happens is decided by the width of the window at the moment the button is
// pressed, rather than by two separate controls that would both need explaining.
//
// The laptop choice is remembered between visits, because it is a preference.
// The phone one deliberately is not: nobody wants to arrive on a page and find a
// panel covering it because of something they did last week.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getItemSync, setItemSync } from '@/lib/storage';

type SidebarValue = {
  // On a wide window: whether the sidebar shows its labels or just its icons.
  expanded: boolean;
  // On a narrow window: whether the sidebar is currently slid over the page.
  drawerOpen: boolean;
  // What the hamburger does. Picks the right one for the current window width.
  toggle: () => void;
  // Closes the drawer. Used by the backdrop, the Escape key, and by every
  // navigation — a drawer left open on top of the next page reads as a bug.
  closeDrawer: () => void;
};

const SidebarContext = createContext<SidebarValue | null>(null);

export const SIDEBAR_STORAGE_KEY = 'sxm.sidebar-expanded';

// The width at which the sidebar stops being a drawer and becomes part of the
// page. Matches the "desktop" breakpoint in the design tokens.
const DESKTOP_WIDTH = 1024;

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Starts expanded, which is what the server has to assume — it has no way to
  // know the preference. The saved one is read immediately below, so the first
  // render matches what the server produced and React does not complain.
  const [expanded, setExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = getItemSync(SIDEBAR_STORAGE_KEY);
    if (saved === 'false') setExpanded(false);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const toggle = useCallback(() => {
    const onDesktop = window.matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`).matches;

    if (onDesktop) {
      setExpanded((current) => {
        const next = !current;
        setItemSync(SIDEBAR_STORAGE_KEY, String(next));
        return next;
      });
      return;
    }

    setDrawerOpen((current) => !current);
  }, []);

  // Growing the window past the breakpoint with the drawer open would otherwise
  // leave it stuck over the page as an overlay that no longer has a backdrop.
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setDrawerOpen(false);
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const value = useMemo<SidebarValue>(
    () => ({ expanded, drawerOpen, toggle, closeDrawer }),
    [expanded, drawerOpen, toggle, closeDrawer],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used inside SidebarProvider (check app/layout.tsx)');
  }
  return ctx;
}
