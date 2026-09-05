'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The cards a car appears on — the tall one used in search
// results, and the short wide one used in the rows on the homepage. Both show
// the car's name, its rating, where it is collected from, and the daily price.
//
// THE WHOLE CARD IS ONE LINK, not a picture and a name and a button that each
// go to the same place. That means the browser shows the address on hover,
// middle-click opens it in a new tab, and someone using a keyboard tabs past one
// item rather than three.
//
// THE HEART IS THE EXCEPTION. It sits on top of the card and saves the car
// instead of opening it, so it has to stop the click from reaching the link
// underneath — otherwise saving a car would also navigate away from the list you
// were saving it from.

import React from 'react';
import Link from 'next/link';
import { cx } from '@/lib/utils';
import { perDay, money, vehicleClassLabels } from '@/lib/format';
import { useFavourites } from '@/lib/favourites';
import { Card, Icon, IconButton, PhotoPlaceholder, StarRow, Text } from '@/components/ui';
import type { Vehicle } from '@/types';
import styles from './VehicleCard.module.css';

// ---- THE HEART ----
export function HeartButton({ vehicleId, size = 34 }: { vehicleId: string; size?: number }) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(vehicleId);

  return (
    <span
      // Catches the click before it reaches the card link wrapped around this.
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavourite(vehicleId);
      }}
    >
      <IconButton
        icon={saved ? 'heart' : 'heart-outline'}
        label={saved ? 'Remove from your saved cars' : 'Save this car'}
        variant="onPhoto"
        size="sm"
        active={saved}
        iconSize={Math.round(size * 0.52)}
      />
    </span>
  );
}

// ---- THE TALL CARD ----
export function VehicleCard({
  vehicle,
  // Shows the security deposit underneath the price. Used on search results,
  // where comparing the true cost of two cars means seeing both numbers.
  showDeposit = false,
  className,
}: {
  vehicle: Vehicle;
  showDeposit?: boolean;
  className?: string;
}) {
  return (
    <Card padded={false} flush className={cx(styles.card, className)}>
      <div className={styles.photoWrap}>
        <Link href={`/vehicles/${vehicle.id}`} tabIndex={-1} aria-hidden="true">
          <PhotoPlaceholder shape="wide" className={styles.photo} iconSize={54} />
        </Link>

        <span className={styles.heart}>
          <HeartButton vehicleId={vehicle.id} />
        </span>
      </div>

      <div className={styles.body}>
        {/* The car's name carries the link. Everything else in the card is
            description, so a screen reader reads one clear link followed by the
            details rather than four competing links to the same page. */}
        <Text variant="label" as="h3" className={styles.name} raw>
          <Link href={`/vehicles/${vehicle.id}`}>
            {`${vehicle.make} ${vehicle.model}`}
          </Link>
        </Text>

        <StarRow rating={vehicle.rating} reviewCount={vehicle.reviewCount} size={13} />

        <span className={styles.metaRow}>
          <Icon name="location-outline" size={14} />
          <Text variant="small" tone="ink2" as="span" className={styles.metaText}>
            {vehicle.pickupTown}
          </Text>
        </span>

        <span className={styles.metaRow}>
          <Icon name="people-outline" size={14} />
          <Text variant="small" tone="ink2" as="span" className={styles.metaText}>
            {`${vehicle.seats} seats`}
          </Text>
          <Text variant="small" tone="ink3" as="span" className={styles.metaText}>
            {vehicleClassLabels[vehicle.vehicleClass]}
          </Text>
        </span>

        <div className={styles.priceRow}>
          <Text variant="label" as="span" raw>
            {perDay(vehicle.dailyRate)}
          </Text>

          {/* The deposit is named as "held", never added to the price. It is
              given back when the car comes back, and calling it anything else
              would make every car look more expensive than it is. */}
          {showDeposit && vehicle.depositAmount > 0 ? (
            <Text variant="caption" tone="ink3" as="span" className={styles.deposit}>
              {`${money(vehicle.depositAmount)} deposit held, then returned`}
            </Text>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

// ---- THE SHORT WIDE CARD ----
// Photo on the left, details on the right. Used in the "Popular on the island"
// row on the homepage.
export function VehicleCardWide({
  vehicle,
  className,
}: {
  vehicle: Vehicle;
  className?: string;
}) {
  return (
    <Card padded={false} flush className={cx(styles.wide, className)}>
      <Link href={`/vehicles/${vehicle.id}`} tabIndex={-1} aria-hidden="true">
        <div className={styles.widePhoto}>
          <PhotoPlaceholder shape="fill" className={styles.photo} iconSize={40} />
        </div>
      </Link>

      <div className={styles.wideBody}>
        <Text variant="label" as="h3" className={styles.name} raw>
          <Link href={`/vehicles/${vehicle.id}`}>
            {`${vehicle.make} ${vehicle.model}`}
          </Link>
        </Text>

        <StarRow rating={vehicle.rating} reviewCount={vehicle.reviewCount} size={13} />

        <Text variant="label" as="span" raw>
          {perDay(vehicle.dailyRate)}
        </Text>
      </div>
    </Card>
  );
}

export default VehicleCard;
