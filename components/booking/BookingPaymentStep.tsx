'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 2 of the booking — what is paid, when, and what the
// security deposit is, in plain language before anything is agreed to.
//
// ---- NOTHING IS CHARGED HERE, AND THE PAGE SAYS SO ----
//
// The card is taken AFTER the booking is confirmed, not on this step: the
// backend can only start a payment for a booking that exists, and the booking
// is made on the confirm step. So this step says how paying works — by card,
// through Stripe, on the page straight after confirming, or later from the
// rental's own page (components/payments/PayForBooking.tsx) — and draws no
// card fields of its own.
//
// THE DEPOSIT IS STILL EXPLAINED. It is the number that surprises people, and
// what it is does not change: it is not a charge, and it is not part of the
// rental price.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { money } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useQuote } from '@/hooks/useQuote';
import { Button, Card, Checkbox, Divider, Icon, Text } from '@/components/ui';
import { BookingShell } from './BookingShell';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingPaymentStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip } = useTrip();
  const quote = useQuote(vehicle.id, trip);
  const [understood, setUnderstood] = useState(false);

  // The deposit the backend quoted for these dates, or the car's own figure
  // before there is a quote to go on.
  const deposit = quote.quote?.depositAmount ?? vehicle.depositAmount;
  const total = quote.quote?.totalDueToday;

  return (
    <BookingShell
      vehicle={vehicle}
      step={2}
      title={t('flow.step.payment')}
      subtitle={t('flow.payment.subtitle')}
      quote={quote}
      actions={
        <>
          <Button
            label={t('common.back')}
            href={`/booking/${vehicle.id}`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('common.continue')}
            size="md"
            disabled={!understood}
            onClick={() => router.push(`/booking/${vehicle.id}/agreement`)}
          />
        </>
      }
    >
      {/* ---- HOW PAYING WORKS ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.payment.howTitle')}
        </Text>

        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="card-outline" size={16} color="var(--ink2)" />
          <Text variant="body" tone="ink2" raw>
            {t('flow.payment.howBody').replace(
              '{amount}',
              total === undefined ? t('flow.payment.theRental') : money(total),
            )}
          </Text>
        </div>
      </Card>

      {/* ---- THE DEPOSIT, EXPLAINED BEFORE IT IS AGREED TO ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.payment.depositTitle')}
        </Text>

        <Text variant="body" tone="ink2" raw>
          {t('flow.payment.depositBody').replace('{amount}', money(deposit))}
        </Text>

        <Divider style={{ marginBlock: 'var(--space-lg)' }} />

        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.payment.depositReturned')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="alert-circle-outline" size={16} color="var(--warning)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.payment.depositClaims')}
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Checkbox
            checked={understood}
            onChange={setUnderstood}
            label={t('flow.payment.depositUnderstood').replace('{amount}', money(deposit))}
          />
        </div>
      </Card>
    </BookingShell>
  );
}
