'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One rental in full — the car, the dates, where to collect
// it, what it costs, where the deposit has got to, and the signed agreement.
//
// IT IS ALSO THE PAGE PEOPLE PRINT. A receipt and a signed agreement are things
// somebody takes to a rental counter or files with an expense claim, so the
// navigation, the footer and the buttons are all marked to disappear when
// printed, leaving just the rental itself on the paper.

import React, { use } from 'react';
import { useBooking, useCarName } from '@/hooks/useBookings';
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

// How the booking's own status is labelled — the same words as the rentals
// list, so a cancelled rental reads as cancelled here too. Without this the
// page of a cancelled booking looked exactly like a live one.
const STATUS_LOOK: Record<string, { label: string; tone: 'neutral' | 'success' | 'danger' | 'brand' }> = {
  upcoming: { label: 'UPCOMING', tone: 'brand' },
  active: { label: 'OUT NOW', tone: 'success' },
  completed: { label: 'COMPLETED', tone: 'neutral' },
  cancelled: { label: 'CANCELLED', tone: 'danger' },
};

const DEPOSIT_EXPLAINER: Record<string, string> = {
  // Every real booking sits here for now: SXM Rentals cannot hold a deposit
  // until payments are connected, so nothing is set aside automatically.
  not_taken:
    'Nothing has been set aside. SXM Rentals does not hold deposits yet — the rental business arranges it with you when you collect the car.',
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

  // The booking, with its car and business — see hooks/useBookings.ts.
  const { booking, vehicle, provider, lookedUp, loading, error, refresh } = useBooking(id);
  const carName = useCarName();

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
            {carName(vehicle, lookedUp)}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {`${booking.reference} · ${dateRange(booking.startDate, booking.endDate)}`}
          </Text>
          <div>
            <StatusPill label={STATUS_LOOK[booking.status].label} tone={STATUS_LOOK[booking.status].tone} />
          </div>
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
                    {/* Into this rental's own conversation, starting it if
                        there is none yet — see message/page.tsx. */}
                    <Button
                      label={t('acct.rental.messageBusiness')}
                      href={`/account/rentals/${booking.id}/message`}
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

            {/* ---- A CANCELLED RENTAL'S DEPOSIT ----
                The backend marks the deposit "released" when a booking is
                cancelled, whether or not a hold was ever placed. So "returned —
                the hold has been lifted" could describe a hold that never
                existed. For a cancelled rental the panel says what is true
                either way. (Filed in docs/backend-asks.md.) */}
            {booking.status === 'cancelled' ? (
              <>
                <div className={styles.infoRow}>
                  <Text variant="h3" as="span" raw>
                    {money(booking.depositAmount)}
                  </Text>
                  <StatusPill label="NOT HELD" tone="neutral" />
                </div>
                <Divider style={{ marginBlock: 'var(--space-md)' }} />
                <Text variant="small" tone="ink2">
                  No deposit is held for a cancelled rental. If one was held before it was
                  cancelled, the hold has been lifted — your bank may take a few working
                  days to show the money as available again.
                </Text>
              </>
            ) : (
              <>
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
              </>
            )}
          </Card>

          {/* The bill. The deposit is passed separately and is never inside the
              total — that rule lives in PriceBreakdown. */}
          <PriceBreakdown
            title={t('acct.rental.price')}
            lines={booking.lines}
            depositAmount={booking.depositAmount}
            depositHeld={booking.depositStatus === 'held'}
          />

          {booking.status === 'upcoming' ? (
            <Card data-print="hide">
              <div className={styles.note}>
                <Icon name="time-outline" size={16} color="var(--ink2)" />
                <Text variant="small" tone="ink2" raw>
                  {`Collection ${relativeDay(booking.startDate).toLowerCase()}. To confirm exactly where, message the business through SXM Rentals.`}
                </Text>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
