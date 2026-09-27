'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The page shown once a booking has gone through. It gives
// the reference, says what happens next, and offers the two things somebody
// actually wants from here — see the rental, or go back to browsing.
//
// IT SAYS WHAT HAPPENS NEXT, in order. "Booking confirmed!" on its own leaves
// somebody wondering when they will hear anything, whether they need to do
// something, and what happens about the money. Answering that here is what
// stops the first support message being sent.
//
// ---- THE REFERENCE IS THE REAL ONE ----
//
// It used to say SXM-DEMO, because nothing was booked. The confirm step now
// carries the reference the backend gave back in the address, so this page
// shows the booking that exists — and still shows it after a reload. Arriving
// here without one means somebody opened the page directly; it then says so
// rather than inventing a booking.

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { dateRange, daysBetween } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { Button, Card, Icon, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingDoneStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const { trip, hasDates } = useTrip();
  const params = useSearchParams();
  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays;

  const reference = params.get('ref');
  const bookingId = params.get('booking');

  const nextSteps: { icon: IconName; title: string; body: string }[] = [
    {
      icon: 'mail-outline',
      title: t('flow.done.emailTitle'),
      body: t('flow.done.emailBody'),
    },
    {
      icon: 'chatbubble-outline',
      title: t('flow.done.contactTitle'),
      body: t('flow.done.contactBody'),
    },
    {
      icon: 'card-outline',
      title: t('flow.done.depositTitle'),
      body: t('flow.done.depositBody'),
    },
    {
      icon: 'key-outline',
      title: t('flow.done.licenceTitle'),
      body: t('flow.done.licenceBody'),
    },
  ];

  return (
    <div className="container">
      <div className={styles.success}>
        <span className={styles.successIcon}>
          <Icon name="checkmark-circle-outline" size={38} />
        </span>

        <Text variant="h1" as="h1" raw>
          {t('flow.done.title')}
        </Text>

        <Text variant="bodyLg" tone="ink2">
          {`${vehicle.make} ${vehicle.model}, ${days} ${days === 1 ? 'day' : 'days'}${
            hasDates ? `, ${dateRange(trip.startDate!, trip.endDate!)}` : ''
          }.`}
        </Text>

        {reference ? (
          <div className={styles.reference}>{reference}</div>
        ) : (
          // Somebody opened this page without booking anything.
          <Text variant="small" tone="ink3" raw>
            {t('flow.done.noReference')}
          </Text>
        )}

        {/* ---- WHAT HAPPENS NEXT ---- */}
        <Card padded style={{ width: '100%' }}>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('flow.done.whatNext')}
          </Text>

          <div className={styles.nextSteps}>
            {nextSteps.map((step) => (
              <div key={step.title} className={styles.nextStep}>
                <Icon name={step.icon} size={19} color="var(--ink2)" />
                <div>
                  <Text variant="label" as="h3" raw>
                    {step.title}
                  </Text>
                  <Text variant="small" tone="ink2" raw>
                    {step.body}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.successActions}>
          <Button
            label={t('flow.done.seeRentals')}
            href={bookingId ? `/account/rentals/${bookingId}` : '/account/rentals'}
            size="md"
          />
          {bookingId ? (
            <Button
              label={t('acct.rental.messageBusiness')}
              href={`/account/rentals/${bookingId}/message`}
              variant="outline"
              size="md"
            />
          ) : null}
          <Button label={t('flow.done.browseMore')} href="/search" variant="ghost" size="md" />
        </div>
      </div>
    </div>
  );
}
