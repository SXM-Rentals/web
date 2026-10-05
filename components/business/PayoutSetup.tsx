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
// ---- WHERE THE BANK IS ----
//
// Stripe pays banks in the United States and in France — the French side
// counts as France — but cannot pay a bank in Sint Maarten. So the first time,
// the card asks where the business's bank is. US or France: on to Stripe. The
// Dutch side: nothing goes to Stripe; SXM Rentals pays by bank transfer and
// contacts the business for its bank details, and the card says so from then
// on. A French-side business starts with France chosen; a Dutch-side one has
// to choose, because both a US and a local bank are common there.
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
import { useBusiness } from '@/lib/business';
import { Button, Card, Chip, ChipRow, Icon, Skeleton, Text } from '@/components/ui';
import type { BankCountry } from '@/types';
import { useTranslation } from '@/lib/i18n';
import styles from '@/app/provider/provider.module.css';

export function PayoutSetup() {
  const { t } = useTranslation();
  const { data: account, loading, error, unavailable, refresh } = useAsyncData(
    (signal) => apiClient.getPayoutAccount(signal),
    [],
  );
  const { provider } = useBusiness();
  const [going, setGoing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // A French-side business banks in France unless it says otherwise.
  const [bankCountry, setBankCountry] = useState<BankCountry | null>(
    provider?.side === 'french' ? 'FR' : null,
  );

  const status = account?.status ?? 'not_started';
  const byTransfer = account?.method === 'bank_transfer';
  // The bank's country is only asked the first time; after that the backend
  // already knows, and carrying on with Stripe needs nothing more.
  const askBank = status === 'not_started' && !byTransfer;

  const goToStripe = async () => {
    if (askBank && !bankCountry) return;
    setGoing(true);
    setProblem(null);
    try {
      const answer = await apiClient.startPayoutSetup(askBank ? bankCountry ?? undefined : undefined);
      if (answer.url) {
        leaveSiteFor(answer.url);
        // Left on "going" on purpose: the page is on its way to Stripe.
        return;
      }
      // A bank on the Dutch side: no Stripe page. The card now says how they
      // are paid instead.
      setGoing(false);
      refresh();
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

  const outstanding = account?.outstanding.length ?? 0;
  const done = byTransfer ? status === 'active' : status === 'active' && account?.payoutsEnabled;

  let message: string;
  if (unavailable) message = t('pp.payoutSetup.notOn');
  else if (error) message = t('pp.payoutSetup.loadFailed');
  else if (byTransfer) message = done ? t('pp.payoutSetup.byTransferActive') : t('pp.payoutSetup.byTransfer');
  else if (done) message = t('pp.payoutSetup.active');
  else if (status === 'restricted') message = t('pp.payoutSetup.restricted');
  else if (status === 'pending' && outstanding === 0) message = t('pp.payoutSetup.pendingChecking');
  else if (status === 'pending' || status === 'active') {
    message = t('pp.payoutSetup.pending').replace('{count}', String(Math.max(outstanding, 1)));
  } else message = t('pp.payoutSetup.notStarted');

  // Nothing to send them to Stripe for once payouts are on, or while Stripe is
  // checking what it already has.
  const offerStripe =
    !unavailable && !error && !done && !byTransfer && !(status === 'pending' && outstanding === 0);

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
          {askBank ? (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.payoutSetup.bankQuestion')}
              </Text>
              <ChipRow>
                {(
                  [
                    ['SX', 'pp.payoutSetup.bankSX'],
                    ['US', 'pp.payoutSetup.bankUS'],
                    ['FR', 'pp.payoutSetup.bankFR'],
                  ] as const
                ).map(([country, key]) => (
                  <Chip
                    key={country}
                    label={t(key)}
                    selected={bankCountry === country}
                    onClick={() => setBankCountry(country)}
                  />
                ))}
              </ChipRow>
              <Text variant="small" tone="ink3" raw style={{ marginTop: 'var(--space-sm)' }}>
                {bankCountry === 'SX' ? t('pp.payoutSetup.bankSXNote') : t('pp.payoutSetup.bankHint')}
              </Text>
            </div>
          ) : null}
          <Button
            label={status === 'not_started' ? t('pp.payoutSetup.start') : t('pp.payoutSetup.continue')}
            size="md"
            loading={going}
            disabled={askBank && !bankCountry}
            onClick={goToStripe}
          />
          {!askBank || (bankCountry && bankCountry !== 'SX') ? (
            <Text variant="small" tone="ink3" raw style={{ marginTop: 'var(--space-sm)' }}>
              {t('pp.payoutSetup.leaving')}
            </Text>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export default PayoutSetup;
