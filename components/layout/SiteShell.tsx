'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Chooses whether a customer page gets the sidebar beside
// it, or the full width of the window.
//
// THE HOMEPAGE GETS THE FULL WIDTH. It is the front door — the page somebody
// lands on from a search engine having never heard of SXM Rentals — and its job
// is to explain what this is and offer the two ways out of it. A column of "My
// Rentals / Messages / Documents / Payment Methods" down the side of that page
// is navigation for an account the visitor does not have yet, competing with the
// two things they are actually meant to do.
//
// Every other page is somewhere you have already chosen to be, and there the
// sidebar earns its width by putting every section one click away.
//
// The hamburger follows the same rule, because a button that collapses a sidebar
// which is not on screen is a button that appears to do nothing.

import React from 'react';
import { usePathname } from 'next/navigation';
import { SiteSidebar } from './SiteSidebar';
import styles from './SiteSidebar.module.css';

// Pages that are shown without the sidebar. The homepage is the only one for
// now; it is written as a list so adding another is a one-line change.
const FULL_WIDTH_PAGES = ['/'];

export function usesSidebar(pathname: string): boolean {
  return !FULL_WIDTH_PAGES.includes(pathname);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!usesSidebar(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className={styles.body}>
      <SiteSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default SiteShell;
