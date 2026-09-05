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

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dateRange, daysBetween, money, sideLabels } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { Button, Card, ErrorState, Icon, Text } from '@/components/ui';
import { BookingShell, buildPriceLines } from './BookingShell';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingConfirmStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip, hasDates } = useTrip();
  const { user } = useSession();

  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays;
  const lines = buildPriceLines(vehicle, days, trip.collection);
  // The total is the sum of the price lines. The deposit is NOT part of it.
  const total = lines.reduce((sum, line) => sum + line.amount, 0);

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
    { label: 'Paid today', value: money(total) },
    { label: 'Deposit held', value: `${money(vehicle.depositAmount)} — returned after` },
  ];

  const confirm = async () => {
    setWorking(true);
    setError(undefined);

    try {
      // Nothing is really reserved and nothing is really charged — there is no
      // backend. This creates a pretend booking so the success page has
      // something real-shaped to show.
      await apiClient.createBooking({
        vehicleId: vehicle.id,
        providerId: vehicle.providerId,
        startDate: trip.startDate,
        endDate: trip.endDate,
        collection: trip.collection,
        location: trip.collection === 'delivery' ? trip.location : vehicle.pickupTown,
        lines,
        depositAmount: vehicle.depositAmount,
        totalDueToday: total,
      });

      router.push(`/booking/${vehicle.id}/done`);
    } catch {
      // A failure here must never look like a success, and must never leave the
      // button spinning with no explanation.
      setError(
        'We could not confirm your booking. Nothing has been charged. Please try again.',
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
      depositHeld
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
            onClick={confirm}
            priceLabel={money(total)}
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
          <Text variant="small" tone="ink2">
            {`The ${money(
              vehicle.depositAmount,
            )} deposit is held shortly before you collect the car, not now, and is returned after you bring it back.`}
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
