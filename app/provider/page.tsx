'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The business dashboard — money paid out, money still to
// come, what is happening today, and which cars are earning.
//
// EVERY MONEY FIGURE ON THIS PAGE IS THE BUSINESS'S OWN SHARE, after SXM Rentals
// has taken its commission. That is the rule across the whole provider portal:
// nothing here shows a gross figure on its own and lets a business believe it is
// theirs. Where a gross number appears it is always beside the commission and
// the net, so the deduction can be checked rather than taken on trust.
//
// SECURITY DEPOSITS ARE NOWHERE ON THIS PAGE, and that is not an oversight. A
// deposit is held against a customer's card and given back to them. It is never
// the business's money, no commission is taken from it, and it never appears in
// a payout — so putting it into a revenue dashboard would misrepresent it twice
// over.
//
// ---- ENQUIRIES AND BOOKINGS ARE TWO COUNTS, NOT A CONVERSION RATE ----
//
// This panel used to show "enquiries that became bookings" as a percentage.
// The backend counts the two separately — every conversation a renter has ever
// started, and the bookings from the last 90 days onward — and most bookings
// never start with a conversation at all, so dividing one by the other gave
// numbers like 300%. The two counts are shown side by side instead, each
// labelled with what it actually counts.

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useFleetLookup } from '@/hooks/useFleet';
import { COMMISSION_RATE } from '@/lib/constants';
import { money, longDate, dateRange, relativeDay } from '@/lib/format';
import { useBusiness } from '@/lib/business';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import { StatTile, RankedBar, EarningsSplit } from '@/components/business/Stats';
import styles from './provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderDashboardPage() {
  const { t } = useTranslation();
  const { provider } = useBusiness();

  const summary = useAsyncData(() => apiClient.getBusinessSummary(), []);
  const bookings = useAsyncData(() => apiClient.getProviderBookings(), []);
  const performance = useAsyncData(() => apiClient.getFleetPerformance(), []);
  // Car names, from the business's own fleet — see hooks/useFleet.ts.
  const cars = useFleetLookup();

  // Anything still loading holds the whole dashboard, since a page of numbers
  // half-arrived is harder to read than one that says it is still working.
  if (summary.loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={34} width="40%" />
        <div className={styles.statGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={112} radius="var(--radius-lg)" />
          ))}
        </div>
        <Skeleton height={280} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (summary.error) {
    return <ErrorState message={summary.error} onRetry={summary.refresh} />;
  }

  if (!summary.data) {
    return <ErrorState onRetry={summary.refresh} />;
  }

  const data = summary.data;

  // The bookings that need attention today, rather than the whole list —
  // soonest first. The backend sends them latest first, which put next year's
  // booking above tomorrow's.
  const soon = (bookings.data ?? [])
    .filter((booking) => booking.status === 'upcoming' || booking.status === 'active')
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5);

  // Only cars that have brought something in. The backend lists every car,
  // including the ones at $0, and a chart of noughts is not "best earning".
  const earning = (performance.data ?? []).filter((row) => row.revenue > 0);

  // What the pending payout is worth, shown with its commission alongside.
  //
  // ---- THESE TWO ARE WORKED BACKWARDS, AND THAT IS A KNOWN PROBLEM ----
  //
  // /providers/me/summary reports only the net — what will land in the
  // business's account. Rule 3 says a business must see all three numbers
  // together, so the gross and the commission are reconstructed here from the
  // rate we hold a copy of. See the warning in lib/constants.ts: this is the
  // one calculation that file says not to do.
  //
  // It is done anyway because the alternative is worse. Showing the net alone
  // gives a business no way to check the deduction, which is the entire point
  // of the rule. So the figures are shown, and the shortcut is written down
  // here rather than hidden.
  //
  // WHAT MAKES IT RIGHT: the backend returning `pendingGross` and
  // `pendingCommission` on the summary, the way every individual payout
  // already carries them. Filed as a backend ask in
  // docs/backend-asks.md. Until then, if the rate the backend bills
  // at ever differs from the copy here, these two numbers are wrong and the
  // net beside them is right.
  const pendingGross = data.pending > 0 ? data.pending / (1 - COMMISSION_RATE) : 0;
  const pendingCommission = pendingGross - data.pending;

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('web.provider.overview')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {provider ? provider.businessName : 'Your rental business'} — everything below
            is your share, after commission.
          </Text>
        </div>

        <div className={styles.headActions}>
          <Button label="Add a vehicle" href="/provider/fleet/add" size="sm" />
          <Button label={t('pp.seeBookings')} href="/provider/bookings" variant="outline" size="sm" />
        </div>
      </div>

      {/* ---- THE HEADLINE NUMBERS ---- */}
      <div className={styles.statGrid}>
        <StatTile
          label={t('pp.paidToDate')}
          value={money(data.paidOut)}
          icon="card-outline"
          note={t('pp.yourShareAfter')}
        />
        <StatTile
          label={t('pp.nextPayout')}
          value={money(data.pending)}
          icon="time-outline"
          note={`Due ${longDate(data.nextPayoutDate)}`}
          noteTone="success"
        />
        <StatTile
          label={t('acct.status.outNow')}
          value={String(data.activeBookings)}
          icon="car-outline"
          note={`${data.upcomingBookings} more coming up`}
        />
        <StatTile
          label={t('pp.fleet')}
          value={String(data.fleetSize)}
          icon="business-outline"
          note={
            data.averageRating > 0
              ? `Rated ${data.averageRating.toFixed(1)} on average`
              : 'No ratings yet'
          }
        />
      </div>

      <div className={styles.dashboardGrid}>
        {/* ---- THE NEXT PAYOUT, BROKEN DOWN ---- */}
        <Card padded>
          <div className={styles.pageHead} style={{ marginBottom: 'var(--space-lg)' }}>
            <Text variant="label" as="h2" raw>
              {t('pp.yourNextPayout')}
            </Text>
            <StatusPill label={t('pp.pending')} tone="warning" />
          </div>

          <EarningsSplit
            gross={Math.round(pendingGross)}
            commission={Math.round(pendingCommission)}
            net={data.pending}
            title={`Due ${longDate(data.nextPayoutDate)}`}
          />

          <div className={styles.note} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="shield-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3">
              Security deposits are not part of this. They are held against the customer&rsquo;s
              card and returned to them, and no commission is taken from them.
            </Text>
          </div>

          <div style={{ marginTop: 'var(--space-lg)' }}>
            <Button label={t('pp.allPayouts')} href="/provider/payouts" variant="outline" size="sm" />
          </div>
        </Card>

        {/* ---- WHICH CARS ARE EARNING ---- */}
        <Card padded>
          <div className={styles.pageHead} style={{ marginBottom: 'var(--space-lg)' }}>
            <Text variant="label" as="h2" raw>
              {t('pp.bestEarning')}
            </Text>
            <Button
              label={t('web.provider.performance')}
              href="/provider/performance"
              variant="ghost"
              size="sm"
            />
          </div>

          {performance.loading || cars.loading ? (
            <Skeleton height={180} radius="var(--radius-md)" />
          ) : performance.error ? (
            <ErrorState message={performance.error} onRetry={performance.refresh} inline />
          ) : earning.length === 0 ? (
            <Text variant="small" tone="ink2" raw>
              {t('pp.noEarnings')}
            </Text>
          ) : (
            <RankedBar
              items={earning.slice(0, 5).map((row) => {
                return {
                  label: cars.name(row.vehicleId),
                  value: row.revenue,
                  sublabel: `${row.bookings} bookings · ${Math.round(
                    row.occupancyRate * 100,
                  )}% occupancy`,
                };
              })}
            />
          )}

          <div className={styles.note} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('pp.revenueIsShare')}
            </Text>
          </div>
        </Card>

        {/* ---- ENQUIRIES TURNING INTO BOOKINGS ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.enquiriesAndBookings')}
          </Text>

          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.enquiriesCount')}
              </Text>
              <Text variant="label" as="span" raw>
                {String(data.totalInquiries)}
              </Text>
            </div>
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.recentBookings')}
              </Text>
              <Text variant="label" as="span" raw>
                {String(data.totalConversions)}
              </Text>
            </div>
          </div>

          <div className={styles.note} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('pp.countsOnly')}
            </Text>
          </div>
        </Card>

        {/* ---- WHAT NEEDS ATTENTION ----
            Given the full width of the dashboard, since four columns do not fit
            in half of one. */}
        <Card padded className={styles.spanFull}>
          <div className={styles.pageHead} style={{ marginBottom: 'var(--space-lg)' }}>
            <Text variant="label" as="h2" raw>
              {t('pp.comingUp')}
            </Text>
            <Button label={t('pp.allBookings')} href="/provider/bookings" variant="ghost" size="sm" />
          </div>

          {bookings.loading || cars.loading ? (
            <Skeleton height={180} radius="var(--radius-md)" />
          ) : bookings.error ? (
            <ErrorState message={bookings.error} onRetry={bookings.refresh} inline />
          ) : soon.length === 0 ? (
            <EmptyState
              title={t('acct.rentals.noneTitle')}
              body={t('pp.bookings.emptyBody')}
              icon="calendar-outline"
            />
          ) : (
            /* A real table with its own Status column. As a two-sided row the
               status pill and the date were sharing one cramped right-hand
               edge, so "OUT NOW" and "3 days ago" ran into each other. Columns
               give each piece its own place and line the statuses up down the
               page, which is the whole point of glancing at this panel. */
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption className="sr-only">
                  {t('pp.comingUpNote')}
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Vehicle</th>
                    <th scope="col">Renter</th>
                    <th scope="col">Dates</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {soon.map((booking) => {
                    return (
                      <tr key={booking.id}>
                        <td>
                          <Link href={`/provider/bookings/${booking.id}`}>
                            <Text variant="label" as="span" raw>
                              {cars.name(booking.vehicleId)}
                            </Text>
                          </Link>
                        </td>

                        <td>
                          {/* A first name and last initial. That is all a
                              business is given, and all it needs to hand over
                              a car. */}
                          <Text variant="body" as="span" raw>
                            {booking.renterDisplayName}
                          </Text>
                        </td>

                        <td>
                          <Text variant="body" as="span" raw>
                            {dateRange(booking.startDate, booking.endDate)}
                          </Text>
                          <Text variant="caption" tone="ink3" raw>
                            {relativeDay(booking.startDate)}
                          </Text>
                        </td>

                        <td>
                          <StatusPill
                            label={booking.status === 'active' ? 'OUT NOW' : 'UPCOMING'}
                            tone={booking.status === 'active' ? 'success' : 'brand'}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
