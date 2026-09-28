'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The photos at the top of a car's page — one large, and
// a row of the rest underneath to choose from.
//
// A car with no photos yet keeps the grey blocks it has always had, in the
// same places, so the page does not change shape when photos arrive. A car
// with one photo shows just that one: a row of empty squares under a real
// photo would look like photos that failed to load.

import React, { useState } from 'react';
import { cx } from '@/lib/utils';
import { PhotoPlaceholder } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import styles from '@/app/(site)/vehicles/[id]/vehicle.module.css';

export function VehicleGallery({ photos, name }: { photos: string[]; name: string }) {
  const { t } = useTranslation();
  const [shown, setShown] = useState(0);

  // Only what can be shown. See photoAt in lib/photos.ts.
  const usable = photos.filter((photo) => photo.startsWith('https://'));

  if (usable.length === 0) {
    return (
      <div className={styles.gallery}>
        <PhotoPlaceholder shape="wide" iconSize={70} label={name} />
        <div className={styles.galleryStrip}>
          {Array.from({ length: 4 }).map((_, index) => (
            <PhotoPlaceholder key={index} shape="square" iconSize={26} />
          ))}
        </div>
      </div>
    );
  }

  const current = Math.min(shown, usable.length - 1);
  const say = (text: string, n: number) =>
    text.replace('{name}', name).replace('{n}', String(n)).replace('{total}', String(usable.length));

  return (
    <div className={styles.gallery}>
      <PhotoPlaceholder
        shape="wide"
        iconSize={70}
        photo={usable[current]}
        size="page"
        alt={say(t('vehicle.photoOf'), current + 1)}
        eager
      />

      {usable.length > 1 ? (
        <div className={styles.photoStrip}>
          {usable.map((photo, index) => (
            <button
              key={photo}
              type="button"
              className={cx(styles.thumb, index === current && styles.thumbShown)}
              aria-label={say(t('vehicle.showPhoto'), index + 1)}
              aria-pressed={index === current}
              onClick={() => setShown(index)}
            >
              <PhotoPlaceholder shape="square" iconSize={26} photo={photo} size="thumb" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default VehicleGallery;
