'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A customer's rentals, split into what is coming up, what
// is happening now, and what has already finished.
//
// HOW A FAILURE IS HANDLED — the pattern used on every list on this site:
// loading and "nothing came back" are kept as two separate questions. Writing
// them as one check ("if still loading OR no rentals, show loading blocks") looks
// correct and leaves the page on grey blocks for ever whenever a request fails,
// because the rentals never arrive. So there are three outcomes here, always:
// blocks while loading, a readable message with a retry if it failed, and an
// empty state if it genuinely worked and there is nothing there.

import React, { useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { findProvider } from '@/lib/mock/providers';
import { dateRange, daysBetween, money, relativeDay } from '@/lib/format';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  PhotoPlaceholder,
  SegmentedControl,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { Booking, BookingStatus } from '@/types';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

type Tab = 'upcoming' | 'active' | 'past';

// How each status should be coloured and worded when shown as a pill.
const STATUS_LOOK: Record<BookingStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'brand' }> = {
  upcoming: { label: 'UPCOMING', tone: 'brand' },
  active: { label: 'OUT NOW', tone: 'success' },
  completed: { label: 'COMPLETED', tone: 'neutral' },
  cancelled: { label: 'CANCELLED', tone: 'danger' },
};

const DEPOSIT_LOOK: Record<string, { label: string; tone: 'neutral' | 'success' | 'warning' }> = {
  not_taken: { label: 'DEPOSIT NOT YET HELD', tone: 'neutral' },
  held: { label: 'DEPOSIT HELD', tone: 'warning' },
  released: { label: 'DEPOSIT RETURNED', tone: 'success' },
  claimed: { label: 'DEPOSIT CLAIMED', tone: 'warning' },
};

export default function RentalsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('upcoming');
  const { data: bookings, loading, error, refresh } = useAsyncData(
    () => apiClient.listBookings(),
    [],
  );

  // "Past" gathers both completed and cancelled, because from the customer's
  // point of view they are the same thing: rentals that are over.
  const shown = useMemo(() => {
    if (!bookings) return [];
    if (tab === 'past') {
      return bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
    }
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  const counts = useMemo(() => {
    const list = bookings ?? [];
    return {
      upcoming: list.filter((b) => b.status === 'upcoming').length,
      active: list.filter((b) => b.status === 'active').length,
      past: list.filter((b) => b.status === 'completed' || b.status === 'cancelled').length,
    };
  }, [bookings]);

  const renderBody = () => {
    if (loading) {
      return (
        <div className={styles.stack}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={168} radius="var(--radius-lg)" />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }

    if (shown.length === 0) {
      const empty = {
        upcoming: {
          title: 'Nothing booked yet',
          body: 'When you book a car it appears here, with the collection details and the agreement you signed.',
        },
        active: {
          title: 'No car out right now',
          body: 'A rental moves here on the day you collect the car, along with the extend and support options.',
        },
        past: {
          title: 'No finished rentals',
          body: 'Once a rental ends it stays here with its receipt and signed agreement, so you can find them later.',
        },
      }[tab];

      return (
        <EmptyState
          title={empty.title}
          body={empty.body}
          icon="car-outline"
          actionLabel={t('web.nav.findCar')}
          actionHref="/search"
        />
      );
    }

    return (
      <div className={styles.stack}>
        {shown.map((booking) => (
          <RentalCard key={booking.id} booking={booking} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('acct.rentals.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('acct.rentals.subtitle')}
          </Text>
        </div>

        <Button label={t('web.nav.findCar')} href="/search" variant="outline" size="sm" />
      </div>

      <SegmentedControl
        label={t('acct.rentals.which')}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: `Upcoming${counts.upcoming ? ` (${counts.upcoming})` : ''}` },
          { value: 'active', label: `Active${counts.active ? ` (${counts.active})` : ''}` },
          { value: 'past', label: `Past${counts.past ? ` (${counts.past})` : ''}` },
        ]}
      />

      {renderBody()}
    </div>
  );
}

// ---- ONE RENTAL, AS A CARD ----
function RentalCard({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const vehicle = findVehicle(booking.vehicleId);
  const provider = findProvider(booking.providerId);
  const days = daysBetween(booking.startDate, booking.endDate);
  const status = STATUS_LOOK[booking.status];
  const deposit = DEPOSIT_LOOK[booking.depositStatus];

  return (
    <Card>
      <div className={styles.rental}>
        <div className={styles.rentalPhoto}>
          <PhotoPlaceholder shape="wide" iconSize={34} />
        </div>

        <div className={styles.rentalBody}>
          <div className={styles.rentalTop}>
            <div>
              <Text variant="label" as="h2" raw>
                {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}
              </Text>
              <Text variant="small" tone="ink3" raw>
                {`${booking.reference}${provider ? ` · ${provider.businessName}` : ''}`}
              </Text>
            </div>

            <StatusPill label={status.label} tone={status.tone} />
          </div>

          <div className={styles.rentalMeta}>
            <span className={styles.metaItem}>
              <Icon name="calendar-outline" size={15} />
              <Text variant="small" tone="ink2" as="span" raw>
                {`${dateRange(booking.startDate, booking.endDate)} · ${days} ${
                  days === 1 ? 'day' : 'days'
                }`}
              </Text>
            </span>

            <span className={styles.metaItem}>
              <Icon name="location-outline" size={15} />
              <Text variant="small" tone="ink2" as="span" raw>
                {booking.location}
              </Text>
            </span>

            {booking.status === 'upcoming' ? (
              <span className={styles.metaItem}>
                <Icon name="time-outline" size={15} />
                <Text variant="small" tone="ink2" as="span" raw>
                  {relativeDay(booking.startDate)}
                </Text>
              </span>
            ) : null}
          </div>

          {/* The amount paid and the deposit are shown as two separate things,
              never added together. The deposit is held and returned. */}
          <div className={styles.rentalMeta}>
            <Text variant="small" tone="ink2" as="span" raw>
              {`Paid ${money(booking.totalDueToday)}`}
            </Text>
            {booking.depositAmount > 0 ? (
              <StatusPill
                label={`${deposit.label} · ${money(booking.depositAmount)}`}
                tone={deposit.tone}
              />
            ) : null}
          </div>

          <div className={styles.rentalActions}>
            <Button
              label={t('acct.rentals.viewRental')}
              href={`/account/rentals/${booking.id}`}
              variant="secondary"
              size="sm"
            />

            {booking.status === 'active' ? (
              <Button
                label="Extend"
                href={`/account/rentals/${booking.id}/extend`}
                variant="outline"
                size="sm"
              />
            ) : null}

            {booking.status === 'upcoming' ? (
              <Button
                label={t('common.cancel')}
                href={`/account/rentals/${booking.id}/cancel`}
                variant="ghost"
                size="sm"
              />
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
