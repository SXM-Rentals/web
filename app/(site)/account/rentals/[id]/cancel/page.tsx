'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Cancelling a rental.
//
// THE RULE THIS PAGE EXISTS TO HOLD: the refund is worked out and shown BEFORE
// anything is confirmed. Nobody should ever cancel and then discover what it
// cost them. The amount, the reason for it, and what happens to the deposit are
// all on screen above the button, not on a page afterwards.
//
// The refund is worked out from how close to the start of the rental the
// cancellation is — the closer it gets, the less comes back, because the
// business has by then turned away other bookings for those dates.

import React, { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { dateRange, money } from '@/lib/format';
import dayjs from 'dayjs';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  TextArea,
  Text,
} from '@/components/ui';
import styles from '../../../account.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

// ---- WORKING OUT WHAT COMES BACK ----
// A first-pass version of the Cancellation and Refund Policy. The real bands
// have to be agreed and written by an attorney; these show the shape of it.
function refundFor(startDate: string, paid: number) {
  const daysUntil = dayjs(startDate).startOf('day').diff(dayjs().startOf('day'), 'day');

  if (daysUntil >= 7) {
    return {
      share: 1,
      amount: paid,
      band: 'Seven days or more before collection',
      reason: 'Cancelled early enough for the business to rent the car to somebody else.',
    };
  }

  if (daysUntil >= 2) {
    return {
      share: 0.5,
      amount: Math.round(paid * 0.5),
      band: 'Two to six days before collection',
      reason: 'Close enough that the business has probably turned other bookings away.',
    };
  }

  return {
    share: 0,
    amount: 0,
    band: 'Less than two days before collection',
    reason:
      'This close to the start the car has been held for you and cannot realistically be re-let.',
  };
}

export default function CancelRentalPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { id } = use(params);
  const router = useRouter();

  const [reason, setReason] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);

  const { data: booking, loading, error, refresh } = useAsyncData(
    () => apiClient.getBooking(id),
    [id],
  );

  const refund = useMemo(
    () => (booking ? refundFor(booking.startDate, booking.totalDueToday) : null),
    [booking],
  );

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="45%" />
        <Skeleton height={260} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!booking) {
    return (
      <EmptyState
        title={t('acct.rental.notFound')}
        body="It may already have been cancelled, or the address may be wrong."
        icon="car-outline"
        actionLabel={t('acct.cancel.backToRentals')}
        actionHref="/account/rentals"
      />
    );
  }

  // Only a rental that has not started can be cancelled. One that is already out
  // is a different conversation and needs the business, not a button.
  if (booking.status !== 'upcoming') {
    return (
      <EmptyState
        title={t('acct.cancel.cannotTitle')}
        body={
          booking.status === 'active'
            ? 'The car is already out. Message the business to arrange bringing it back early.'
            : 'This rental has already finished or been cancelled.'
        }
        icon="information-circle-outline"
        actionLabel={t('acct.extend.back')}
        actionHref={`/account/rentals/${booking.id}`}
      />
    );
  }

  const vehicle = findVehicle(booking.vehicleId);

  if (done) {
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={34} color="var(--success)" />
        <Text variant="h2" as="h1" raw>
          {t('acct.cancel.done')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {refund && refund.amount > 0
            ? `${money(refund.amount)} will go back to the card you paid with. Banks usually take a few working days to show it.`
            : 'No refund is due on this cancellation, for the reason shown before you confirmed.'}
        </Text>
        <Text variant="small" tone="ink3" raw>
          {t('acct.cancel.demoNote')}
        </Text>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button label={t('acct.cancel.backToRentals')} href="/account/rentals" size="md" />
          <Button label={t('acct.cancel.findAnother')} href="/search" variant="outline" size="md" />
        </div>
      </Card>
    );
  }

  const confirm = () => {
    setWorking(true);
    window.setTimeout(() => {
      setWorking(false);
      setDone(true);
    }, 600);
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Rentals', href: '/account/rentals' },
          { label: booking.reference, href: `/account/rentals/${booking.id}` },
          { label: 'Cancel' },
        ]}
      />

      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('acct.cancel.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Your car'} ·{' '}
          {dateRange(booking.startDate, booking.endDate)}
        </Text>
      </div>

      {/* ---- WHAT YOU GET BACK, BEFORE ANYTHING IS CONFIRMED ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('acct.cancel.whatBack')}
        </Text>

        <div className={styles.infoRows}>
          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('acct.cancel.youPaid')}
            </Text>
            <Text variant="body" as="span" raw>
              {money(booking.totalDueToday)}
            </Text>
          </div>

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('acct.cancel.band')}
            </Text>
            <Text variant="body" as="span" className={styles.infoValue} raw>
              {refund!.band}
            </Text>
          </div>

          <Divider />

          <div className={styles.infoRow}>
            <Text variant="h3" as="span">
              Refund
            </Text>
            <Text
              variant="h3"
              as="span"
              tone={refund!.amount > 0 ? 'success' : 'danger'}
              raw
            >
              {money(refund!.amount)}
            </Text>
          </div>
        </div>

        <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3">
            {refund!.reason}
          </Text>
        </div>

        {/* The deposit is separate from the refund and always comes back in
            full on a cancellation — no commission is taken from it and it was
            never revenue in the first place. */}
        {booking.depositAmount > 0 ? (
          <div className={styles.note}>
            <Icon name="shield-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {booking.depositStatus === 'held'
                ? `The ${money(booking.depositAmount)} deposit hold is released in full. It was never a charge.`
                : `The ${money(booking.depositAmount)} deposit was never taken, so there is nothing to return.`}
            </Text>
          </div>
        ) : null}

        <div className={styles.note}>
          <Icon name="document-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3">
            Worked out under the{' '}
            <Link href="/legal/cancellation-refund" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              Cancellation and Refund Policy
            </Link>
            .
          </Text>
        </div>
      </Card>

      {/* ---- WHY ---- */}
      <Card>
        <TextArea
          label={t('acct.cancel.why')}
          hint="Optional, and only shared with SXM Rentals. It helps us see where the process is going wrong."
          placeholder={t('acct.cancel.whyPlaceholder')}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={400}
          showCount
        />
      </Card>

      <Card>
        <Checkbox
          checked={understood}
          onChange={setUnderstood}
          label={
            refund!.amount > 0
              ? `I understand that ${money(refund!.amount)} of the ${money(
                  booking.totalDueToday,
                )} I paid will be refunded, and that this cannot be undone.`
              : `I understand that no refund is due on this cancellation, and that this cannot be undone.`
          }
        />

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
          <Button
            label={t('acct.cancel.keep')}
            href={`/account/rentals/${booking.id}`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('acct.cancel.title')}
            variant="danger"
            size="md"
            disabled={!understood}
            loading={working}
            onClick={confirm}
          />
        </div>
      </Card>
    </div>
  );
}
