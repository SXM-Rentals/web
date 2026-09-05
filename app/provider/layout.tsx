// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The frame around every page of the provider portal.
//
// IT DOES NOT USE THE CUSTOMER SITE'S TOP BAR OR FOOTER, deliberately. A rental
// business managing its fleet has no use for "Find a car" across the top or a
// list of nineteen policies at the bottom; it needs its own six sections, always
// visible. This is the same split the phone app makes when it swaps the whole
// bottom bar over — done here as a genuinely different page shape rather than
// the same one with different links.
//
// Which of the two frames a page gets is decided in ProviderShell, because the
// application page belongs to somebody who is not a provider yet and should not
// be given a sidebar full of empty sections.

import React from 'react';
import type { Metadata } from 'next';
import { ProviderShell } from '@/components/business/ProviderShell';
import { OfflineBanner } from '@/components/ui';
import { SocialWidget } from '@/components/layout/SocialWidget';
import styles from './provider.module.css';

// Same reason as the account area: these pages run in the browser and cannot
// export their own titles, so the section names itself here.
export const metadata: Metadata = {
  title: { default: 'Business Dashboard', template: '%s · SXM Rentals' },
  robots: { index: false, follow: false },
};

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <OfflineBanner />
      <ProviderShell>{children}</ProviderShell>

      {/* The same share button the customer side has. A rental business has more
          reason to pass its own listings around than anybody — it is the one
          being booked. */}
      <SocialWidget />
    </div>
  );
}
