'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: What somebody whose business has been closed sees
// instead of its dashboard.
//
// Not the dashboard: the business is gone from SXM Rentals, and the backend
// refuses every change to it (`business_closed`). It says what happened, and
// offers the way forward — registering a new business, which the backend
// allows, or going back to their own account.

import React from 'react';
import { Button, Card, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import gateStyles from '@/components/layout/RequireSignIn.module.css';

export function BusinessClosed() {
  const { t } = useTranslation();
  return (
    <Card padded className={gateStyles.gate}>
      <span className={gateStyles.icon}>
        <Icon name="storefront-outline" size={26} />
      </span>
      <Text variant="h2" as="h1" raw>
        {t('pp.closed.title')}
      </Text>
      <Text variant="body" tone="ink2" raw>
        {t('pp.closed.body')}
      </Text>
      <div className={gateStyles.actions}>
        <Button label={t('pp.closed.toAccount')} href="/account" size="md" />
        <Button label={t('pp.closed.registerAgain')} href="/provider/apply" variant="outline" size="md" />
      </div>
    </Card>
  );
}

export default BusinessClosed;
