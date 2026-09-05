'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every booking across this business's fleet — coming up,
// out now, and finished.
//
// WHAT IS DELIBERATELY MISSING, AND WHY: there is no phone number and no email
// address anywhere on this page, and there must never be one. A business sees
// who is collecting the car and when — a first name and last initial, enough to
// greet the right person at the counter — along with whether SXM Rentals has
// checked their licence, which is the reassurance a business actually needs.
// Everything else is a conversation through SXM Rentals messages.
//
// This is not enforced by remembering to leave it out. The ProviderBooking type
// has no contact fields at all, so this page could not display one if it tried.
//
// EVERY MONEY FIGURE IS THE BUSINESS'S OWN SHARE, with what the customer paid
// and the commission shown beside it rather than hidden.

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { dateRange, money } from '@/lib/format';
import {
  Card,
  EmptyState,
  ErrorState,
  Icon,
  SegmentedControl,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { BookingStatus, DepositStatus } from '@/types';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

type Tab = 'upcoming' | 'active' | 'past';

const STATUS_LOOK: Record<BookingStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'brand' }> = {
  upcoming: { label: 'UPCOMING', tone: 'brand' },
  active: { label: 'OUT NOW', tone: 'success' },
  completed: { label: 'COMPLETED', tone: 'neutral' },
  cancelled: { label: 'CANCELLED', tone: 'danger' },
};

const DEPOSIT_LOOK: Record<DepositStatus, { label: string; tone: 'neutral' | 'success' | 'warning' }> = {
  not_taken: { label: 'NOT HELD', tone: 'neutral' },
  held: { label: 'HELD', tone: 'warning' },
  released: { label: 'RETURNED', tone: 'success' },
  claimed: { label: 'CLAIMED', tone: 'warning' },
};

export default function ProviderBookingsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('upcoming');
  const { data: bookings, loading, error, refresh } = useAsyncData(
    () => apiClient.getProviderBookings(),
    [],
  );

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
    if (loading) return <Skeleton height={320} radius="var(--radius-lg)" />;
    if (error) return <ErrorState message={error} onRetry={refresh} />;

    if (shown.length === 0) {
      return (
        <EmptyState
          title={
            tab === 'upcoming'
              ? 'Nothing booked yet'
              : tab === 'active'
                ? 'No vehicles out right now'
                : 'No finished bookings'
          }
          body={t('pp.bookings.emptyBody')}
          icon="calendar-outline"
        />
      );
    }

    return (
      // A real table, because this is genuinely tabular. Marked up properly so a
      // screen reader announces which column a figure belongs to.
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="sr-only">
            {t('pp.bookings.intro')}
          </caption>

          <thead>
            <tr>
              <th scope="col">Vehicle</th>
              <th scope="col">Renter</th>
              <th scope="col">Dates</th>
              <th scope="col">Collection</th>
              <th scope="col" className={styles.numeric}>
                {t('pp.apply.youReceive')}
              </th>
              <th scope="col">Deposit</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {shown.map((booking) => {
              const vehicle = findVehicle(booking.vehicleId);
              const status = STATUS_LOOK[booking.status];
              const deposit = DEPOSIT_LOOK[booking.depositStatus];

              return (
                <tr key={booking.id}>
                  <td>
                    <Link href={`/provider/bookings/${booking.id}`}>
                      <Text variant="label" as="span" raw>
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}
                      </Text>
                    </Link>
                    <Text variant="caption" tone="ink3" raw>
                      {booking.reference}
                    </Text>
                  </td>

                  <td>
                    {/* A first name and last initial. That is the whole record. */}
                    <Text variant="body" as="span" raw>
                      {booking.renterDisplayName}
                    </Text>
                    {booking.renterVerified ? (
                      <Text variant="caption" tone="success" raw>
                        {t('pp.bookings.licenceVerified')}
                      </Text>
                    ) : (
                      <Text variant="caption" tone="warning" raw>
                        {t('pp.bookings.notVerified')}
                      </Text>
                    )}
                  </td>

                  <td>
                    <Text variant="body" as="span" raw>
                      {dateRange(booking.startDate, booking.endDate)}
                    </Text>
                    <Text variant="caption" tone="ink3" raw>
                      {`${booking.pickupTime} – ${booking.returnTime}`}
                    </Text>
                  </td>

                  <td>
                    <Text variant="body" as="span" raw>
                      {booking.collection === 'delivery' ? 'Delivery' : 'Collection'}
                    </Text>
                    <Text variant="caption" tone="ink3" raw>
                      {booking.location}
                    </Text>
                  </td>

                  {/* The net figure leads, with the gross and the commission
                      underneath so the deduction is checkable. */}
                  <td className={styles.numeric}>
                    <Text variant="label" as="span" raw>
                      {money(booking.netAmount)}
                    </Text>
                    <Text variant="caption" tone="ink3" raw>
                      {`${money(booking.grossAmount)} − ${money(booking.commission)}`}
                    </Text>
                  </td>

                  <td>
                    <StatusPill
                      label={`${deposit.label} · ${money(booking.depositAmount)}`}
                      tone={deposit.tone}
                    />
                  </td>

                  <td>
                    <StatusPill label={status.label} tone={status.tone} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('web.provider.bookings')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.bookings.everything')}
          </Text>
        </div>
      </div>

      <SegmentedControl
        label={t('pp.bookings.which')}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: `Upcoming${counts.upcoming ? ` (${counts.upcoming})` : ''}` },
          { value: 'active', label: `Out now${counts.active ? ` (${counts.active})` : ''}` },
          { value: 'past', label: `Past${counts.past ? ` (${counts.past})` : ''}` },
        ]}
      />

      {renderBody()}

      {/* ---- WHY THERE IS NO PHONE NUMBER ----
          Said plainly. A business looking for contact details and not finding
          them should understand this is a rule, not a gap in the data. */}
      <Card padded>
        <div className={styles.privacyNote}>
          <Icon name="lock-closed-outline" size={20} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h2" raw>
              {t('pp.privacy.whyTitle')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('pp.privacy.notShared')}
              {t('pp.privacy.thatWay')}
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}
