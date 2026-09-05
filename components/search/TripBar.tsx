'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The bar showing the trip being planned — the dates, where
// the car is collected, and whether it should be delivered instead. It stays
// visible across the catalogue so the dates are never more than a glance away.
//
// WHY THE DATES SIT IN THE PAGE ADDRESS: a search someone wants to share, send
// to whoever they are travelling with, or come back to tomorrow has to survive
// being copied out of the address bar. Keeping the dates only in memory means
// the link they send shows a different set of cars to the one they were looking
// at, which is worse than not being able to share it at all.

import React, { useState } from 'react';
import { dateRange, daysBetween } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { Button, Calendar, Icon, Sheet, Text, Input, SegmentedControl } from '@/components/ui';
import styles from './Search.module.css';
import { useTranslation } from '@/lib/i18n';

export function TripBar({
  // Called when the dates change, so the page can put them into the address.
  onDatesChange,
}: {
  onDatesChange?: (range: { startDate?: string; endDate?: string }) => void;
}) {
  const { t } = useTranslation();
  const { trip, setTrip, hasDates } = useTrip();
  const [datesOpen, setDatesOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);

  const dayCount = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : 0;

  return (
    <>
      <div className={styles.tripBar}>
        {/* ---- DATES ---- */}
        <button type="button" className={styles.tripField} onClick={() => setDatesOpen(true)}>
          <Icon name="calendar-outline" size={19} />
          <span className={styles.tripFieldText}>
            <Text variant="caption" tone="ink3" as="span" raw>
              {t('flow.confirm.dates')}
            </Text>
            <Text variant="label" as="span" raw>
              {hasDates
                ? `${dateRange(trip.startDate!, trip.endDate!)} · ${dayCount} ${dayCount === 1 ? 'day' : 'days'}`
                : t('search.trip.addDates')}
            </Text>
          </span>
        </button>

        <span className={styles.tripDivider} aria-hidden="true" />

        {/* ---- WHERE ---- */}
        <button type="button" className={styles.tripField} onClick={() => setPlaceOpen(true)}>
          <Icon name="location-outline" size={19} />
          <span className={styles.tripFieldText}>
            <Text variant="caption" tone="ink3" as="span">
              {trip.collection === 'delivery'
                ? t('search.trip.deliveredTo')
                : t('search.trip.collectFrom')}
            </Text>
            <Text variant="label" as="span" raw>
              {trip.location}
            </Text>
          </span>
        </button>
      </div>

      {/* ---- THE DATE PICKER ---- */}
      <Sheet
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        title={t('search.trip.whenTitle')}
        subtitle={t('search.trip.whenSubtitle')}
        footer={
          <>
            <Button
              label={t('booking.clearSignature')}
              variant="outline"
              size="md"
              onClick={() => {
                setTrip({ startDate: undefined, endDate: undefined });
                onDatesChange?.({ startDate: undefined, endDate: undefined });
              }}
            />
            <Button label={t('common.done')} size="md" onClick={() => setDatesOpen(false)} />
          </>
        }
      >
        <Calendar
          startDate={trip.startDate}
          endDate={trip.endDate}
          onChange={(range) => {
            setTrip(range);
            onDatesChange?.(range);
          }}
        />
      </Sheet>

      {/* ---- WHERE THE CAR COMES FROM ---- */}
      <Sheet
        open={placeOpen}
        onClose={() => setPlaceOpen(false)}
        title={t('search.trip.whereTitle')}
        footer={<Button label={t('common.done')} size="md" onClick={() => setPlaceOpen(false)} />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <SegmentedControl
            label={t('search.trip.howLabel')}
            fullWidth
            value={trip.collection}
            onChange={(value) => setTrip({ collection: value })}
            options={[
              { value: 'pickup', label: 'Collection' },
              { value: 'delivery', label: 'Delivery' },
            ]}
          />

          <Input
            label={trip.collection === 'delivery' ? 'Deliver to' : 'Collect from'}
            iconLeft="location-outline"
            placeholder={t('search.trip.placeholder')}
            value={trip.location}
            onChange={(event) => setTrip({ location: event.target.value })}
          />

          <Text variant="small" tone="ink3" raw>
            {t('search.trip.deliveryNote')}
          </Text>
        </div>
      </Sheet>
    </>
  );
}

export default TripBar;
