'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Asking to keep a car for longer than originally booked.
//
// ---- HOW AN EXTENSION ACTUALLY HAPPENS ----
//
// The backend has no "extend this booking" address. What it does have is
// messaging between a customer and the business, with the booking attached.
// So choosing a new return date here sends the business a real message
// asking for it, in the conversation they already share, and the business
// replies there.
//
// That is what the old version of this page CLAIMED to do — "the business has
// been asked… they will confirm through SXM Rentals messages" — while
// actually sending nothing. Now the sentence is true.
//
// ---- THE COST IS AN ESTIMATE, AND SAYS SO ----
//
// Extra days are priced here from the car's daily rate, so nobody asks for an
// extension without an idea of what it comes to. It is shown as an estimate,
// not "to pay": nothing is charged on this page, and the business confirms the
// price in its reply. There is no price on the button for the same reason.
//
// DAYS THE CAR IS ALREADY PROMISED ELSEWHERE are greyed out on the calendar,
// from the car's public record. If that record cannot be found — the car has
// been taken off the platform, or the lookup failed — the request can still
// be sent; the business knows its own calendar.

import React, { use, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useBooking, useCarName } from '@/hooks/useBookings';
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
  const [problem, setProblem] = useState<string | null>(null);
  // The conversation the request went into, once sent.
  const [sentThreadId, setSentThreadId] = useState<string | null>(null);

  const { booking, vehicle, lookedUp, loading, error, refresh } = useBooking(id);
  const carName = useCarName();

  // How many extra days — and, where the car's daily rate is known, roughly
  // what they come to.
  const extra = useMemo(() => {
    if (!booking || !newEnd) return null;
    const days = dayjs(newEnd).diff(dayjs(booking.endDate), 'day');
    if (days <= 0) return null;
    return { days, estimate: vehicle ? days * vehicle.dailyRate : null };
  }, [booking, newEnd, vehicle]);

  // Days the car is already promised to someone else, plus everything up to and
  // including the current end date — which is not an extension.
  const blockedDates = useMemo(() => {
    if (!booking) return [];

    const upToCurrentEnd: string[] = [];
    let cursor = dayjs(booking.startDate);
    const end = dayjs(booking.endDate);
    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      upToCurrentEnd.push(cursor.format('YYYY-MM-DD'));
      cursor = cursor.add(1, 'day');
    }

    return [...(vehicle?.unavailableDates ?? []), ...upToCurrentEnd];
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

  if (!booking) {
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

  // ---- SENT ----
  if (sentThreadId) {
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={34} color="var(--success)" />
        <Text variant="h2" as="h1" raw>
          {t('acct.extend.requested')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.extend.sentBody')}
        </Text>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button label={t('acct.extend.openThread')} href={`/account/messages/${sentThreadId}`} size="md" />
          <Button
            label={t('acct.extend.back')}
            href={`/account/rentals/${booking.id}`}
            variant="outline"
            size="md"
          />
        </div>
      </Card>
    );
  }

  const request = async () => {
    if (!newEnd) return;
    setWorking(true);
    setProblem(null);
    try {
      const body = t('acct.extend.message')
        .replace('{date}', longDate(newEnd))
        .replace('{current}', longDate(booking.endDate))
        .replace('{reference}', booking.reference);
      const thread = await apiClient.startThread({
        providerId: booking.providerId,
        bookingId: booking.id,
        body,
      });
      setSentThreadId(thread.id);
    } catch (caught) {
      setProblem(isApiError(caught) ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setWorking(false);
    }
  };

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
          {`${carName(vehicle, lookedUp)} · currently ${dateRange(booking.startDate, booking.endDate)}`}
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

      {/* ---- WHAT IT WOULD COST, THEN THE REQUEST ---- */}
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

            {vehicle && extra.estimate !== null ? (
              <>
                <div className={styles.infoRow}>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {`${money(vehicle.dailyRate)} per day`}
                  </Text>
                  <Text variant="body" as="span" raw>
                    {money(extra.estimate)}
                  </Text>
                </div>

                <Divider />

                <div className={styles.infoRow}>
                  <Text variant="h3" as="span" raw>
                    {t('acct.extend.estimate')}
                  </Text>
                  <Text variant="h3" as="span" raw>
                    {money(extra.estimate)}
                  </Text>
                </div>
              </>
            ) : null}
          </div>

          <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('acct.extend.estimateNote')}
            </Text>
          </div>

          {/* The deposit does not change when a rental is extended. Saying so
              stops people expecting a second hold on their card. */}
          {booking.depositAmount > 0 ? (
            <div className={styles.note}>
              <Icon name="shield-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {`The ${money(booking.depositAmount)} deposit does not change. No second hold is placed on your card.`}
              </Text>
            </div>
          ) : null}

          {problem ? (
            <div className={styles.note} role="alert">
              <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
              <Text variant="small" tone="ink2" raw>
                {problem}
              </Text>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
            <Button
              label={t('common.back')}
              href={`/account/rentals/${booking.id}`}
              variant="outline"
              size="md"
            />
            <Button label={t('acct.extend.request')} size="md" loading={working} onClick={request} />
          </div>
        </Card>
      ) : (
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3">
            Choose a return date after {longDate(booking.endDate)} to see what the extra
            days would cost.
          </Text>
        </div>
      )}
    </div>
  );
}
