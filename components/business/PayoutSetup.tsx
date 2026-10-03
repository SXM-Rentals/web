'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The card at the top of /provider/payouts that says
// where a business's money goes — and, until that is settled, sends them to
// Stripe to settle it.
//
// ---- HOW IT WORKS ----
//
// The business never gives SXM Rentals its bank details. The backend asks
// Stripe for a one-time link, the browser goes to Stripe's own page, and
// Stripe sends the business back to /provider/payouts when they are done — or
// when the link has expired, which is why this card always offers a fresh one
// while anything is still missing. Coming back is a full page load, so the
// status below is read again, live from Stripe, every time.
//
// ---- WHAT IT SAYS ----
//
//   not started  — what is needed, and a button to start.
//   pending      — how many things Stripe still wants, and a button to carry
//                  on; or, if it wants nothing more, that it is checking.
//   restricted   — Stripe has paused payouts until it has more, and the same
//                  button.
//   active       — that payouts are on. Nothing to do.
//
// Stripe's own names for what it still wants ("external_account",
// "individual.verification.document") are counted, never shown: they mean
// nothing to somebody running a rental business, and Stripe's page says what
// each one is when they get there.

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { isApiError, isUnavailable } from '@/lib/api/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { leaveSiteFor } from '@/lib/leave-site';
import { Button, Card, Icon, Skeleton, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import styles from '@/app/provider/provider.module.css';

export function PayoutSetup() {
  const { t } = useTranslation();
  const { data: account, loading, error, unavailable, refresh } = useAsyncData(
    (signal) => apiClient.getPayoutAccount(signal),
    [],
  );
  const [going, setGoing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const goToStripe = async () => {
    setGoing(true);
    setProblem(null);
    try {
      leaveSiteFor(await apiClient.startPayoutSetup());
      // Left on "going" on purpose: the page is on its way to Stripe.
    } catch (caught) {
      setGoing(false);
      setProblem(
        isUnavailable(caught)
          ? t('pp.payoutSetup.notOn')
          : isApiError(caught)
            ? caught.message
            : t('pp.payoutSetup.loadFailed'),
      );
    }
  };

  if (loading) {
    return <Skeleton height={120} radius="var(--radius-lg)" />;
  }

  const status = account?.status ?? 'not_started';
  const outstanding = account?.outstanding.length ?? 0;
  const done = status === 'active' && account?.payoutsEnabled;

  let message: string;
  if (unavailable) message = t('pp.payoutSetup.notOn');
  else if (error) message = t('pp.payoutSetup.loadFailed');
  else if (done) message = t('pp.payoutSetup.active');
  else if (status === 'restricted') message = t('pp.payoutSetup.restricted');
  else if (status === 'pending' && outstanding === 0) message = t('pp.payoutSetup.pendingChecking');
  else if (status === 'pending' || status === 'active') {
    message = t('pp.payoutSetup.pending').replace('{count}', String(Math.max(outstanding, 1)));
  } else message = t('pp.payoutSetup.notStarted');

  // Nothing to send them to Stripe for once payouts are on, or while Stripe is
  // checking what it already has.
  const offerStripe =
    !unavailable && !error && !done && !(status === 'pending' && outstanding === 0);

  return (
    <Card padded>
      <div className={styles.privacyNote}>
        <Icon
          name={done ? 'checkmark-circle-outline' : 'card-outline'}
          size={20}
          color={done ? 'var(--success)' : 'var(--ink2)'}
        />
        <div>
          <Text variant="label" as="h2" raw>
            {t('pp.payoutSetup.title')}
          </Text>
          <Text variant="small" tone="ink2" raw>
            {message}
          </Text>
        </div>
      </div>

      {problem ? (
        <div className={styles.note} role="alert">
          <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
          <Text variant="small" tone="ink2" raw>
            {problem}
          </Text>
        </div>
      ) : null}

      {error && !unavailable ? (
        <div style={{ marginTop: 'var(--space-md)' }}>
          <Button label={t('common.retry')} variant="outline" size="sm" onClick={refresh} />
        </div>
      ) : null}

      {offerStripe ? (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Button
            label={status === 'not_started' ? t('pp.payoutSetup.start') : t('pp.payoutSetup.continue')}
            size="md"
            loading={going}
            onClick={goToStripe}
          />
          <Text variant="small" tone="ink3" raw style={{ marginTop: 'var(--space-sm)' }}>
            {t('pp.payoutSetup.leaving')}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}

export default PayoutSetup;
