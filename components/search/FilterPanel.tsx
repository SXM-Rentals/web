'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The set of filters that narrows the list of cars — price,
// class, seats, gearbox, fuel, which side of the island, and whether the car can
// be delivered.
//
// THE SAME FILTERS ARE USED IN TWO PLACES: down the left-hand side on a laptop,
// and inside a slide-in panel on a narrow window. Writing them once here means
// the two can never drift apart, which is what happens when a "mobile filters"
// screen is built separately and then quietly stops matching.
//
// THERE IS NO "APPLY" BUTTON on the sidebar version, because there does not need
// to be: the filters are visible at the same time as the results, so a change
// can take effect immediately and be seen doing it.

import React from 'react';
import { useDraftValue } from '@/hooks/useDraftValue';
import { Checkbox, Chip, ChipRow, Input, SegmentedControl, Text, Toggle } from '@/components/ui';
import { vehicleClassLabels, fuelLabels } from '@/lib/format';
import type { VehicleClass } from '@/types';
import styles from './Search.module.css';
import { useTranslation } from '@/lib/i18n';

// Everything a search can be narrowed by. Held in one object so it can be read
// from and written to the page address in one go.
export type Filters = {
  q: string;
  classes: VehicleClass[];
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  transmission?: 'automatic' | 'manual';
  fuel?: string;
  deliveryOnly: boolean;
  side?: 'dutch' | 'french';
  sort: 'recommended' | 'price_low' | 'price_high' | 'rating';
};

export const EMPTY_FILTERS: Filters = {
  q: '',
  classes: [],
  deliveryOnly: false,
  sort: 'recommended',
};

const CLASS_OPTIONS: VehicleClass[] = [
  'economy',
  'compact',
  'suv',
  'van',
  'fourByFour',
  'luxury',
];

const SEAT_OPTIONS = [2, 4, 5, 7];

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  // Given only the parts that changed. Everything else is left alone.
  onChange: (changes: Partial<Filters>) => void;
}) {
  const { t } = useTranslation();
  // Adds or removes one class from the list, since several can be on at once.
  const toggleClass = (value: VehicleClass) => {
    onChange({
      classes: filters.classes.includes(value)
        ? filters.classes.filter((item) => item !== value)
        : [...filters.classes, value],
    });
  };

  // Turns what was typed into a number, treating an empty box as "no limit"
  // rather than as zero — which would otherwise filter every car away.
  const readPrice = (raw: string): number | undefined => {
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  };

  // ---- THE PRICE BOXES ----
  // Same problem as the search box: every filter lives in the page address, and
  // the address does not change instantly. Wired straight to it, typing "150"
  // put "1" in the box, then replaced it with "5", then with "0". These hold
  // what is being typed and write it to the address once the typing stops.
  const [minDraft, setMinDraft] = useDraftValue(
    filters.minPrice == null ? '' : String(filters.minPrice),
    (next: string) => onChange({ minPrice: readPrice(next) }),
  );

  const [maxDraft, setMaxDraft] = useDraftValue(
    filters.maxPrice == null ? '' : String(filters.maxPrice),
    (next: string) => onChange({ maxPrice: readPrice(next) }),
  );

  return (
    <div>
      {/* ---- WHICH SIDE OF THE ISLAND ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label" raw>
          {t('search.sideOfIsland')}
        </Text>
        <ChipRow>
          <Chip
            label={t('search.side.anywhere')}
            selected={!filters.side}
            onClick={() => onChange({ side: undefined })}
          />
          <Chip
            label={t('search.side.dutch')}
            selected={filters.side === 'dutch'}
            onClick={() => onChange({ side: 'dutch' })}
          />
          <Chip
            label={t('search.side.french')}
            selected={filters.side === 'french'}
            onClick={() => onChange({ side: 'french' })}
          />
        </ChipRow>
      </div>

      {/* ---- PRICE ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label">Price per day</Text>
        <div className={styles.priceRow}>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label={t('search.price.lowest')}
            value={minDraft}
            onChange={(event) => setMinDraft(event.target.value)}
          />
          <span className={styles.priceDash} aria-hidden="true">
            —
          </span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label={t('search.price.highest')}
            value={maxDraft}
            onChange={(event) => setMaxDraft(event.target.value)}
          />
        </div>
        <Text variant="caption" tone="ink3" raw>
          {t('search.price.note')}
        </Text>
      </div>

      {/* ---- CLASS OF CAR ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label">Type of car</Text>
        <ChipRow>
          {CLASS_OPTIONS.map((value) => (
            <Chip
              key={value}
              label={vehicleClassLabels[value]}
              selected={filters.classes.includes(value)}
              onClick={() => toggleClass(value)}
            />
          ))}
        </ChipRow>
      </div>

      {/* ---- SEATS ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label">Seats</Text>
        <ChipRow>
          <Chip
            label="Any"
            selected={filters.seats == null}
            onClick={() => onChange({ seats: undefined })}
          />
          {SEAT_OPTIONS.map((count) => (
            <Chip
              key={count}
              label={`${count}+`}
              selected={filters.seats === count}
              onClick={() => onChange({ seats: count })}
            />
          ))}
        </ChipRow>
      </div>

      {/* ---- GEARBOX ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label">Gearbox</Text>
        <SegmentedControl
          label={t('vehicle.transmission')}
          fullWidth
          value={filters.transmission ?? 'any'}
          onChange={(value) =>
            onChange({
              transmission: value === 'any' ? undefined : (value as 'automatic' | 'manual'),
            })
          }
          options={[
            { value: 'any', label: 'Any' },
            { value: 'automatic', label: 'Automatic' },
            { value: 'manual', label: 'Manual' },
          ]}
        />
      </div>

      {/* ---- FUEL ---- */}
      <div className={styles.filterGroup}>
        <Text variant="label">Fuel</Text>
        <ChipRow>
          <Chip
            label="Any"
            selected={!filters.fuel}
            onClick={() => onChange({ fuel: undefined })}
          />
          {Object.entries(fuelLabels).map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              selected={filters.fuel === value}
              onClick={() => onChange({ fuel: value })}
            />
          ))}
        </ChipRow>
      </div>

      {/* ---- DELIVERY ---- */}
      <div className={styles.filterGroup}>
        <div className={styles.filterHead}>
          <Text variant="label">Delivered to me</Text>
          <Toggle
            label={t('search.delivery.only')}
            value={filters.deliveryOnly}
            onChange={(value) => onChange({ deliveryOnly: value })}
          />
        </div>
        <Text variant="caption" tone="ink3" raw>
          {t('search.delivery.note')}
        </Text>
      </div>
    </div>
  );
}

// Kept separate so the slide-in panel on a narrow window can show a tick box
// version without the sidebar growing one it does not need.
export { Checkbox };
