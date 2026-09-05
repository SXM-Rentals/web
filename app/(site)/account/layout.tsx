// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The frame around every page in the account area.
//
// IT NO LONGER CARRIES ITS OWN LIST OF SECTIONS. It used to, which is why the
// site had a sidebar on My Rentals and none on Find a Car or the homepage — the
// navigation changed shape depending on where you happened to be. That list now
// lives in the site-wide sidebar, so it is in the same place on every page, and
// all this file does is check that somebody is signed in.
//
// The account area is the one part of the customer site that genuinely needs an
// account. Rather than each page checking for itself and producing a slightly
// different answer, the check happens once here.

import React from 'react';
import type { Metadata } from 'next';
import { RequireSignIn } from '@/components/layout/RequireSignIn';
import styles from './layout.module.css';

// The pages in here run in the browser, and a client component cannot export a
// page title — so without this every one of them showed the homepage's title in
// the browser tab. This names the section instead. A page that wants its own
// title needs a small server wrapper of its own.
export const metadata: Metadata = {
  title: { default: 'Your Account', template: '%s · SXM Rentals' },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className={styles.content} style={{ paddingTop: 'var(--space-2xl)' }}>
        <RequireSignIn>{children}</RequireSignIn>
      </div>
    </div>
  );
}
