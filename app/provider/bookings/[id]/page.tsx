'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One booking, as the rental business sees it.
//
// WHAT IS DELIBERATELY MISSING, AND WHY:
//
// There is no phone number and no email address on this page. A business sees
// who is collecting the car, when, and whether SXM Rentals has checked their
// licence — enough to hand the keys to the right person — and talks to them
// through the app's own messaging. Customer contact details stay with SXM
// Rentals staff.
//
// The note further down says so on the page, rather than leaving a business
// hunting for a phone number that is not there. It exists so that bookings keep
// happening on the platform, where the deposit, the signed agreement and any
// dispute are all things we can actually help with — rather than moving to a
// private arrangement that cuts everyone loose.
//
// Keeping the fields off the type is what makes the rule hold: ProviderBooking
// has no contact fields at all, so this page could not show one if it tried.
//
// ---- THE CONVERSATION ABOUT THIS BOOKING ----
//
// A business cannot start a conversation — the backend only lets it reply —
// and a booking from the backend does not say which conversation is its own.
// So the page looks through the business's conversations for the one with
// this booking's reference. If the renter has not written yet, the page says
// so, rather than offering a button that has nowhere to go.
//
// A CANCELLED BOOKING shows no payout and no deposit hold, for the reasons
// given at the top of the bookings list.

import React, { use } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useFleetLookup } from '@/hooks/useFleet';
import { dateRange, daysBetween, money } from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { EarningsSplit } from '@/components/business/Stats';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  PhotoPlaceholder,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { BookingStatus, DepositStatus } from '@/types';
import styles from '../../provider.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

const STATUS_LOOK: Record<BookingStatus, { label: string; tone: 'neutral' | 'success' | 'danger' | 'brand' }> = {
  upcoming: { label: 'UPCOMING', tone: 'brand' },
  active: { label: 'OUT NOW', tone: 'success' },
  completed: { label: 'COMPLETED', tone: 'neutral' },
  cancelled: { label: 'CANCELLED', tone: 'danger' },
};

const DEPOSIT_NOTE: Record<DepositStatus, string> = {
  not_taken:
    'Not held yet. SXM Rentals places the hold on the customer’s card shortly before collection.',
  held: 'Currently held on the customer’s card by SXM Rentals. This is not your money and is not part of your payout.',
  released:
    'Released back to the customer after the vehicle was returned and checked.',
  claimed:
    'A claim has been made against this deposit. SXM Rentals handles the process and will be in touch.',
};

