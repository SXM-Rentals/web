'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 4 of the booking — the last look before it is
// confirmed. Everything that has been chosen, in one place, with the total and
// the deposit shown separately one final time.
//
// WHY THERE IS A STEP HERE AT ALL: this is the last point at which a mistake
// costs nothing to fix. Wrong dates, the wrong side of the island, or a delivery
// address that was never filled in are all cheap to correct now and expensive to
// correct once a business has been told to expect someone.
//
// THE BOOKING IS MADE HERE, and the backend's own refusal is what the page
// shows if it will not have it — "this vehicle has just been booked for those
// dates" is worth reading; "something went wrong" is not. The reference it
// hands back is carried to the last step, so the page that says "you are
// booked" shows the booking that was actually made.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dateRange, daysBetween, money, sideLabels } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useQuote } from '@/hooks/useQuote';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { Button, Card, ErrorState, Icon, Text } from '@/components/ui';
import { BookingShell } from './BookingShell';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingConfirmStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip, hasDates } = useTrip();
  const { user } = useSession();
  const quote = useQuote(vehicle.id, trip);

  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const days = quote.quote?.days ?? (hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays);
  // The backend's total for these dates. The deposit is never part of it.
  const total = quote.quote?.totalDueToday;
  const deposit = quote.quote?.depositAmount ?? vehicle.depositAmount;

  const rows: { label: string; value: string }[] = [
    { label: 'Vehicle', value: `${vehicle.make} ${vehicle.model} ${vehicle.year}` },
    {
      label: 'Dates',
      value: hasDates ? dateRange(trip.startDate!, trip.endDate!) : 'Not set',
    },
    { label: 'Length', value: `${days} ${days === 1 ? 'day' : 'days'}` },
    {
      label: trip.collection === 'delivery' ? 'Delivered to' : 'Collect from',
      value:
        trip.collection === 'delivery'
          ? trip.location
          : `${vehicle.pickupTown}, ${sideLabels[vehicle.side]}`,
    },
    { label: 'Driver', value: user ? `${user.firstName} ${user.lastName}` : 'You' },
    { label: 'Booking total', value: total === undefined ? '—' : money(total) },
    { label: t('vehicle.depositLabel'), value: t('flow.confirm.depositRow').replace('{amount}', money(deposit)) },
  ];

  const confirm = async () => {
    // A booking with no dates cannot be made, and the backend would refuse it.
    // Refusing here says something useful instead of sending a request that
    // comes back as a validation error the person cannot act on. The steps
    // before this should make it impossible to arrive without dates; this is
    // the belt to that pair of braces.
    if (!trip.startDate || !trip.endDate) {
      setError('Please choose your dates before confirming.');
      return;
    }

    setWorking(true);
    setError(undefined);

    try {
      // Only the trip is sent. The price, the reference and the deposit are
      // worked out by the backend and come back on the booking — deliberately,
      // because it is the backend that actually charges. Sending our own
      // figures would mean two sets of pricing rules, and the first time one
      // of them changed they would quietly disagree.
      const booking = await apiClient.createBooking({
        vehicleId: vehicle.id,
        startDate: trip.startDate,
        endDate: trip.endDate,
        collection: trip.collection,
        location: trip.collection === 'delivery' ? trip.location : vehicle.pickupTown,
      });

      // The reference travels in the address, so the confirmation shows the
      // real booking and survives a reload.
      router.push(
        `/booking/${vehicle.id}/done?ref=${encodeURIComponent(booking.reference)}&booking=${encodeURIComponent(booking.id)}`,
      );
    } catch (caught) {
      // A failure here must never look like a success, and must never leave the
      // button spinning with no explanation. The backend's own sentence is
      // shown: "this vehicle has just been booked for those dates" is something
      // a person can act on.
      setError(
        isApiError(caught)
          ? caught.message
          : 'We could not confirm your booking. Nothing has been charged. Please try again.',
      );
      setWorking(false);
    }
  };

  return (
    <BookingShell
      vehicle={vehicle}
      step={4}
      title={t('flow.confirm.title')}
      subtitle={t('flow.confirm.subtitle')}
      quote={quote}
      actions={
        <>
          <Button
            label={t('common.back')}
            href={`/booking/${vehicle.id}/agreement`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('flow.confirm.cta')}
            size="md"
            loading={working}
            disabled={quote.loading || total === undefined}
            onClick={confirm}
            {...(total === undefined ? {} : { priceLabel: money(total) })}
          />
        </>
      }
    >
      {error ? <ErrorState message={error} inline onRetry={confirm} /> : null}

      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('flow.confirm.yourBooking')}
        </Text>

        <div className={styles.reviewRows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.reviewRow}>
              <Text variant="body" tone="ink2" as="span">
                {row.label}
              </Text>
              <Text variant="body" as="span" className={styles.reviewValue} raw>
                {row.value}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.confirm.signedNote')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="shield-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.confirm.depositNote').replace('{amount}', money(deposit))}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="card-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.confirm.nothingCharged')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="chatbubble-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.confirm.privacyNote')}
          </Text>
        </div>
      </Card>
    </BookingShell>
  );
}
