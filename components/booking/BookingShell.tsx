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
// ---- THE PRICE COMES FROM THE BACKEND ----
//
// This file used to work the price out itself, from a copy of the rules, and
// every step drew its summary from that. The copy had drifted: an 8% service
// fee where the backend charges 5%, and a delivery charge where the backend
// charges nothing. Now each step asks the backend for a quote (hooks/useQuote)
// and hands it here, so the summary, the button and the bill are one number
// from one place — the place that takes the money.
//
// The deposit is never part of that total. It arrives beside it.

import React from 'react';
import { useRouter } from 'next/navigation';
import { daysBetween, dateRange } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import type { QuoteState } from '@/hooks/useQuote';
import {
  Card,
  ErrorState,
  Icon,
  PhotoPlaceholder,
  Skeleton,
  StepIndicator,
  Text,
} from '@/components/ui';
import { PriceBreakdown } from './PriceBreakdown';
import type { Vehicle } from '@/types';
import styles from './BookingShell.module.css';
import { useTranslation } from '@/lib/i18n';

// The four steps, named the same way in every place they are shown.
export const BOOKING_STEPS = ['Trip', 'Payment', 'Agreement', 'Confirm'];

export function BookingShell({
  vehicle,
  // Which of the four steps this is, counting from 1.
  step,
  title,
  subtitle,
  children,
  // The buttons at the end of the step.
  actions,
  // The backend's price for these dates — see hooks/useQuote.ts.
  quote,
}: {
  vehicle: Vehicle;
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  quote: QuoteState;
}) {
  const { t } = useTranslation();
  const { trip, hasDates } = useTrip();
  const days = quote.quote?.days ?? (hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays);

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

          {/* ---- THE PRICE, AS THE BACKEND WORKS IT OUT ----
              A price that could not be fetched is never guessed at: the panel
              says so and offers to ask again. The deposit arrives separately
              and is never part of the total. */}
          {quote.loading ? (
            <Card>
              <Skeleton height={20} width="45%" />
              <Skeleton height={64} radius="var(--radius-md)" style={{ marginTop: 'var(--space-md)' }} />
            </Card>
          ) : quote.error ? (
            <ErrorState message={quote.error} onRetry={quote.refresh} inline />
          ) : quote.quote ? (
            <PriceBreakdown
              lines={quote.quote.lines}
              depositAmount={quote.quote.depositAmount}
            />
          ) : (
            <Card>
              <div className={styles.noPrice}>
                <Icon name="calendar-outline" size={16} color="var(--ink3)" />
                <Text variant="small" tone="ink3" raw>
                  {t('flow.price.needDates')}
                </Text>
              </div>
            </Card>
          )}
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
