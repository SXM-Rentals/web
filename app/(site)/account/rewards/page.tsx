'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Where somebody's rewards points and tier will be shown
// — and, until the scheme exists, says plainly that it is coming.
//
// ---- WHY THIS IS NOW A "COMING SOON" PAGE ----
//
// The backend has no rewards yet. This page used to draw a full preview from
// sample data: a points balance, a tier, a history of points earned, and the
// exact earning rates. With real accounts that stopped being a preview and
// became a set of claims — a balance nobody had earned, and rates the scheme
// has not committed to. And with the backend connected, the page actually
// showed "This is not connected yet" beside a Try Again button that could
// never work, which looks like a fault rather than a plan.
//
// So it says what is true: rewards are coming, nothing is being earned yet,
// and this is where points will appear. The tier ladder and earning rules
// that the preview used are in git history, and belong back on this page
// when the scheme is real and the backend can say what somebody has earned.
//
// Islander status is NOT affected by any of this. It is a residency flag set
// once documents are accepted, shown on the account, and has nothing to do
// with points — the reason the old page kept the two visibly apart.

import React from 'react';
import { ComingSoon, Text } from '@/components/ui';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function RewardsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('rewards.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.rewards.subtitle')}
        </Text>
      </div>

      <ComingSoon
        title={t('rewards.comingSoon')}
        body={t('acct.rewards.comingBody')}
        icon="gift-outline"
      />
    </div>
  );
}
