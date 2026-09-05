'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Chooses which frame a provider page gets.
//
// WHY THERE ARE TWO: nearly every page under /provider belongs to a business
// that already exists, and gets the sidebar of six sections. The application
// page does not — the person filling it in has no fleet, no bookings and no
// payouts, so a sidebar full of links to empty pages would be both confusing and
// slightly insulting. That one page gets a plain centred column instead, the
// same shape as signing up on the customer side.
//
// The alternative was to put the application form somewhere outside /provider
// entirely, but its address is worth keeping: "sxmrentals.com/provider/apply" is
// a thing you can say to a rental company over the phone.

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProviderNav } from './ProviderNav';
import { Logo, QuickSettingsButtons, AppErrorBoundary } from '@/components/ui';
import styles from '@/app/provider/provider.module.css';
import authStyles from '@/app/(auth)/auth.module.css';
import { useTranslation } from '@/lib/i18n';

// Pages that belong to somebody who is not yet a provider.
const BARE_PAGES = ['/provider/apply'];

export function ProviderShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const bare = BARE_PAGES.includes(pathname);

  if (bare) {
    return (
      <div className={authStyles.shell}>
        <header className={authStyles.header}>
          <Link href="/" className={authStyles.logoLink} aria-label={t('web.a11y.homeLink')}>
            <Logo size={26} decorative />
          </Link>
          <div className={authStyles.headerActions}>
            <QuickSettingsButtons />
          </div>
        </header>

        <main className={authStyles.main} id="main">
          <div className={`${authStyles.column} ${authStyles.columnWide}`}>
            <AppErrorBoundary>{children}</AppErrorBoundary>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <ProviderNav />

      <main className={styles.main} id="main">
        <div className={styles.inner}>
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default ProviderShell;
