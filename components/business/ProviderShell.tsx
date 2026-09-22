'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Chooses which frame a provider page gets — and, before
// any dashboard page is shown, checks that the person looking is allowed to
// see it.
//
// WHY THERE ARE TWO FRAMES: nearly every page under /provider belongs to a
// business that already exists, and gets the sidebar of six sections. The
// application page does not — the person filling it in has no fleet, no
// bookings and no payouts, so a sidebar full of links to empty pages would be
// both confusing and slightly insulting. That one page gets a plain centred
// column instead, the same shape as signing up on the customer side.
//
// The alternative was to put the application form somewhere outside /provider
// entirely, but its address is worth keeping: "sxmrentals.app/provider/apply" is
// a thing you can say to a rental company over the phone.
//
// ---- THE GATE ----
//
// There used to be none: anybody, signed in or not, could open /provider and
// look around a made-up business's dashboard. Now every dashboard page waits
// until two things are known, and shows the plain frame until then:
//
//   Is somebody signed in?      No  → sign in, then come straight back here.
//   Do they run a business?     No  → register one.
//
// "Could not tell" is never read as "no" at either step: a sleeping backend
// gets a retry, not a sign-in form or an invitation to register a business
// that already exists. See lib/auth.tsx and lib/business.tsx.
//
// A business still waiting for approval does get in. The backend lets it add
// its cars straight away; what waits for approval is each car appearing in
// search.
//
// This is a courtesy, not the protection. The backend refuses every private
// business request from anybody who is not a member of that business, whatever
// this frame decides.

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProviderNav } from './ProviderNav';
import {
  AppErrorBoundary,
  Button,
  Card,
  ErrorState,
  Icon,
  Logo,
  QuickSettingsButtons,
  Skeleton,
  Text,
} from '@/components/ui';
import { RequireSignIn } from '@/components/layout/RequireSignIn';
import { useSession } from '@/lib/auth';
import { useBusiness } from '@/lib/business';
import styles from '@/app/provider/provider.module.css';
import authStyles from '@/app/(auth)/auth.module.css';
import gateStyles from '@/components/layout/RequireSignIn.module.css';
import { useTranslation } from '@/lib/i18n';

// Pages that belong to somebody who is not yet a provider.
const BARE_PAGES = ['/provider/apply'];

// The plain centred column, with the logo and the language and theme buttons.
function BareFrame({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
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

export function ProviderShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isSignedIn, loading: sessionLoading, error: sessionError } = useSession();
  const business = useBusiness();

  if (BARE_PAGES.includes(pathname)) {
    return <BareFrame>{children}</BareFrame>;
  }

  // ---- 1. IS SOMEBODY SIGNED IN? ----
  // RequireSignIn already knows all three answers — still checking, could not
  // tell, signed out — so it is used as-is, with wording for this side.
  if (sessionLoading || sessionError || !isSignedIn) {
    return (
      <BareFrame>
        <RequireSignIn title={t('pp.gate.signInTitle')} body={t('pp.gate.signInBody')}>
          {null}
        </RequireSignIn>
      </BareFrame>
    );
  }

  // ---- 2. DO THEY RUN A BUSINESS? ----
  if (business.loading) {
    return (
      <BareFrame>
        <div className={gateStyles.loading}>
          <Skeleton height={28} width="40%" />
          <Skeleton height={140} radius="var(--radius-lg)" />
        </div>
      </BareFrame>
    );
  }

  if (business.error) {
    return (
      <BareFrame>
        <ErrorState message={business.error} onRetry={business.refresh} />
      </BareFrame>
    );
  }

  if (!business.hasBusiness) {
    return (
      <BareFrame>
        <Card padded className={gateStyles.gate}>
          <span className={gateStyles.icon}>
            <Icon name="storefront-outline" size={26} />
          </span>
          <Text variant="h2" as="h1" raw>
            {t('pp.gate.noBusinessTitle')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.gate.noBusinessBody')}
          </Text>
          <div className={gateStyles.actions}>
            <Button label={t('pp.gate.register')} href="/provider/apply" size="md" />
          </div>
        </Card>
      </BareFrame>
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
