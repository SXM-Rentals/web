'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every payment SXM Rentals has made to this business, and
// the one still to come.
//
// EVERY ROW SHOWS ALL THREE NUMBERS: what customers paid, what SXM Rentals took,
// and what the business receives. That is the rule this page exists to hold — a
// business that cannot see the deduction has no way to check it, and "here is
// your money, trust us on the arithmetic" is not a relationship anybody should
// accept from a platform taking thirty per cent.
//
// SECURITY DEPOSITS ARE NOT IN ANY PAYOUT and cannot be. A deposit is held
// against the customer's card and given back to them; no commission is taken
// from it and it is never the business's money. The note at the bottom says so,
// because "where is my deposit money?" is otherwise an obvious question.

import React from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { dateRange, longDate, money } from '@/lib/format';
import { COMMISSION_RATE } from '@/lib/mock/business';
import {
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import { StatTile, EarningsSplit } from '@/components/business/Stats';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderPayoutsPage() {
  const { t } = useTranslation();
  const { data: payouts, loading, error, refresh } = useAsyncData(
    () => apiClient.getPayouts(),
    [],
  );

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={34} width="35%" />
        <Skeleton height={112} radius="var(--radius-lg)" />
        <Skeleton height={320} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!payouts || payouts.length === 0) {
    return (
      <EmptyState
        title={t('pp.payouts.emptyTitle')}
        body={t('pp.payouts.emptyBody')}
        icon="card-outline"
      />
    );
  }

  const paid = payouts.filter((payout) => payout.status === 'paid');
  const pending = payouts.filter((payout) => payout.status !== 'paid');

  const totalPaid = paid.reduce((sum, payout) => sum + payout.amount, 0);
  const totalPending = pending.reduce((sum, payout) => sum + payout.amount, 0);
  const totalCommission = payouts.reduce((sum, payout) => sum + payout.commission, 0);
  const totalGross = payouts.reduce((sum, payout) => sum + payout.grossAmount, 0);

  const next = pending[0];

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('web.provider.payouts')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {`Every payment, with the ${Math.round(
              COMMISSION_RATE * 100,
            )}% commission shown on each one.`}
          </Text>
        </div>
      </div>

      {/* ---- THE HEADLINE NUMBERS ---- */}
      <div className={styles.statGrid}>
        <StatTile
          label={t('pp.payouts.paidToYou')}
          value={money(totalPaid)}
          icon="checkmark-circle-outline"
          note={`${paid.length} ${paid.length === 1 ? 'payout' : 'payouts'}`}
        />
        <StatTile
          label={t('pp.payouts.stillToCome')}
          value={money(totalPending)}
          icon="time-outline"
          note={next ? `Due ${longDate(next.periodEnd)}` : 'Nothing pending'}
          noteTone="success"
        />
        <StatTile
          label={t('pp.payouts.customersPaid')}
          value={money(totalGross)}
          icon="people-outline"
          note={t('pp.payouts.beforeCommission')}
        />
        <StatTile
          label={t('pp.payouts.commissionTaken')}
          value={money(totalCommission)}
          icon="business-outline"
          note={`${Math.round(COMMISSION_RATE * 100)}% of what customers paid`}
        />
      </div>

      {/* ---- THE NEXT ONE, BROKEN DOWN ---- */}
      {next ? (
        <Card padded>
          <div className={styles.pageHead} style={{ marginBottom: 'var(--space-lg)' }}>
            <div>
              <Text variant="label" as="h2" raw>
                {t('pp.yourNextPayout')}
              </Text>
              <Text variant="small" tone="ink3" raw>
                {`${next.reference} · ${dateRange(next.periodStart, next.periodEnd)} · ${
                  next.bookingCount
                } bookings`}
              </Text>
            </div>
            <StatusPill
              label={next.status === 'processing' ? 'PROCESSING' : 'PENDING'}
              tone="warning"
            />
          </div>

          <EarningsSplit
            gross={next.grossAmount}
            commission={next.commission}
            net={next.amount}
          />
        </Card>
      ) : null}

      {/* ---- THE FULL LEDGER ----
          A real table, so a screen reader can announce which column a figure is
          in, and so it can be read down a column rather than as a wall. */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="sr-only">
            {t('pp.payouts.everyPayout')}
          </caption>

          <thead>
            <tr>
              <th scope="col">Payout</th>
              <th scope="col">Period</th>
              <th scope="col" className={styles.numeric}>
                {t('web.provider.bookings')}
              </th>
              <th scope="col" className={styles.numeric}>
                {t('pp.payouts.customersPaidLabel')}
              </th>
              <th scope="col" className={styles.numeric}>
                Commission
              </th>
              <th scope="col" className={styles.numeric}>
                {t('pp.payouts.youReceived')}
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id}>
                <td>
                  <Text variant="label" as="span" raw>
                    {payout.reference}
                  </Text>
                  {payout.paidOn ? (
                    <Text variant="caption" tone="ink3" raw>
                      {`Paid ${longDate(payout.paidOn)}`}
                    </Text>
                  ) : null}
                </td>

                <td>
                  <Text variant="body" as="span" raw>
                    {dateRange(payout.periodStart, payout.periodEnd)}
                  </Text>
                </td>

                <td className={styles.numeric}>
                  <Text variant="body" as="span" raw>
                    {String(payout.bookingCount)}
                  </Text>
                </td>

                <td className={styles.numeric}>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {money(payout.grossAmount)}
                  </Text>
                </td>

                <td className={styles.numeric}>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {`− ${money(payout.commission)}`}
                  </Text>
                </td>

                <td className={styles.numeric}>
                  <Text variant="label" as="span" raw>
                    {money(payout.amount)}
                  </Text>
                </td>

                <td>
                  <StatusPill
                    label={payout.status.toUpperCase()}
                    tone={
                      payout.status === 'paid'
                        ? 'success'
                        : payout.status === 'processing'
                          ? 'brand'
                          : 'warning'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- WHAT IS NOT IN HERE ---- */}
      <Card padded>
        <div className={styles.privacyNote}>
          <Icon name="shield-outline" size={20} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h2" raw>
              {t('pp.payouts.depositsNotPart')}
            </Text>
            <Text variant="small" tone="ink2">
              A deposit is held against the customer&rsquo;s card by SXM Rentals and given
              back to them when the vehicle is returned. It is never your money, no
              commission is taken from it, and it will never appear on this page. If a
              deposit needs to be claimed against for damage, that is handled separately
              and you will be contacted about it.
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}
