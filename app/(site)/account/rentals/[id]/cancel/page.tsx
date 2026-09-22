'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Cancelling a rental — for real, through the backend.
//
// ---- WHAT THIS PAGE NO LONGER DOES, AND WHY ----
//
// It used to work out a refund in the browser, from bands its own comment
// called "a first-pass version" still to be written by an attorney, and then
// tell the customer "$57 will go back to the card you paid with". On a demo
// that was harmless. On a real account it is a financial promise with nothing
// behind it:
//
//   - the backend has no refund logic at all. Cancelling sets the booking to
//     cancelled and releases the deposit hold, and that is everything;
//   - payments are not switched on yet, so nothing has been charged to refund;
//   - the refund policy itself is still placeholder text.
//
// So the page says what actually happens — the booking is cancelled and the
// deposit hold released — and points to the policy for refunds, rather than
// quoting an amount nobody will pay. When refunds exist on the backend, the
// amount belongs here again, worked out there and shown before confirming.
//
// It also used to ask why, promising the answer was "shared with SXM
// Rentals". The backend has nowhere to receive it, so the box is gone rather
// than collecting words that go nowhere.

import React, { use, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useBooking, useCarName } from '@/hooks/useBookings';
import { dateRange, money } from '@/lib/format';
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
  Text,
} from '@/components/ui';
import type { Booking } from '@/types';
import styles from '../../../account.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

export default function CancelRentalPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { id } = use(params);

  const [understood, setUnderstood] = useState(false);
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // The booking as the backend returned it after cancelling.
  const [cancelled, setCancelled] = useState<Booking | null>(null);

  const { booking, vehicle, lookedUp, loading, error, refresh } = useBooking(id);
  const carName = useCarName();

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

  // ---- DONE ----
  if (cancelled) {
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={34} color="var(--success)" />
        <Text variant="h2" as="h1" raw>
          {t('acct.cancel.done')}
        </Text>
        {/* The deposit as it stood BEFORE cancelling. Afterwards the backend
            reports it "released" even if no hold was ever placed, which would
            turn "never taken" into "the hold is released". */}
        <DepositLine booking={booking} />
        <RefundPolicyLine />
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button label={t('acct.cancel.backToRentals')} href="/account/rentals" size="md" />
          <Button label={t('acct.cancel.findAnother')} href="/search" variant="outline" size="md" />
        </div>
      </Card>
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

  const confirm = async () => {
    setWorking(true);
    setProblem(null);
    try {
      setCancelled(await apiClient.cancelBooking(booking.id));
    } catch (caught) {
      // Cancelled already — somewhere else, or by a second click — is not a
      // failure from where the customer stands. Show the page as done.
      if (isApiError(caught) && caught.code === 'already_cancelled') {
        setCancelled({ ...booking, status: 'cancelled' });
      } else {
        // `cannot_cancel` (the rental started in the meantime) and anything
        // else: the backend's own sentence says what happened.
        setProblem(isApiError(caught) ? caught.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setWorking(false);
    }
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
          {`${carName(vehicle, lookedUp)} · ${dateRange(booking.startDate, booking.endDate)}`}
        </Text>
      </div>

      {/* ---- WHAT HAPPENS TO THE MONEY, BEFORE ANYTHING IS CONFIRMED ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('acct.cancel.whatBack')}
        </Text>

        <div className={styles.infoRows}>
          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('acct.cancel.total')}
            </Text>
            <Text variant="body" as="span" raw>
              {money(booking.totalDueToday)}
            </Text>
          </div>
        </div>

        <Divider />

        <div style={{ display: 'grid', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
          <DepositLine booking={booking} />
          <RefundPolicyLine />
        </div>
      </Card>

      <Card>
        <Checkbox
          checked={understood}
          onChange={setUnderstood}
          label={t('acct.cancel.understand')}
        />

        {problem ? (
          <div className={styles.note} role="alert" style={{ marginTop: 'var(--space-md)' }}>
            <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

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

// ---- THE DEPOSIT ----
// Separate from any refund, always. It was never a charge, so on a
// cancellation the hold simply goes — the backend releases it.
function DepositLine({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  // A claimed deposit is a dispute, not something this page can summarise in
  // a line — and a rental that can still be cancelled cannot have one yet.
  if (booking.depositAmount <= 0 || booking.depositStatus === 'claimed') return null;

  const sentence =
    booking.depositStatus === 'not_taken'
      ? t('acct.cancel.depositNotTaken')
      : t('acct.cancel.depositReleased');

  return (
    <div className={styles.note}>
      <Icon name="shield-outline" size={15} color="var(--ink3)" />
      <Text variant="small" tone="ink3" raw>
        {sentence.replace('{amount}', money(booking.depositAmount))}
      </Text>
    </div>
  );
}

// ---- REFUNDS ----
// A pointer to the policy, not an amount. See the note at the top of the file.
function RefundPolicyLine() {
  const { t } = useTranslation();
  return (
    <div className={styles.note}>
      <Icon name="document-outline" size={15} color="var(--ink3)" />
      <Link href="/legal/cancellation-refund" style={{ color: 'var(--brand)', fontWeight: 600 }}>
        <Text variant="small" as="span" tone="brand" raw>
          {t('acct.cancel.refundPolicy')}
        </Text>
      </Link>
    </div>
  );
}