export default function ProviderBookingDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { id } = use(params);

  const { data: booking, loading, error, refresh } = useAsyncData(
    () => apiClient.getProviderBooking(id),
    [id],
  );
  // Car names, from the business's own fleet — see hooks/useFleet.ts.
  const cars = useFleetLookup();
  // The conversations, to find this booking's. A failure only costs the link.
  const threads = useAsyncData(
    (signal) => apiClient.getBusinessThreads(signal).catch(() => null),
    [],
  );

  if (loading || cars.loading || threads.loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="40%" />
        <Skeleton height={220} radius="var(--radius-lg)" />
        <Skeleton height={180} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!booking) {
    return (
      <EmptyState
        title={t('pp.bookings.notFound')}
        body={t('pp.bookings.notFoundBody')}
        icon="calendar-outline"
        actionLabel="Back to bookings"
        actionHref="/provider/bookings"
      />
    );
  }

  const vehicle = cars.vehicle(booking.vehicleId);
  const days = daysBetween(booking.startDate, booking.endDate);
  const cancelled = booking.status === 'cancelled';
  const status = STATUS_LOOK[booking.status];
  const threadId =
    booking.threadId ??
    threads.data?.find((thread) => thread.bookingRef === booking.reference)?.id;

  const rows: { label: string; value: string }[] = [
    { label: 'Reference', value: booking.reference },
    { label: 'Dates', value: dateRange(booking.startDate, booking.endDate) },
    { label: 'Length', value: `${days} ${days === 1 ? 'day' : 'days'}` },
    { label: 'Collection time', value: booking.pickupTime },
    { label: 'Return time', value: booking.returnTime },
    {
      label: booking.collection === 'delivery' ? 'Deliver to' : 'Collect from',
      value: booking.location,
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Bookings', href: '/provider/bookings' },
          { label: booking.reference },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {cars.name(booking.vehicleId)}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {`${booking.reference} · ${dateRange(booking.startDate, booking.endDate)}`}
          </Text>
        </div>

        <div className={styles.headActions}>
          <StatusPill label={status.label} tone={status.tone} />
          {threadId ? (
            <Button
              label={t('pp.bookings.messageRenter')}
              href={`/provider/messages/${threadId}`}
              size="sm"
            />
          ) : null}
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* ---- THE VEHICLE ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('flow.confirm.vehicle')}
          </Text>

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <PhotoPlaceholder
              shape="wide"
              iconSize={28}
              style={{ width: 120, flexShrink: 0 }}
              photo={vehicle?.photos?.[0]}
              size="thumb"
            />
            <div style={{ minWidth: 0 }}>
              <Text variant="label" as="p" raw>
                {vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : cars.name(booking.vehicleId)}
              </Text>
              {vehicle ? (
                <Text variant="small" tone="ink2" raw>
                  {`${vehicle.seats} seats · ${vehicle.pickupTown}`}
                </Text>
              ) : null}
            </div>
          </div>

          {vehicle ? (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Button
                label={t('pp.bookings.editVehicle')}
                href={`/provider/fleet/${vehicle.id}`}
                variant="outline"
                size="sm"
              />
            </div>
          ) : null}
        </Card>

        {/* ---- WHO IS COLLECTING IT ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.bookings.whoCollecting')}
          </Text>

          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span">
                Name
              </Text>
              <Text variant="body" as="span" className={styles.infoValue} raw>
                {booking.renterDisplayName}
              </Text>
            </div>

            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.bookings.licenceAndId')}
              </Text>
              <StatusPill
                label={booking.renterVerified ? 'CHECKED BY SXM RENTALS' : 'NOT YET CHECKED'}
                tone={booking.renterVerified ? 'success' : 'warning'}
              />
            </div>
          </div>

          {/* ---- WHY THERE IS NO PHONE NUMBER ----
              Said plainly, right where a business would look for one. */}
          <div className={styles.privacyNote} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="lock-closed-outline" size={19} color="var(--ink2)" />
            <div>
              <Text variant="label" as="h3" raw>
                {t('pp.privacy.noPhoneTitle')}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {t('pp.privacy.notShared')}
                {t('pp.privacy.messageInstead')}
              </Text>
            </div>
          </div>

          {!threadId && !cancelled ? (
            <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
              <Icon name="chatbubble-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink2" raw>
                {t('pp.bookings.waitForRenter')}
              </Text>
            </div>
          ) : null}

          {!booking.renterVerified ? (
            <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
              <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
              <Text variant="small" tone="ink2" raw>
                {t('pp.bookings.doNotHandOver')}
              </Text>
            </div>
          ) : null}
        </Card>

        {/* ---- THE DETAILS ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.bookings.details')}
          </Text>

          <div className={styles.infoRows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.infoRow}>
                <Text variant="body" tone="ink2" as="span">
                  {row.label}
                </Text>
                <Text variant="body" as="span" className={styles.infoValue} raw>
                  {row.value}
                </Text>
              </div>
            ))}
          </div>
        </Card>

        {/* ---- THE MONEY ---- */}
        <Card padded>
          {cancelled ? (
            <>
              <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
                {t('pp.bookings.whatYouReceive')}
              </Text>
              <Text variant="body" tone="ink2" raw>
                {t('pp.bookings.cancelledNothing')}
              </Text>
            </>
          ) : (
            <EarningsSplit
              gross={booking.grossAmount}
              commission={booking.commission}
              net={booking.netAmount}
              title={t('pp.bookings.whatYouReceive')}
            />
          )}

          {/* The deposit gets its own block, clearly outside the money above. */}
          <div className={styles.privacyNote} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="shield-outline" size={19} color="var(--ink2)" />
            <div>
              <Text variant="label" as="h3" raw>
                {`Security deposit — ${money(booking.depositAmount)}`}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {cancelled ? t('pp.bookings.cancelledDeposit') : DEPOSIT_NOTE[booking.depositStatus]}
              </Text>
              <Text variant="small" tone="ink3" style={{ marginTop: 'var(--space-sm)' }} raw>
                {t('pp.bookings.noCommissionOnDeposits')}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
