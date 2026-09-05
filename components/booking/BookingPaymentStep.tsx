'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 2 of the booking — paying for the rental, and
// explaining the security deposit hold in plain language before it happens.
//
// THERE ARE DELIBERATELY NO CARD FIELDS ON THIS PAGE. Where the card details
// will go, there is a clearly-labelled placeholder instead. When this is wired
// up for real it will use Stripe Elements, which draws its own fields inside a
// frame belonging to Stripe — so the card number goes straight to them and never
// touches our page or our server. Building our own card inputs now, even as a
// stand-in that "will be replaced later", is exactly how a site ends up handling
// card numbers it was never supposed to see. So they are not here at all.
//
// THE DEPOSIT IS EXPLAINED BEFORE IT IS TAKEN. Someone who sees an unexpected
// hold on their card assumes they have been charged twice, and rings their bank
// rather than us. One paragraph here prevents that.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { money } from '@/lib/format';
import { Button, Card, Checkbox, Divider, Icon, ListRow, Text } from '@/components/ui';
import { BookingShell } from './BookingShell';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingPaymentStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [understood, setUnderstood] = useState(false);
  const [working, setWorking] = useState(false);

  const goNext = () => {
    // Stands in for the moment the payment is actually taken. There is no
    // backend, so this simply waits a beat and moves on — the wait is there so
    // the button's loading state can be seen working.
    setWorking(true);
    window.setTimeout(() => {
      setWorking(false);
      router.push(`/booking/${vehicle.id}/agreement`);
    }, 700);
  };

  return (
    <BookingShell
      vehicle={vehicle}
      step={2}
      title={t('flow.step.payment')}
      subtitle={t('flow.payment.subtitle')}
      actions={
        <>
          <Button
            label={t('common.back')}
            href={`/booking/${vehicle.id}`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('flow.payment.payAndContinue')}
            size="md"
            loading={working}
            disabled={!understood}
            onClick={goNext}
          />
        </>
      }
    >
      {/* ---- WHERE STRIPE WILL GO ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.payment.cardDetails')}
        </Text>

        <div className={styles.stripePanel}>
          <div className={styles.fakeField} aria-hidden="true">
            {t('flow.payment.cardNumber')}
          </div>
          <div className={styles.fakeFieldRow} aria-hidden="true">
            <div className={styles.fakeField}>MM / YY</div>
            <div className={styles.fakeField}>CVC</div>
          </div>

          <div className={styles.note}>
            <Icon name="lock-closed-outline" size={15} color="var(--ink2)" />
            <Text variant="small" tone="ink2" raw>
              {t('flow.payment.placeholderNote')}
            </Text>
          </div>
        </div>
      </Card>

      {/* ---- SAVED CARDS ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.payment.savedMethods')}
        </Text>

        <div className={styles.savedCards}>
          <ListRow
            title={t('flow.payment.noSavedTitle')}
            subtitle={t('flow.payment.noSavedSubtitle')}
            icon="card-outline"
            hideChevron
          />
        </div>
      </Card>

      {/* ---- THE DEPOSIT, EXPLAINED BEFORE IT HAPPENS ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }}>
          About the security deposit
        </Text>

        <Text variant="body" tone="ink2">
          {`Shortly before you collect the car, your bank will be asked to set aside ${money(
            vehicle.depositAmount,
          )}. This is a hold, not a payment — the money stays in your account, but is
          reserved so it cannot be spent while you have the car.`}
        </Text>

        <Divider style={{ marginBlock: 'var(--space-lg)' }} />

        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
          <Text variant="small" tone="ink2">
            It is released when the car comes back and has been checked. Banks usually free
            the money within a few working days.
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="alert-circle-outline" size={16} color="var(--warning)" />
          <Text variant="small" tone="ink2">
            Money is only taken from it for damage, a late return, missing fuel or a
            traffic fine — and the business has to tell you why. You can dispute it.
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Checkbox
            checked={understood}
            onChange={setUnderstood}
            label={`I understand that ${money(
              vehicle.depositAmount,
            )} will be held on my card and returned after the rental, and that it is not part of the amount charged today.`}
          />
        </div>
      </Card>
    </BookingShell>
  );
}
