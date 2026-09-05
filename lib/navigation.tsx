'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Makes the back arrow always do something.
//
// THE BUG THIS FIXES: a back arrow that calls "go back" quietly does nothing at
// all when there is nothing to go back to. On a website that happens constantly:
//
//   - someone opens a car straight from a Google result
//   - someone follows a shared link to a booking or a legal page
//   - someone opens a link in a new tab, which starts with no history
//
// In all of those the arrow is right there, looks perfectly normal, and does
// absolutely nothing when clicked. Which reads as a broken site.
//
// So: go back if there is somewhere to go back TO. Otherwise go somewhere
// sensible — which part of the site you are on decides where that is.
//
// HOW WE KNOW WHETHER THERE IS ANYWHERE TO GO BACK TO: the browser will not
// tell us. window.history.length counts every page the tab has ever visited,
// including sites before ours, and there is no way to ask "was the previous
// entry mine?". So instead we count moves ourselves: the counter below starts
// at zero when the site first loads and goes up on every navigation within it.
// Above zero means we put a page behind us and going back is safe.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

type NavigationValue = {
  // How many pages we have moved through since arriving on the site.
  depth: number;
  // True when there is a page of ours behind this one.
  canGoBack: boolean;
};

const NavigationContext = createContext<NavigationValue>({ depth: 0, canGoBack: false });

// Where to land when there is no history. Someone on the provider side returns
// to their dashboard rather than being dumped into the customer site.
export function homeFor(pathname: string): string {
  return pathname.startsWith('/provider') ? '/provider' : '/';
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [depth, setDepth] = useState(0);

  // Remembers the page we were on last, so that a re-render on the same page
  // does not get miscounted as a move.
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === null) {
      // First page of the visit. Nothing behind it.
      previousPath.current = pathname;
      return;
    }

    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      setDepth((current) => current + 1);
    }
  }, [pathname]);

  const value = useMemo(() => ({ depth, canGoBack: depth > 0 }), [depth]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

// ---- THE HOOK PAGES USE ----
// Returns a function safe to hand straight to a button:
//   const goBack = useGoBack();
//   <IconButton icon="back" onClick={goBack} />
//
// Pass a fallback to override where it lands when there is no history — useful
// at the end of a flow, where "back" should mean "out to the rental" rather
// than "into the payment screen you just completed".
export function useGoBack(fallback?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const { canGoBack } = useContext(NavigationContext);

  return useCallback(() => {
    if (canGoBack) {
      router.back();
      return;
    }

    // Nothing of ours behind us. "replace" rather than "push", so the arrow on
    // the page we land on does not point back at the one we just left.
    router.replace(fallback ?? homeFor(pathname));
  }, [canGoBack, fallback, pathname, router]);
}

// The same information on its own, for a page that wants to hide a back arrow
// entirely rather than have it jump somewhere unexpected.
export function useNavigationDepth(): NavigationValue {
  return useContext(NavigationContext);
}
