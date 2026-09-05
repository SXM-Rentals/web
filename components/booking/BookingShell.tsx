'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The frame around every step of the booking flow — the
// progress line across the top, the step's own content on the left, and the
// order summary beside it.
//
// THE SUMMARY STAYS VISIBLE THE WHOLE WAY THROUGH. On the phone the four steps
// are four separate screens and the price is only on some of them. Here there is
// room to keep it alongside, which matters most at the payment step: nobody
// should have to go back a page to check what they are about to be charged.
//
// It also works out the price lines in one place, so the summary, the payment
// step and the confirmation can never disagree about what the rental costs. The
// deposit is deliberately kept out of that calculation and passed separately.

import React from 'react';
import { useRouter } from 'next/navigation';
import { daysBetween, dateRange, money } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import {
  Card,
  PhotoPlaceholder,
  StepIndicator,
  Text,
} from '@/components/ui';
import { PriceBreakdown } from './PriceBreakdown';
import type { PriceLine, Vehicle } from '@/types';
import styles from './BookingShell.module.css';
import { useTranslation } from '@/lib/i18n';

// The four steps, named the same way in every place they are shown.
export const BOOKING_STEPS = ['Trip', 'Payment', 'Agreement', 'Confirm'];

// The service fee SXM Rentals adds. Written here as one number rather than
// scattered through the pages, so changing it is a single edit.
const SERVICE_FEE_RATE = 0.08;

// ---- WORKING OUT WHAT THE RENTAL COSTS ----
// Returns the lines that make up the bill. THE DEPOSIT IS NOT ONE OF THEM and
// must never be added here — it is money held and returned, not money charged.
export function buildPriceLines(
  vehicle: Vehicle,
  days: number,
  collection: 'pickup' | 'delivery',
): PriceLine[] {
  const lines: PriceLine[] = [];

  // A week or more is charged at the weekly rate where the business offers one,
  // because quoting the daily rate when a cheaper one applies is simply wrong.
  const useWeekly = vehicle.weeklyRate != null && days >= 7;

  if (useWeekly) {
    const weeks = Math.floor(days / 7);
    const spareDays = days % 7;

    lines.push({
      label: `${money(vehicle.weeklyRate!)} × ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`,
      amount: vehicle.weeklyRate! * weeks,
      note: 'Weekly rate applied',
    });

    if (spareDays > 0) {
      lines.push({
        label: `${money(vehicle.dailyRate)} × ${spareDays} ${spareDays === 1 ? 'day' : 'days'}`,
        amount: vehicle.dailyRate * spareDays,
      });
    }
  } else {
    lines.push({
      label: `${money(vehicle.dailyRate)} × ${days} ${days === 1 ? 'day' : 'days'}`,
      amount: vehicle.dailyRate * days,
    });
  }

  if (collection === 'delivery' && vehicle.deliveryAvailable && vehicle.deliveryFee) {
    lines.push({
      label: 'Delivery',
      amount: vehicle.deliveryFee,
      note: 'Brought to you rather than collected',
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);

  lines.push({
    label: 'Service Fee',
    amount: Math.round(subtotal * SERVICE_FEE_RATE),
    note: 'What SXM Rentals charges for handling the booking',
  });

  return lines;
}

export function BookingShell({
  vehicle,
  // Which of the four steps this is, counting from 1.
  step,
  title,
  subtitle,
  children,
  // The buttons at the end of the step.
  actions,
  // Set once the deposit has actually been placed on the card.
  depositHeld = false,
}: {
  vehicle: Vehicle;
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  depositHeld?: boolean;
}) {
  const { t } = useTranslation();
  const { trip, hasDates } = useTrip();
  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays;
  const lines = buildPriceLines(vehicle, days, trip.collection);

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.progress}>
        <StepIndicator current={step} steps={BOOKING_STEPS} />
      </div>

      <div className={styles.layout}>
        {/* ---- THE STEP ITSELF ---- */}
        <div className={styles.step}>
          <div className={styles.stepHead}>
            <Text variant="h1" as="h1">
              {title}
            </Text>
            {subtitle ? (
              <Text variant="bodyLg" tone="ink2">
                {subtitle}
              </Text>
            ) : null}
          </div>

          {children}

          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>

        {/* ---- THE SUMMARY, ALONGSIDE THROUGHOUT ---- */}
        <aside className={styles.summary} aria-label={t('flow.confirm.yourBooking')}>
          <Card>
            <div className={styles.vehicle}>
              <div className={styles.vehiclePhoto}>
                <PhotoPlaceholder shape="square" iconSize={26} />
              </div>
              <div className={styles.vehicleBody}>
                <Text variant="label" as="h2" raw>
                  {`${vehicle.make} ${vehicle.model}`}
                </Text>
                <Text variant="small" tone="ink2" raw>
                  {`${vehicle.year} · ${vehicle.seats} seats`}
                </Text>
                <Text variant="small" tone="ink3" raw>
                  {vehicle.pickupTown}
                </Text>
              </div>
            </div>
          </Card>

          <Card>
            <div className={styles.tripRows}>
              <div className={styles.tripRow}>
                <Text variant="small" tone="ink2" as="span" raw>
                  {t('flow.confirm.dates')}
                </Text>
                <Text variant="small" as="span" className={styles.tripRowValue} raw>
                  {hasDates ? dateRange(trip.startDate!, trip.endDate!) : 'Not set'}
                </Text>
              </div>

              <div className={styles.tripRow}>
                <Text variant="small" tone="ink2" as="span" raw>
                  {t('flow.confirm.length')}
                </Text>
                <Text variant="small" as="span" className={styles.tripRowValue} raw>
                  {`${days} ${days === 1 ? 'day' : 'days'}`}
                </Text>
              </div>

              <div className={styles.tripRow}>
                <Text variant="small" tone="ink2" as="span">
                  {trip.collection === 'delivery'
                    ? t('search.trip.deliveredTo')
                    : t('search.trip.collectFrom')}
                </Text>
                <Text variant="small" as="span" className={styles.tripRowValue} raw>
                  {trip.collection === 'delivery' ? trip.location : vehicle.pickupTown}
                </Text>
              </div>
            </div>
          </Card>

          {/* The deposit is passed in separately and is never part of the lines
              above, which is what keeps it out of the total. */}
          <PriceBreakdown
            lines={lines}
            depositAmount={vehicle.depositAmount}
            depositHeld={depositHeld}
          />
        </aside>
      </div>
    </div>
  );
}

// Sends someone back to the car if they have somehow reached a booking step
// without dates — which happens if they bookmark a step and come back later.
export function useRequireDates(vehicleId: string) {
  const router = useRouter();
  const { hasDates } = useTrip();

  React.useEffect(() => {
    if (!hasDates) {
      router.replace(`/vehicles/${vehicleId}`);
    }
  }, [hasDates, router, vehicleId]);

  return hasDates;
}

export default BookingShell;
