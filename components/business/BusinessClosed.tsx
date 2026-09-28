'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: What somebody whose business has been closed sees
// instead of its dashboard, or the form for registering one.
//
// Not the dashboard: the business is gone from SXM Rentals, and a dashboard
// that still let its owner add cars would be offering to list them for a
// business that no longer exists. Not the registration form either: the
// backend refuses a second business on the same account, so the form would
// only fail at the end. It says what happened, and where to write to open a
// business again — the one thing the website cannot do yet.

import React from 'react';
import { CONTACT_EMAIL } from '@/lib/social';
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
      <Text variant="small" tone="ink3" raw>
        {t('pp.closed.reopen').replace('{email}', CONTACT_EMAIL)}
      </Text>
      <div className={gateStyles.actions}>
        <Button label={t('pp.closed.toAccount')} href="/account" size="md" />
      </div>
    </Card>
  );
}

export default BusinessClosed;
