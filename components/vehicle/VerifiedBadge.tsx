'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The blue "SXM Verified" tick shown next to a rental
// business, plus the panel that opens when someone clicks it.
//
// WHY THE PANEL MATTERS MORE THAN THE TICK: a badge like this is very easily
// read as "this company is guaranteed safe", which SXM Rentals is not promising
// and could not deliver. The panel spells out exactly what has been checked AND
// what has not, in plain language. Being upfront about the second list is the
// entire point — a trust mark that overstates itself is worse than none, because
// people rely on it.

import React, { useState } from 'react';
import { Button, Card, Divider, Icon, Sheet, Text } from '@/components/ui';
import styles from './VerifiedBadge.module.css';
import { useTranslation } from '@/lib/i18n';

// What the badge does confirm.
const CHECKED = [
  'The business is registered and trading on the island',
  "The owner's identity has been confirmed",
  'Each listed vehicle has valid registration and insurance documents on file',
  'The business has agreed to the SXM Rentals provider terms',
];

// What it deliberately does not confirm.
const NOT_CHECKED = [
  'The mechanical condition of any individual vehicle',
  'That the accident history shown is complete — that is supplied by the business itself',
  'How the business will behave during your rental',
  'Anything about a booking made outside SXM Rentals',
];

export function VerifiedBadge({
  // "inline" is the small tick next to a name. "row" is a full clickable row
  // with the words beside it.
  variant = 'inline',
  size = 16,
}: {
  variant?: 'inline' | 'row';
  size?: number;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.badge}
        onClick={() => setOpen(true)}
        aria-label={t('vehicle.verified.badgeLabel')}
        title={t('vehicle.verifiedTitle')}
      >
        <Icon name="checkmark-circle" size={size} color="var(--brand)" />

        {variant === 'row' ? (
          <>
            <Text variant="label" tone="brand" as="span">
              SXM Verified
            </Text>
            <Icon name="information-circle-outline" size={15} />
          </>
        ) : null}
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t('vehicle.verifiedTitle')}
        footer={<Button label={t('vehicle.deposit.gotIt')} size="md" onClick={() => setOpen(false)} />}
      >
        <div className={styles.lede}>
          <Icon name="checkmark-circle" size={28} color="var(--brand)" />
          <Text variant="body" tone="ink2" raw>
            {t('vehicle.verified.aboutBusiness')}
          </Text>
        </div>

        <Text variant="h3" as="h3" className={styles.listHead} raw>
          {t('vehicle.verified.whatWeCheck')}
        </Text>
        <ul className={styles.list}>
          {CHECKED.map((item) => (
            <li key={item} className={styles.listItem}>
              <Icon name="checkmark" size={18} color="var(--success)" />
              <Text variant="body" tone="ink2" as="span">
                {item}
              </Text>
            </li>
          ))}
        </ul>

        <Divider className={styles.divider} />

        <Text variant="h3" as="h3" className={styles.listHead} raw>
          {t('vehicle.verified.whatItDoesNot')}
        </Text>
        <ul className={styles.list}>
          {NOT_CHECKED.map((item) => (
            <li key={item} className={styles.listItem}>
              <Icon name="close" size={18} color="var(--ink3)" />
              <Text variant="body" tone="ink2" as="span">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}

export default VerifiedBadge;
