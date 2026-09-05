'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The cars someone has saved by clicking the heart on them.
//
// THE LIST LIVES IN THIS BROWSER ONLY. It is kept in the browser's own storage,
// so it does not follow anyone to another computer and is lost if they clear
// their site data. That is said on the page rather than left to be discovered,
// because a list of saved cars that silently vanishes reads as a bug. Once there
// is a backend it should move onto the account itself.

import React from 'react';
import { useFavourites } from '@/lib/favourites';
import { mockVehicles } from '@/lib/mock/vehicles';
import { Button, EmptyState, Icon, Text } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function SavedPage() {
  const { t } = useTranslation();
  const { favourites, count } = useFavourites();

  // Kept in the order the cars appear in the catalogue rather than the order
  // they were saved, so the list does not reshuffle itself between visits.
  const saved = mockVehicles.filter((vehicle) => favourites.includes(vehicle.id));

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('acct.saved.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {count === 0
              ? 'Nothing saved yet.'
              : `${count} ${count === 1 ? 'car' : 'cars'} you have kept an eye on.`}
          </Text>
        </div>

        <Button label={t('acct.saved.findMore')} href="/search" variant="outline" size="sm" />
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title={t('acct.saved.emptyTitle')}
          body={t('acct.saved.emptyBody')}
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
