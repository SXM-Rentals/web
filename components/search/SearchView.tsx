'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The search page — the filters, the grid of cars, the
// sort order, and the trip dates across the top. This is the heart of the
// customer side of the site.
//
// EVERY FILTER LIVES IN THE PAGE ADDRESS. Change the price range and the address
// changes with it. That is deliberate and it buys three things at once:
//
//   - a search can be copied, shared, and bookmarked, and shows the same cars
//   - the browser's back button steps back through filter changes, which is what
//     people expect it to do
//   - refreshing the page does not silently throw the search away
//
// HOW A FAILURE IS HANDLED, which is the part most easily got wrong: loading and
// "nothing came back" are kept as two separate questions. Writing them as one
// check — "if still loading OR no cars, show the loading blocks" — looks correct
// and leaves the page on grey blocks for ever when a request fails, because no
// cars ever arrive. So: blocks while loading, then either the cars, or a real
// message with a button to try again.

import React, { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDraftValue } from '@/hooks/useDraftValue';
import { useTrip } from '@/lib/trip';
import { vehicleClassLabels, fuelLabels, sideLabels } from '@/lib/format';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Input,
  Sheet,
  Skeleton,
  Text,
} from '@/components/ui';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { VehicleTypeTabs } from '@/components/vehicle/VehicleTypes';
import { FilterPanel, EMPTY_FILTERS, type Filters } from './FilterPanel';
import { SortControl, type SortOption } from './SortControl';
import { TripBar } from './TripBar';
import type { VehicleClass } from '@/types';
import styles from './Search.module.css';
import { useTranslation } from '@/lib/i18n';

