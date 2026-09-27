'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 2 of the booking — what is paid, when, and what the
// security deposit is, in plain language before anything is agreed to.
//
// ---- NOTHING IS CHARGED HERE, AND THE PAGE SAYS SO ----
//
// SXM Rentals cannot take card payments yet: the backend has no payment
// provider connected, records every booking as unpaid, and marks the deposit
// "not taken". This page used to draw a card form, wait 700 milliseconds, and
// move on as though a payment had been taken. It now says what actually
// happens — the rental is settled with the business, and no deposit is held —
// because a customer who believes they have paid, and a business expecting
// SXM Rentals to have collected, is the worst possible way for the two to meet.
//
// THERE ARE NO CARD FIELDS, not even as a stand-in. When payments are
// connected this step will use Stripe Elements, whose fields belong to Stripe,
// so the card number never passes through this site or its server. A
// placeholder that looks like a card form on a page that takes no payment is
// both a lie and an invitation to type a card number into nothing.
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
      {/* ---- WHAT HAPPENS ABOUT MONEY ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.payment.notConnectedTitle')}
        </Text>

        <Text variant="body" tone="ink2" raw>
          {total === undefined
            ? t('flow.payment.notConnectedBody').replace('{amount}', t('flow.payment.theRental'))
            : t('flow.payment.notConnectedBody').replace('{amount}', money(total))}
        </Text>

        <div className={styles.note}>
          <Icon name="card-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('flow.payment.whenConnected')}
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
