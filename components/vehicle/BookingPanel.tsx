'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The panel on the right of a car's page holding the price,
// the dates, the security deposit and the button that starts a booking. On a
// laptop it follows the page as you scroll, so the price never goes off screen
// while you are reading about the car.
//
// THE RULE THIS PANEL HAS TO HOLD: the security deposit is shown BELOW the
// total, in its own tinted box, and is never added into it. A deposit is held
// against a card and given back. Folding it into the total would make every
// rental look far more expensive than it is, and would misrepresent money that
// is only being set aside.
//
// It also enforces the minimum and maximum rental length, and explains WHY the
// button is unavailable rather than just greying it out — being refused with no
// reason given is the most frustrating way for a form to fail.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { daysBetween, dateRange, money, perDay } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useSession } from '@/lib/auth';
import {
  Button,
  Calendar,
  Card,
  Icon,
  Sheet,
  StatusPill,
  Text,
} from '@/components/ui';
import type { Vehicle } from '@/types';
import styles from '@/app/(site)/vehicles/[id]/vehicle.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingPanel({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip, setTrip, hasDates } = useTrip();
  const { isSignedIn } = useSession();
  const [datesOpen, setDatesOpen] = useState(false);

  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : 0;

  // ---- WHAT THE RENTAL COMES TO ----
  // Only the rental itself and the delivery charge. The deposit is deliberately
  // absent from this sum and is shown separately below.
  const rentalTotal = days * vehicle.dailyRate;
  const deliveryFee =
    trip.collection === 'delivery' && vehicle.deliveryAvailable
      ? (vehicle.deliveryFee ?? 0)
      : 0;
  const dueToday = rentalTotal + deliveryFee;

  // ---- WHY THE BUTTON MIGHT NOT BE AVAILABLE ----
  // Worked out as a sentence rather than a boolean, so the reason can be shown.
  const blockedReason = (): string | null => {
    if (!hasDates) return t('search.addDatesHint');
    if (days < vehicle.minimumDays) {
      return `This car is rented for a minimum of ${vehicle.minimumDays} days. Your dates cover ${days}.`;
    }
    if (days > vehicle.maximumDays) {
      return `This car can be rented for at most ${vehicle.maximumDays} days. Your dates cover ${days}.`;
    }
    return null;
  };

  const blocked = blockedReason();

  const startBooking = () => {
    // THE ONE PLACE AN ACCOUNT IS ACTUALLY NEEDED. Everything up to here works
    // signed out. Someone signed out is sent to sign in and then brought
    // straight back to this booking rather than being dropped on the homepage.
    if (!isSignedIn) {
      router.push(`/login?next=/booking/${vehicle.id}`);
      return;
    }
    router.push(`/booking/${vehicle.id}`);
  };

  return (
    <div className={styles.panel}>
      <Card padded>
        <div className={styles.panelInner}>
          <div className={styles.priceHead}>
            <Text variant="h2" as="p" raw>
              {money(vehicle.dailyRate)}
            </Text>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('common.perDay')}
            </Text>
          </div>

          {vehicle.weeklyRate ? (
            <Text variant="small" tone="ink2">
              {`${money(vehicle.weeklyRate)} per week if you keep it seven days or more.`}
            </Text>
          ) : null}

          {/* ---- THE DATES ---- */}
          <button type="button" className={styles.datesButton} onClick={() => setDatesOpen(true)}>
            <Icon name="calendar-outline" size={20} />
            <span className={styles.datesText}>
              <Text variant="caption" tone="ink3" as="span" raw>
                {t('vehicle.panel.yourDates')}
              </Text>
              <Text variant="label" as="span" raw>
                {hasDates
                  ? `${dateRange(trip.startDate!, trip.endDate!)} · ${days} ${days === 1 ? 'day' : 'days'}`
                  : t('search.trip.addDates')}
              </Text>
            </span>
            <Icon name="chevron-forward" size={18} />
          </button>

          {/* ---- THE RUNNING TOTAL ---- */}
          {hasDates && !blocked ? (
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <Text variant="body" tone="ink2" as="span" raw>
                  {`${perDay(vehicle.dailyRate)} × ${days} ${days === 1 ? 'day' : 'days'}`}
                </Text>
                <Text variant="body" as="span" raw>
                  {money(rentalTotal)}
                </Text>
              </div>

              {deliveryFee > 0 ? (
                <div className={styles.totalRow}>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {t('booking.delivery')}
                  </Text>
                  <Text variant="body" as="span" raw>
                    {money(deliveryFee)}
                  </Text>
                </div>
              ) : null}

              <div className={styles.totalRow}>
                <Text variant="h3" as="span" raw>
                  {t('booking.dueToday')}
                </Text>
                <Text variant="h3" as="span" raw>
                  {money(dueToday)}
                </Text>
              </div>
            </div>
          ) : null}

          {/* ---- THE SECURITY DEPOSIT, KEPT SEPARATE ----
              Below the total, in its own box, never part of the figure above. */}
          {vehicle.depositAmount > 0 ? (
            <div className={styles.depositLine}>
              <Icon name="shield-outline" size={16} color="var(--ink2)" />
              <div className={styles.depositLineBody}>
                <div className={styles.depositLineHead}>
                  <Text variant="body" tone="ink2" as="span">
                    {t('vehicle.depositLabel')}
                  </Text>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {money(vehicle.depositAmount)}
                  </Text>
                </div>
                <Text variant="small" tone="ink3" raw>
                  {t('vehicle.panel.depositNote')}
                </Text>
              </div>
            </div>
          ) : null}

          {/* ---- THE BUTTON, AND THE REASON IF IT IS UNAVAILABLE ---- */}
          <Button
            label={hasDates ? 'Book this car' : 'Add dates to book'}
            fullWidth
            size="lg"
            disabled={Boolean(blocked)}
            onClick={startBooking}
          />

          {blocked ? (
            <div className={styles.panelNote}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3">
                {blocked}
              </Text>
            </div>
          ) : (
            <div className={styles.panelNote}>
              <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('vehicle.panel.notChargedYet')}
              </Text>
            </div>
          )}

          {/* Where the car is collected from, and whether it can be brought. */}
          <div className={styles.panelRow}>
            <Text variant="small" tone="ink2" as="span" raw>
              {t('search.trip.collection')}
            </Text>
            <Text variant="small" as="span" raw>
              {vehicle.pickupTown}
            </Text>
          </div>

          {vehicle.deliveryAvailable ? (
            <div className={styles.panelRow}>
              <Text variant="small" tone="ink2" as="span" raw>
                {t('booking.delivery')}
              </Text>
              <StatusPill
                label={
                  vehicle.deliveryFee
                    ? `AVAILABLE · ${money(vehicle.deliveryFee)}`
                    : 'AVAILABLE'
                }
                tone="success"
              />
            </div>
          ) : null}
        </div>
      </Card>

      {/* ---- THE DATE PICKER ----
          The days this car is already booked are greyed out and cannot be
          chosen, so nobody picks dates that were never going to work. */}
      <Sheet
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        title={t('calendar.chooseDates')}
        subtitle={`${vehicle.make} ${vehicle.model} · minimum ${vehicle.minimumDays} ${
          vehicle.minimumDays === 1 ? 'day' : 'days'
        }`}
        footer={
          <>
            <Button
              label={t('booking.clearSignature')}
              variant="outline"
              size="md"
              onClick={() => setTrip({ startDate: undefined, endDate: undefined })}
            />
            <Button label={t('common.done')} size="md" onClick={() => setDatesOpen(false)} />
          </>
        }
      >
        <Calendar
          startDate={trip.startDate}
          endDate={trip.endDate}
          onChange={(range) => setTrip(range)}
          unavailableDates={vehicle.unavailableDates}
          showLegend
        />
      </Sheet>
    </div>
  );
}

export default BookingPanel;