// ---- READING THE FILTERS OUT OF THE ADDRESS ----
// Anything missing or nonsensical falls back to its default rather than throwing,
// because these values come from whatever someone happened to paste in.
function filtersFromParams(params: URLSearchParams): Filters {
  const { t } = useTranslation();
  const number = (key: string): number | undefined => {
    const value = Number.parseInt(params.get(key) ?? '', 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  };

  const side = params.get('side');
  const transmission = params.get('gearbox');
  const sort = params.get('sort');

  return {
    q: params.get('q') ?? '',
    classes: (params.get('class')?.split(',').filter(Boolean) ?? []) as VehicleClass[],
    minPrice: number('min'),
    maxPrice: number('max'),
    seats: number('seats'),
    transmission:
      transmission === 'automatic' || transmission === 'manual' ? transmission : undefined,
    fuel: params.get('fuel') ?? undefined,
    deliveryOnly: params.get('delivery') === '1',
    side: side === 'dutch' || side === 'french' ? side : undefined,
    sort:
      sort === 'price_low' || sort === 'price_high' || sort === 'rating'
        ? sort
        : 'recommended',
  };
}

// ---- WRITING THE FILTERS BACK INTO THE ADDRESS ----
// Anything at its default is left out entirely, so an unfiltered search stays a
// clean "/search" rather than a long trail of empty settings.
function paramsFromFilters(filters: Filters, existing: URLSearchParams): string {
  const { t } = useTranslation();
  const params = new URLSearchParams();

  // The trip dates are set elsewhere but must survive a filter change.
  const start = existing.get('start');
  const end = existing.get('end');
  if (start) params.set('start', start);
  if (end) params.set('end', end);

  if (filters.q) params.set('q', filters.q);
  if (filters.classes.length) params.set('class', filters.classes.join(','));
  if (filters.minPrice) params.set('min', String(filters.minPrice));
  if (filters.maxPrice) params.set('max', String(filters.maxPrice));
  if (filters.seats) params.set('seats', String(filters.seats));
  if (filters.transmission) params.set('gearbox', filters.transmission);
  if (filters.fuel) params.set('fuel', filters.fuel);
  if (filters.deliveryOnly) params.set('delivery', '1');
  if (filters.side) params.set('side', filters.side);
  if (filters.sort !== 'recommended') params.set('sort', filters.sort);

  return params.toString();
}

export function SearchView() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTrip } = useTrip();

  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // The address is the single source of truth. Nothing is copied into state
  // alongside it, so the two can never disagree.
  const filters = useMemo(
    () => filtersFromParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const applyChanges = useCallback(
    (changes: Partial<Filters>) => {
      const next = { ...filters, ...changes };
      const query = paramsFromFilters(next, new URLSearchParams(searchParams.toString()));
      // "replace" rather than "push", so typing in the price box does not put
      // twenty entries into the back button.
      router.replace(query ? `/search?${query}` : '/search', { scroll: false });
    },
    [filters, router, searchParams],
  );

  // Keeps the trip dates in the address alongside the filters.
  const applyDates = useCallback(
    (range: { startDate?: string; endDate?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (range.startDate) params.set('start', range.startDate);
      else params.delete('start');
      if (range.endDate) params.set('end', range.endDate);
      else params.delete('end');

      const query = params.toString();
      router.replace(query ? `/search?${query}` : '/search', { scroll: false });
    },
    [router, searchParams],
  );

  // Puts the dates from the address into the shared trip, so arriving on a
  // shared link shows those dates rather than an empty bar.
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  React.useEffect(() => {
    if (startParam || endParam) {
      setTrip({ startDate: startParam ?? undefined, endDate: endParam ?? undefined });
    }
    // Only when the address changes — not on every render of the trip itself,
    // which would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam, endParam]);

  // ---- FETCH THE CARS ----
  // Re-runs whenever any filter changes, which is what makes the results update
  // live rather than needing an "Apply" button.
  const { data: vehicles, loading, error, refresh } = useAsyncData(
    () =>
      apiClient.listVehicles({
        search: filters.q || undefined,
        classes: filters.classes.length ? filters.classes : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        seats: filters.seats,
        transmission: filters.transmission,
        fuel: filters.fuel,
        deliveryOnly: filters.deliveryOnly || undefined,
        side: filters.side,
        sort: filters.sort,
      }),
    [
      filters.q,
      filters.classes.join(','),
      filters.minPrice,
      filters.maxPrice,
      filters.seats,
      filters.transmission,
      filters.fuel,
      filters.deliveryOnly,
      filters.side,
      filters.sort,
    ],
  );

  // ---- WHAT IS CURRENTLY NARROWING THE LIST ----
  // Shown as removable chips above the results. Without this, an empty list is a
  // mystery — the filter causing it is off in the sidebar and easily missed.
  const activeChips = useMemo(() => {
    const chips: { label: string; clear: Partial<Filters> }[] = [];

    if (filters.q) chips.push({ label: `“${filters.q}”`, clear: { q: '' } });
    if (filters.side) chips.push({ label: sideLabels[filters.side], clear: { side: undefined } });
    filters.classes.forEach((value) =>
      chips.push({
        label: vehicleClassLabels[value],
        clear: { classes: filters.classes.filter((item) => item !== value) },
      }),
    );
    if (filters.minPrice)
      chips.push({ label: `From $${filters.minPrice}`, clear: { minPrice: undefined } });
    if (filters.maxPrice)
      chips.push({ label: `Up to $${filters.maxPrice}`, clear: { maxPrice: undefined } });
    if (filters.seats)
      chips.push({ label: `${filters.seats}+ seats`, clear: { seats: undefined } });
    if (filters.transmission)
      chips.push({
        label: filters.transmission === 'automatic' ? 'Automatic' : 'Manual',
        clear: { transmission: undefined },
      });
    if (filters.fuel)
      chips.push({ label: fuelLabels[filters.fuel] ?? filters.fuel, clear: { fuel: undefined } });
    if (filters.deliveryOnly)
      chips.push({ label: 'Delivered to me', clear: { deliveryOnly: false } });

    return chips;
  }, [filters]);

  const clearAll = () => router.replace('/search', { scroll: false });

  // ---- THE SEARCH BOX ----
  // Typed into on every keystroke, written to the page address once the typing
  // pauses. Wired straight to the address it was unusable: each letter asked for
  // a new address, the box was still showing the old value when the next letter
  // arrived, and typing "Marigot" left a box containing "t".
  const [searchDraft, setSearchDraft] = useDraftValue(
    filters.q,
    (next: string) => applyChanges({ q: next }),
  );

  // ---- WHAT TO SHOW IN THE RESULTS AREA ----
  // Deliberately three separate outcomes, never two.
  const renderResults = () => {
    if (loading) {
      return (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <Skeleton height={150} radius="var(--radius-lg)" />
              <Skeleton width="70%" />
              <Skeleton width="45%" height={13} />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }

    if (!vehicles || vehicles.length === 0) {
      return (
        <EmptyState
          title={t('search.empty.title')}
          body={t('search.empty.body')}
          icon="car-outline"
          actionLabel={activeChips.length > 0 ? 'Clear all filters' : undefined}
          onAction={activeChips.length > 0 ? clearAll : undefined}
        />
      );
    }

    return (
      <div className={styles.grid}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} showDeposit />
        ))}
      </div>
    );
  };

  return (
    <>
      <TripBar onDatesChange={applyDates} />

      <VehicleTypeTabs value="car" onChange={() => {}} />

      <div className={styles.layout} style={{ marginTop: 'var(--space-xl)' }}>
        {/* ---- THE FILTERS, DOWN THE LEFT ON A LAPTOP ---- */}
        <aside className={styles.sidebar} aria-label={t('common.filters')}>
          <Input
            iconLeft="search"
            placeholder={t('search.placeholder')}
            aria-label={t('search.boxLabel')}
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          <FilterPanel filters={filters} onChange={applyChanges} />
        </aside>

        {/* ---- THE RESULTS ---- */}
        <div className={styles.results}>
          <div className={styles.resultsHead}>
            <Text variant="label" tone="ink2" as="p">
              {loading
                ? 'Looking for cars…'
                : error
                  ? 'Could not load cars'
                  : `${vehicles?.length ?? 0} ${vehicles?.length === 1 ? 'car' : 'cars'} available`}
            </Text>

            <div className={styles.resultsActions}>
              <span className={styles.filterButton}>
                <Button
                  label={t('common.filters')}
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(true)}
                  iconLeft={<Icon name="options-outline" size={16} />}
                />
              </span>

              <SortControl
                value={filters.sort}
                onChange={(value: SortOption) => applyChanges({ sort: value })}
              />
            </div>
          </div>

          {activeChips.length > 0 ? (
            <div className={styles.activeRow}>
              {activeChips.map((chip) => (
                <span key={chip.label} className={styles.activeChip}>
                  {chip.label}
                  <button
                    type="button"
                    className={styles.activeChipRemove}
                    onClick={() => applyChanges(chip.clear)}
                    aria-label={`Remove the filter ${chip.label}`}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </span>
              ))}

              <Button label={t('common.clearAll')} variant="ghost" size="sm" onClick={clearAll} />
            </div>
          ) : null}

          {renderResults()}
        </div>
      </div>

      {/* ---- THE SAME FILTERS, AS A PANEL ON A NARROW WINDOW ---- */}
      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t('common.filters')}
        placement="side"
        footer={
          <>
            <Button
              label={t('common.clearAll')}
              variant="outline"
              size="md"
              onClick={() => {
                clearAll();
                setFiltersOpen(false);
              }}
            />
            <Button
              label={loading ? 'Loading…' : `Show ${vehicles?.length ?? 0}`}
              size="md"
              onClick={() => setFiltersOpen(false)}
            />
          </>
        }
      >
        <Input
          iconLeft="search"
          placeholder={t('search.placeholder')}
          aria-label={t('search.boxLabel')}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
        />
        <FilterPanel filters={filters} onChange={applyChanges} />
      </Sheet>
    </>
  );
}

export { EMPTY_FILTERS };
export default SearchView;
