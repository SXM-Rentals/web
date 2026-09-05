'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The four vehicle types — cars, ATVs, boats and bikes —
// shown as a row of tabs on the search page and as larger cards on the homepage.
//
// ONLY CARS CAN BE BOOKED AT THE MOMENT. The rule for the other three is that
// they must be visibly unavailable AND must explain themselves when clicked.
// Both halves matter:
//
//   - drawn normally, someone clicks and nothing happens, and concludes the site
//     is broken rather than that boats are not ready yet
//   - drawn greyed but silent when clicked, they conclude the same thing, just
//     a little later
//
// So they are greyed, labelled "Coming Soon", and clicking one raises a short
// message saying so. There is no waitlist and nothing to sign up for — that is
// deliberate, not an omission.

import React from 'react';
import { useRouter } from 'next/navigation';
import { cx } from '@/lib/utils';
import { useToast } from '@/components/ui';
import { Icon, Text, ComingSoonBadge } from '@/components/ui';
import type { IconName } from '@/components/ui';
import type { VehicleType } from '@/types';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import styles from './VehicleTypes.module.css';

// The label and the blurb are keys rather than words. They are declared above
// the component, where t() cannot be called, so the lookup happens at the point
// each one is drawn instead.
type TypeInfo = {
  type: VehicleType;
  label: TranslationKey;
  plural: TranslationKey;
  icon: IconName;
  live: boolean;
  blurb: TranslationKey;
};

export const VEHICLE_TYPES: TypeInfo[] = [
  {
    type: 'car',
    label: 'search.type.cars',
    plural: 'search.type.cars',
    icon: 'car-outline',
    live: true,
    blurb: 'search.type.cars.blurb',
  },
  {
    type: 'atv',
    label: 'search.type.atvs',
    plural: 'search.type.atvs',
    icon: 'construct-outline',
    live: false,
    blurb: 'search.type.atvs.blurb',
  },
  {
    type: 'boat',
    label: 'search.type.boats',
    plural: 'search.type.boats',
    icon: 'boat-outline',
    live: false,
    blurb: 'search.type.boats.blurb',
  },
  {
    type: 'bike',
    label: 'search.type.bikes',
    plural: 'search.type.bikes',
    icon: 'bicycle-outline',
    live: false,
    blurb: 'search.type.bikes.blurb',
  },
];

// ---- THE ROW OF TABS, used on the search page ----
export function VehicleTypeTabs({
  value,
  onChange,
  className,
}: {
  value: VehicleType;
  onChange: (type: VehicleType) => void;
  className?: string;
}) {
  const { showComingSoon } = useToast();
  const { t } = useTranslation();

  return (
    <div className={cx(styles.tabs, className)} role="tablist" aria-label={t('search.type.label')}>
      {VEHICLE_TYPES.map((info) => {
        const isActive = info.type === value;

        return (
          <button
            key={info.type}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cx(
              styles.tab,
              isActive && styles.tabActive,
              !info.live && styles.tabLocked,
            )}
            onClick={() => {
              if (!info.live) {
                showComingSoon(t(info.plural));
                return;
              }
              onChange(info.type);
            }}
          >
            <Icon name={info.icon} size={16} />
            {t(info.label)}
            {!info.live ? <Icon name="lock-closed-outline" size={13} /> : null}
          </button>
        );
      })}
    </div>
  );
}

// ---- THE LARGER CARDS, used on the homepage ----
export function VehicleTypeCards({ className }: { className?: string }) {
  const { showComingSoon } = useToast();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={className}>
      {VEHICLE_TYPES.map((info) => (
        <button
          key={info.type}
          type="button"
          className={cx(styles.card, !info.live && styles.cardLocked)}
          onClick={() => {
            if (!info.live) {
              showComingSoon(t(info.plural));
              return;
            }
            // Cars are live, so this is a genuine move to the search page.
            router.push('/search');
          }}
        >
          <span className={styles.cardIcon}>
            <Icon name={info.icon} size={21} />
          </span>

          <span className={styles.cardTop}>
            <Text variant="label" as="span">
              {t(info.label)}
            </Text>
            {info.live ? null : <ComingSoonBadge />}
          </span>

          <Text variant="small" tone="ink2" as="span">
            {t(info.blurb)}
          </Text>
        </button>
      ))}
    </div>
  );
}
