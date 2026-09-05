'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The page shown once a booking has gone through. It gives
// the reference, says what happens next, and offers the two things somebody
// actually wants from here — see the rental, or go back to browsing.
//
// IT SAYS WHAT HAPPENS NEXT, in order, with the deposit timing spelled out.
// "Booking confirmed!" on its own leaves someone wondering when they will hear
// anything, whether they need to do something, and when the deposit comes off.
// Answering that here is what stops the first support message being sent.

import React from 'react';
import { dateRange, daysBetween, money } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { Button, Card, Icon, Text } from '@/components/ui';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingDoneStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const { trip, hasDates } = useTrip();
  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays;

  const nextSteps: { icon: 'mail-outline' | 'chatbubble-outline' | 'shield-outline' | 'key-outline'; title: string; body: string }[] = [
    {
      icon: 'mail-outline',
      title: 'A confirmation is on its way',
      body: 'It carries the reference above, the collection details, and a copy of the agreement you signed.',
    },
    {
      icon: 'chatbubble-outline',
      title: 'The business will be in touch',
      body: 'They will confirm exactly where and when to collect the car, through SXM Rentals messages.',
    },
    {
      icon: 'shield-outline',
      title: 'The deposit is held just before pickup',
      body: `${money(
        vehicle.depositAmount,
      )} is set aside on your card shortly before you collect the car — not now — and released after you bring it back.`,
    },
    {
      icon: 'key-outline',
      title: 'Bring your licence',
      body: 'The same licence you had verified. The business has to see the physical card when handing over the keys.',
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

        <div className={styles.reference}>SXM-DEMO</div>

        <Text variant="small" tone="ink3">
          This is a demo booking. Nothing has been reserved and no money has moved,
          because there is no payment system connected yet.
        </Text>

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
                  <Text variant="label" as="h3">
                    {step.title}
                  </Text>
                  <Text variant="small" tone="ink2">
                    {step.body}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.successActions}>
          <Button label={t('flow.done.seeRentals')} href="/account/rentals" size="md" />
          <Button label={t('flow.done.browseMore')} href="/search" variant="outline" size="md" />
        </div>
      </div>
    </div>
  );
}
