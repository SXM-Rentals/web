// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The frame around signing in, joining, and the identity
// check — a narrow column in the middle of the page with the logo above it.
//
// IT IS DELIBERATELY BARE. There is no navigation and no footer full of links,
// because every one of them is something to click INSTEAD of finishing what is
// on screen. The only way out is the logo, which goes back to the homepage.
//
// These pages are the exception to the site's normal shape rather than a
// stripped-down version of it: they ask one thing at a time, and nothing else on
// screen competes with that.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo, QuickSettingsButtons, AppErrorBoundary } from '@/components/ui';
import styles from './auth.module.css';

// ---- KEPT OUT OF SEARCH RESULTS ----
// Signing in, and the licence and ID checks. None of it means anything to
// somebody arriving cold from a search result, and a sign-in form is not a page
// anybody should be sent to by a search engine. app/robots.ts asks for the same
// thing from the other direction.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink} aria-label="SXM Rentals, go to the homepage">
          <Logo size={26} priority decorative />
        </Link>

        {/* Kept even here: someone who cannot read English needs the language
            button before they can get through a sign-up form, not after. */}
        <div className={styles.headerActions}>
          <QuickSettingsButtons />
        </div>
      </header>

      <main className={styles.main} id="main">
        <div className={styles.column}>
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </div>
      </main>
    </div>
  );
}
