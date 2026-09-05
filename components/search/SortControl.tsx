'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The control that decides what order the search results
// come back in — recommended, cheapest first, dearest first, or best rated.
//
// IT IS A PLAIN DROP-DOWN ON PURPOSE. A custom menu built out of boxes would
// look a little smarter and would bring a long list of problems with it: the
// keyboard, typing a letter to jump to an option, and the native picker that
// phones and tablets put up. The browser's own control does all of that
// correctly, for free, and people already know how to use it.

import React, { useId } from 'react';
import { Icon, Text } from '@/components/ui';
import styles from './SortControl.module.css';
import { useTranslation } from '@/lib/i18n';

export type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
  { value: 'rating', label: 'Best rated' },
];

export function SortControl({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const { t } = useTranslation();
  const id = useId();

  return (
    <div className={styles.wrap}>
      {/* The label is joined to the drop-down, so clicking the word opens it and
          a screen reader announces what the list is for. */}
      <label htmlFor={id} className={styles.label}>
        <Text variant="small" tone="ink2" as="span" raw>
          {t('search.sort.by')}
        </Text>
      </label>

      <div className={styles.selectWrap}>
        <select
          id={id}
          className={styles.select}
          value={value}
          onChange={(event) => onChange(event.target.value as SortOption)}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* The browser draws its own arrow differently on every platform, so
            ours is hidden and this one drawn on top for a consistent look. */}
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="chevron-down" size={16} />
        </span>
      </div>
    </div>
  );
}

export default SortControl;
