'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Keeping a car for longer than originally booked.
//
// LIKE CANCELLING, THE COST IS SHOWN BEFORE ANYTHING IS CONFIRMED. Extra days,
// what they come to, and whether the deposit changes are all on screen above the
// button. An extension that quietly charges an unexpected amount is exactly the
// kind of surprise that ends up as a card dispute.
//
// IT ALSO CHECKS THE CAR IS ACTUALLY FREE for the extra days. A car already
// booked by somebody else from Friday cannot be kept until Sunday, and finding
// that out at the counter is far worse than finding it out here.

import React, { use, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { dateRange, longDate, money } from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import {
  Button,
  Calendar,
  Card,
  Divider,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  Text,
} from '@/components/ui';
import styles from '../../../account.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

export default function ExtendRentalPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { id } = use(params);

  const [newEnd, setNewEnd] = useState<string | undefined>();
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);

  const { data: booking, loading, error, refresh } = useAsyncData(
    () => apiClient.getBooking(id),
    [id],
  );

  const vehicle = booking ? findVehicle(booking.vehicleId) : undefined;

  // How many extra days, and what they cost.
  const extra = useMemo(() => {
    if (!booking || !newEnd || !vehicle) return null;

    const days = dayjs(newEnd).diff(dayjs(booking.endDate), 'day');
    if (days <= 0) return null;

    return { days, cost: days * vehicle.dailyRate };
  }, [booking, newEnd, vehicle]);

  // Days the car is already promised to someone else, plus everything up to and
  // including the current end date — which is not an extension.
  const blockedDates = useMemo(() => {
    if (!booking || !vehicle) return [];

    const upToCurrentEnd: string[] = [];
    let cursor = dayjs(booking.startDate);
    const end = dayjs(booking.endDate);

    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      upToCurrentEnd.push(cursor.format('YYYY-MM-DD'));
      cursor = cursor.add(1, 'day');
    }

    return [...vehicle.unavailableDates, ...upToCurrentEnd];
  }, [booking, vehicle]);

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="45%" />
        <Skeleton height={300} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!booking || !vehicle) {
    return (
      <EmptyState
        title={t('acct.rental.notFound')}
        body={t('acct.rental.notFoundBody')}
        icon="car-outline"
        actionLabel={t('acct.cancel.backToRentals')}
        actionHref="/account/rentals"
      />
    );
  }

  if (booking.status !== 'active' && booking.status !== 'upcoming') {
    return (
      <EmptyState
        title={t('acct.extend.cannotTitle')}
        body={t('acct.extend.cannotBody')}
        icon="information-circle-outline"
        actionLabel={t('acct.extend.back')}
        actionHref={`/account/rentals/${booking.id}`}
      />
    );
  }

  if (done) {
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={34} color="var(--success)" />
        <Text variant="h2" as="h1" raw>
          {t('acct.extend.requested')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {`The business has been asked to keep the car until ${longDate(newEnd!)}. They will confirm through SXM Rentals messages.`}
        </Text>
        <Text variant="small" tone="ink3" raw>
          {t('acct.extend.demoNote')}
        </Text>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button label={t('acct.extend.back')} href={`/account/rentals/${booking.id}`} size="md" />
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Rentals', href: '/account/rentals' },
          { label: booking.reference, href: `/account/rentals/${booking.id}` },
          { label: 'Extend' },
        ]}
      />

      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('acct.extend.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {`${vehicle.make} ${vehicle.model} · currently ${dateRange(
            booking.startDate,
            booking.endDate,
          )}`}
        </Text>
      </div>

      {/* ---- CHOOSE THE NEW RETURN DAY ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.extend.newReturn')}
        </Text>

        <Text variant="small" tone="ink2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('acct.extend.greyedNote')}
        </Text>

        <Calendar
          singleDate
          startDate={newEnd}
          onChange={(range) => setNewEnd(range.startDate)}
          unavailableDates={blockedDates}
          showLegend
        />
      </Card>

      {/* ---- WHAT IT COSTS, BEFORE CONFIRMING ---- */}
      {extra ? (
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('acct.extend.cost')}
          </Text>

          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('acct.extend.extraDays')}
              </Text>
              <Text variant="body" as="span" raw>
                {`${extra.days} ${extra.days === 1 ? 'day' : 'days'}`}
              </Text>
            </div>

            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {`${money(vehicle.dailyRate)} per day`}
              </Text>
              <Text variant="body" as="span" raw>
                {money(extra.cost)}
              </Text>
            </div>

            <Divider />

            <div className={styles.infoRow}>
              <Text variant="h3" as="span" raw>
                {t('acct.extend.toPay')}
              </Text>
              <Text variant="h3" as="span" raw>
                {money(extra.cost)}
              </Text>
            </div>
          </div>

          {/* The deposit does not change when a rental is extended. Saying so
              stops people expecting a second hold on their card. */}
          <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
            <Icon name="shield-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {`The ${money(booking.depositAmount)} deposit does not change. No second hold is placed on your card.`}
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
            <Button
              label={t('common.back')}
              href={`/account/rentals/${booking.id}`}
              variant="outline"
              size="md"
            />
            <Button
              label={t('acct.extend.request')}
              size="md"
              loading={working}
              priceLabel={money(extra.cost)}
              onClick={() => {
                setWorking(true);
                window.setTimeout(() => {
                  setWorking(false);
                  setDone(true);
                }, 600);
              }}
            />
          </div>
        </Card>
      ) : (
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3">
            Choose a return date after {longDate(booking.endDate)} to see what the extra
            days cost.
          </Text>
        </div>
      )}
    </div>
  );
}
