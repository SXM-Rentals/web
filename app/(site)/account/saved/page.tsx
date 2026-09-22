'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The cars someone has saved by clicking the heart on them.
//
// THE LIST LIVES IN THIS BROWSER ONLY. The backend has no address for saved
// cars yet, so which cars were saved is kept in the browser's own storage (see
// lib/favourites.tsx). It does not follow anyone to another computer and is
// lost if they clear their site data. That is said on the page rather than
// left to be discovered, because a list of saved cars that silently vanishes
// reads as a bug.
//
// THE CARS THEMSELVES ARE LIVE. Only the ids are kept here; each car is looked
// up in the current catalogue, so prices and details are today's. A car taken
// off the platform since it was saved is simply not in the catalogue any more,
// and the page says some are missing rather than showing a count that does not
// match what is on screen.

import React from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useFavourites } from '@/lib/favourites';
import { Button, EmptyState, ErrorState, Icon, Skeleton, Text } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function SavedPage() {
  const { t } = useTranslation();
  const { favourites } = useFavourites();

  const { data: catalogue, loading, error, refresh } = useAsyncData(
    (signal) => apiClient.listVehicles({}, { signal }),
    [],
  );

  // Kept in the order the cars appear in the catalogue rather than the order
  // they were saved, so the list does not reshuffle itself between visits.
  const saved = (catalogue ?? []).filter((vehicle) => favourites.includes(vehicle.id));
  const noLongerListed = catalogue ? favourites.length - saved.length : 0;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('acct.saved.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {saved.length === 0
              ? 'Nothing saved yet.'
              : `${saved.length} ${saved.length === 1 ? 'car' : 'cars'} you have kept an eye on.`}
          </Text>
        </div>

        <Button label={t('acct.saved.findMore')} href="/search" variant="outline" size="sm" />
      </div>

      {loading && favourites.length > 0 ? (
        <div className={styles.savedGrid}>
          {favourites.slice(0, 6).map((id) => (
            <Skeleton key={id} height={300} radius="var(--radius-lg)" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : saved.length === 0 ? (
        <EmptyState
          title={t('acct.saved.emptyTitle')}
          body={noLongerListed > 0 ? t('acct.saved.someGone') : t('acct.saved.emptyBody')}
          icon="heart-outline"
          actionLabel="Browse cars"
          actionHref="/search"
        />
      ) : (
        <>
          <div className={styles.savedGrid}>
            {saved.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} showDeposit />
            ))}
          </div>

          {noLongerListed > 0 ? (
            <div className={styles.note}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('acct.saved.someGone')}
              </Text>
            </div>
          ) : null}

          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('acct.saved.browserNote')}
            </Text>
          </div>
        </>
      )}
    </div>
  );
}
