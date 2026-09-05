// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The frame around every customer-facing page — the
// homepage, search, car pages, the booking flow, the account area and the legal
// documents. It puts the top bar above them, the sidebar beside them, and the
// footer below, so no individual page has to draw any of it.
//
// THE FOLDER NAME IS IN BRACKETS on purpose. "(site)" groups these pages
// together so they can share this frame, without the word appearing in any
// address — the homepage is still just "/", not "/site".
//
// THE SIDEBAR IS ON EVERY PAGE HERE EXCEPT THE HOMEPAGE. It used to appear only
// inside the account area, which meant the navigation changed shape depending on
// where you were. One consistent place to look is worth more than the strip of
// width it costs, and the hamburger in the top bar collapses it to icons for
// anyone who wants that width back.
//
// The homepage is the exception, because it is the front door rather than
// somewhere you have already chosen to be — see the note in SiteShell.tsx.
//
// THE SHARE BUTTON IS MOUNTED HERE rather than on the homepage, so it is within
// reach from any page. The provider dashboard mounts its own copy for the same
// reason.
//
// The provider dashboard and the sign-in pages deliberately do NOT use this
// frame. A rental business gets its own sidebar, and the sign-in pages are kept
// bare so nothing distracts from the one thing being asked.

import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { SiteShell } from '@/components/layout/SiteShell';
import { Footer } from '@/components/layout/Footer';
import { SocialWidget } from '@/components/layout/SocialWidget';
import { OfflineBanner, AppErrorBoundary } from '@/components/ui';
import styles from './layout.module.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <OfflineBanner />
      <TopBar />

      {/* SiteShell decides whether this page gets the sidebar. The homepage
          does not — see the note in SiteShell.tsx. */}
      <SiteShell>
        {/* "main" marks where the actual content of the page begins, which is
            what the skip link jumps to and what screen readers use to get past
            the navigation. */}
        <main id="main" className={styles.main}>
          {/* Catches a crash inside a page and shows a readable message instead
              of the blank white screen React would otherwise leave behind. The
              top bar, sidebar and footer stay put, so there is still a way
              out. */}
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </main>

        <Footer />
      </SiteShell>

      {/* Outside SiteShell because it is fixed to the corner of the window
          rather than placed in the page, and it belongs to every page here
          rather than to any one of them. */}
      <SocialWidget />
    </div>
  );
}
