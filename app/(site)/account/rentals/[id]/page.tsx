'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One rental in full — the car, the dates, where to collect
// it, what was paid, where the deposit has got to, and the signed agreement.
//
// IT IS ALSO THE PAGE PEOPLE PRINT. A receipt and a signed agreement are things
// somebody takes to a rental counter or files with an expense claim, so the
// navigation, the footer and the buttons are all marked to disappear when
// printed, leaving just the rental itself on the paper.

import React, { use } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { findProvider } from '@/lib/mock/providers';
import {
  dateRange,
  daysBetween,
  longDate,
  money,
  relativeDay,
  sideLabels,
} from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import {
  Button,
  Card,
  Divider,
  EmptyState,
  ErrorState,
  Icon,
  PhotoPlaceholder,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import styles from '../../account.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

const DEPOSIT_EXPLAINER: Record<string, string> = {
  not_taken:
    'Nothing has been set aside yet. The hold is placed on your card shortly before you collect the car.',
  held: 'This amount is currently set aside on your card. It has not been charged, and is released after you return the car.',
  released:
    'The hold has been lifted. Your bank may take a few working days to show the money as available again.',
  claimed:
    'Some or all of this deposit has been claimed by the rental business. They have to tell you why, and you can dispute it.',
};

export default function RentalDetailPage({ params }: PageProps) {
  const { t } = useTranslation();
  // "use" unwraps the address parameters, which arrive as a promise in this
  // version of Next.js.
  const { id } = use(params);

  const { data: booking, loading, error, refresh } = useAsyncData(
    () => apiClient.getBooking(id),
    [id],
  );

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="45%" />
        <Skeleton height={220} radius="var(--radius-lg)" />
        <Skeleton height={180} radius="var(--radius-lg)" />
      </div>
    );
  }

  // Loading has finished and it failed — a real message, never permanent
  // loading blocks.
  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  // Loading finished, nothing failed, but there is no such rental.
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

  const vehicle = findVehicle(booking.vehicleId);
  const provider = findProvider(booking.providerId);
  const days = daysBetween(booking.startDate, booking.endDate);

  const rows: { label: string; value: string }[] = [
    { label: 'Reference', value: booking.reference },
    { label: 'Dates', value: dateRange(booking.startDate, booking.endDate) },
    { label: 'Length', value: `${days} ${days === 1 ? 'day' : 'days'}` },
    { label: 'Collection time', value: booking.pickupTime },
    { label: 'Return time', value: booking.returnTime },
    {
      label: booking.collection === 'delivery' ? 'Delivered to' : 'Collect from',
      value: booking.location,
    },
    { label: 'Booked on', value: longDate(booking.createdAt) },
  ];

  return (
    <div className={styles.page}>
      <div data-print="hide">
        <Breadcrumbs
          items={[
            { label: 'Account', href: '/account' },
            { label: 'Rentals', href: '/account/rentals' },
            { label: booking.reference },
          ]}
        />
      </div>

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Your rental'}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {`${booking.reference} · ${dateRange(booking.startDate, booking.endDate)}`}
          </Text>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }} data-print="hide">
          {booking.status === 'active' ? (
            <Button
              label="Extend"
              href={`/account/rentals/${booking.id}/extend`}
              variant="secondary"
              size="sm"
            />
          ) : null}

          {booking.status === 'upcoming' ? (
            <Button
              label={t('common.cancel')}
              href={`/account/rentals/${booking.id}/cancel`}
              variant="outline"
              size="sm"
            />
          ) : null}

          <Button
            label={t('acct.rental.print')}
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            iconLeft={<Icon name="print-outline" size={16} />}
          />
        </div>
      </div>

      <div className={styles.detail}>
        {/* ---- THE MAIN COLUMN ---- */}
        <div className={styles.detailMain}>
          <Card data-print="keep">
            <div className={styles.rental}>
              <div className={styles.rentalPhoto}>
                <PhotoPlaceholder shape="wide" iconSize={34} />
              </div>
              <div className={styles.rentalBody}>
                <Text variant="label" as="h2" raw>
                  {vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : 'Vehicle'}
                </Text>
                {vehicle ? (
                  <Text variant="small" tone="ink2" raw>
                    {`${vehicle.seats} seats · ${vehicle.pickupTown}, ${sideLabels[vehicle.side]}`}
                  </Text>
                ) : null}
                {provider ? (
                  <Text variant="small" tone="ink3" raw>
                    {`Rented from ${provider.businessName}`}
                  </Text>
                ) : null}

                {vehicle ? (
                  <div className={styles.rentalActions} data-print="hide">
                    <Button
                      label={t('acct.rental.viewCar')}
                      href={`/vehicles/${vehicle.id}`}
                      variant="outline"
                      size="sm"
                    />
                    <Button
                      label={t('acct.rental.messageBusiness')}
                      href="/account/messages"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          {/* ---- THE DETAILS ---- */}
          <Card data-print="keep">
            <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
              {t('acct.rental.details')}
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

          {/* ---- THE AGREEMENT ---- */}
          <Card data-print="keep">
            <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
              {t('flow.step.agreement')}
            </Text>

            {booking.agreementSigned ? (
              <>
                <div className={styles.note}>
                  <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
                  <Text variant="small" tone="ink2" raw>
                    {t('acct.rental.signedNote')}
                  </Text>
                </div>
                <div style={{ marginTop: 'var(--space-md)' }} data-print="hide">
                  <Button
                    label={t('acct.rental.printAgreement')}
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    iconLeft={<Icon name="print-outline" size={16} />}
                  />
                </div>
              </>
            ) : (
              <div className={styles.note}>
                <Icon name="alert-circle-outline" size={16} color="var(--warning)" />
                <Text variant="small" tone="ink2" raw>
                  {t('acct.rental.notSigned')}
                </Text>
              </div>
            )}
          </Card>
        </div>

        {/* ---- THE SIDE COLUMN ---- */}
        <div className={styles.detailSide}>
          {/* The deposit gets its own panel, kept away from the amount paid, and
              says plainly which stage it has reached. */}
          <Card data-print="keep">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <Icon name="shield-outline" size={19} />
              <Text variant="label" as="h2">
                {t('vehicle.depositLabel')}
              </Text>
            </div>

            <div className={styles.infoRow}>
              <Text variant="h3" as="span" raw>
                {money(booking.depositAmount)}
              </Text>
              <StatusPill
                label={
                  {
                    not_taken: 'NOT YET HELD',
                    held: 'HELD',
                    released: 'RETURNED',
                    claimed: 'CLAIMED',
                  }[booking.depositStatus]
                }
                tone={
                  booking.depositStatus === 'released'
                    ? 'success'
                    : booking.depositStatus === 'claimed'
                      ? 'warning'
                      : booking.depositStatus === 'held'
                        ? 'warning'
                        : 'neutral'
                }
              />
            </div>

            <Divider style={{ marginBlock: 'var(--space-md)' }} />

            <Text variant="small" tone="ink2">
              {DEPOSIT_EXPLAINER[booking.depositStatus]}
            </Text>
          </Card>

          {/* The bill. The deposit is passed separately and is never inside the
              total — that rule lives in PriceBreakdown. */}
          <PriceBreakdown
            title={t('acct.rental.whatYouPaid')}
            lines={booking.lines}
            depositAmount={booking.depositAmount}
            depositHeld={booking.depositStatus === 'held'}
          />

          {booking.status === 'upcoming' ? (
            <Card data-print="hide">
              <div className={styles.note}>
                <Icon name="time-outline" size={16} color="var(--ink2)" />
                <Text variant="small" tone="ink2" raw>
                  {`Collection ${relativeDay(booking.startDate).toLowerCase()}. The business will confirm exactly where through SXM Rentals messages.`}
                </Text>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
