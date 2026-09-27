'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 1 of the booking — confirming the dates, and whether
// the car is collected or delivered.
//
// IT ALSO CHECKS THAT SOMEONE IS SIGNED IN, and this is the only place on the
// customer side that does. Rather than refusing outright, it explains what is
// needed and sends them to sign in with a note of where to come back to, so they
// land on this booking again rather than on the homepage having lost their place.
//
// THE DATES ARE PRICED BY THE BACKEND as soon as they are chosen, so anything
// it will refuse — too few days, too many, a car already booked for those days
// — is said here, at the step where it can still be changed, rather than at the
// end after an agreement has been signed.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { daysBetween, dateRange } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useQuote } from '@/hooks/useQuote';
import { useSession } from '@/lib/auth';
import {
  Button,
  Calendar,
  Card,
  Icon,
  SegmentedControl,
  Input,
  Sheet,
  Text,
} from '@/components/ui';
import { BookingShell } from './BookingShell';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingTripStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip, setTrip, hasDates } = useTrip();
  const { isSignedIn, loading } = useSession();
  const [datesOpen, setDatesOpen] = useState(false);
  const quote = useQuote(vehicle.id, trip);

  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : 0;

  // Why the next step cannot be reached yet, as a sentence rather than a silent
  // disabled button.
  const blocked = (): string | null => {
    if (!hasDates) return 'Choose your dates to continue.';
    if (days < vehicle.minimumDays)
      return `This car is rented for a minimum of ${vehicle.minimumDays} days.`;
    if (days > vehicle.maximumDays)
      return `This car can be rented for at most ${vehicle.maximumDays} days.`;
    if (trip.collection === 'delivery' && !trip.location.trim())
      return 'Add the address the car should be delivered to.';
    // What the backend said when it priced these dates — including a car that
    // has been booked by somebody else since this page was opened.
    if (quote.error) return quote.error;
    if (quote.quote && !quote.quote.available) return t('flow.trip.justBooked');
    return null;
  };

  const blockedReason = blocked();

  // ---- NOT SIGNED IN ----
  // Shown instead of the step, rather than bouncing straight to sign-in, so it
  // is clear WHY an account is suddenly being asked for after browsing freely.
  if (!loading && !isSignedIn) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-4xl)' }}>
        <Card padded className={styles.signInGate}>
          <Icon name="lock-closed-outline" size={28} />
          <Text variant="h2" as="h1" raw>
            {t('flow.signIn.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('flow.signIn.body')}
          </Text>

          <div className={styles.gateActions}>
            <Button label={t('auth.signIn')} href={`/login?next=/booking/${vehicle.id}`} size="md" />
            <Button
              label={t('footer.createAccount')}
              href={`/signup?next=/booking/${vehicle.id}`}
              variant="outline"
              size="md"
            />
          </div>

          <Button
            label={t('flow.trip.backToCar')}
            href={`/vehicles/${vehicle.id}`}
            variant="ghost"
            size="sm"
          />
        </Card>
      </div>
    );
  }

  return (
    <BookingShell
      vehicle={vehicle}
      step={1}
      title={t('flow.trip.title')}
      subtitle={t('flow.trip.subtitle')}
      quote={quote}
      actions={
        <>
          <Button
            label={t('flow.trip.backToCar')}
            href={`/vehicles/${vehicle.id}`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('flow.trip.continueToPayment')}
            size="md"
            disabled={Boolean(blockedReason) || quote.loading}
            onClick={() => router.push(`/booking/${vehicle.id}/payment`)}
          />
        </>
      }
    >
      {/* ---- DATES ---- */}
      <Card>
        <div className={styles.rowHead}>
          <Text variant="label" as="h2" raw>
            {t('flow.confirm.dates')}
          </Text>
          <Button
            label={hasDates ? 'Change' : 'Choose'}
            variant="ghost"
            size="sm"
            onClick={() => setDatesOpen(true)}
          />
        </div>

        {hasDates ? (
          <div className={styles.dateSummary}>
            <Icon name="calendar-outline" size={20} />
            <div>
              <Text variant="body" raw>
                {dateRange(trip.startDate!, trip.endDate!)}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {`${days} ${days === 1 ? 'day' : 'days'} · collection and return times are agreed with the business after booking`}
              </Text>
            </div>
          </div>
        ) : (
          <Text variant="body" tone="ink2" raw>
            {t('flow.trip.noDates')}
          </Text>
        )}
      </Card>

      {/* ---- COLLECTION OR DELIVERY ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('search.trip.howLabel')}
        </Text>

        <SegmentedControl
          label={t('search.trip.howLabel')}
          fullWidth
          value={trip.collection}
          onChange={(value) => setTrip({ collection: value })}
          options={[
            { value: 'pickup', label: 'Collection' },
            {
              value: 'delivery',
              label: vehicle.deliveryAvailable ? 'Delivery' : 'Delivery unavailable',
            },
          ]}
        />

        {trip.collection === 'delivery' ? (
          vehicle.deliveryAvailable ? (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Input
                label={t('flow.trip.deliverTo')}
                iconLeft="location-outline"
                placeholder={t('flow.trip.deliverPlaceholder')}
                value={trip.location}
                onChange={(event) => setTrip({ location: event.target.value })}
                hint={t('flow.trip.deliveryFree')}
              />
            </div>
          ) : (
            <div className={styles.note}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3">
                This business does not deliver. The car is collected from{' '}
                {vehicle.pickupTown}.
              </Text>
            </div>
          )
        ) : (
          <div className={styles.note}>
            <Icon name="location-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3">
              {`Collect from ${vehicle.pickupTown}. The exact address is sent once the booking is confirmed.`}
            </Text>
          </div>
        )}
      </Card>

      {/* ---- WHY THE BUTTON IS NOT AVAILABLE ---- */}
      {blockedReason ? (
        <div className={styles.note}>
          <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
          <Text variant="small" tone="ink2">
            {blockedReason}
          </Text>
        </div>
      ) : null}

      <Sheet
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        title={t('calendar.chooseDates')}
        subtitle={`Minimum ${vehicle.minimumDays} ${vehicle.minimumDays === 1 ? 'day' : 'days'}`}
        footer={<Button label={t('common.done')} size="md" onClick={() => setDatesOpen(false)} />}
      >
        <Calendar
          startDate={trip.startDate}
          endDate={trip.endDate}
          onChange={(range) => setTrip(range)}
          unavailableDates={vehicle.unavailableDates}
          showLegend
        />
      </Sheet>
    </BookingShell>
  );
}
