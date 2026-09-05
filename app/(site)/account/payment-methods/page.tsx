'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The cards saved for future bookings.
//
// THERE IS NO "ADD A CARD" FORM HERE, and there will not be one. Card details go
// to Stripe through fields that belong to Stripe, never through fields belonging
// to SXM Rentals — that way the number never passes through this site or our
// servers, which is both far safer and enormously less work to be responsible
// for. All this page will ever hold is the last four digits and an expiry date,
// which is what Stripe hands back and all anyone needs to recognise their own
// card.

import React from 'react';
import {
  Button,
  Card,
  ComingSoonBadge,
  EmptyState,
  Icon,
  Text,
} from '@/components/ui';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function PaymentMethodsPage() {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('acct.pay.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('acct.pay.subtitle')}
          </Text>
        </div>
        <ComingSoonBadge label={t('acct.pay.notConnected')} />
      </div>

      <EmptyState
        title={t('acct.pay.noCardsTitle')}
        body={t('acct.pay.noCardsBody')}
        icon="card-outline"
      />

      {/* ---- WHY THERE IS NO FORM ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.pay.howTitle')}
        </Text>

        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="lock-closed-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('acct.pay.stripeNote')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="shield-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2">
            All we ever store is the last four digits and the expiry date — enough for you
            to recognise your own card, and useless to anybody else.
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2">
            The security deposit is a hold placed on the same card, not a second payment.
            It is released after the car comes back.
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Button
            label={t('acct.pay.readPolicy')}
            href="/legal/payment-policy"
            variant="outline"
            size="sm"
          />
        </div>
      </Card>
    </div>
  );
}
