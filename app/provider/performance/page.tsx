'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: How each vehicle is doing — what it earns, how often it
// is out, and how many people have asked about it.
//
// ---- WHAT THE NUMBERS COVER ----
//
// The backend counts bookings that ended in the last 90 days and every booking
// still to come, so "your share" includes rentals that have not happened yet.
// The page says so at the top rather than calling it money earned.
//
// There is no "enquiries converted" rate. The backend counts enquiries (every
// conversation about a car, ever) and bookings (that window) separately, and
// most bookings never begin with a conversation — so one divided by the other
// came out at 300%. The two counts are shown side by side instead.
//
// ENQUIRIES ARE COUNTS ONLY. A business sees "14 enquiries, 6 bookings" and
// never who the fourteen people were. That is the same rule as everywhere else
// in the portal: performance numbers yes, customer records no. Full booking
// detail lives in the admin panel, with SXM Rentals staff.
//
// WHY OCCUPANCY IS WORTH SHOWING NEXT TO REVENUE: a car earning less than
// another might simply be cheaper and busier, which is a completely different
// problem from one nobody is booking. The two numbers together say which.

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useFleetLookup } from '@/hooks/useFleet';
import { money, perDay } from '@/lib/format';
import {
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  Text,
} from '@/components/ui';
import { StatTile, RankedBar, PercentBar } from '@/components/business/Stats';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderPerformancePage() {
  const { t } = useTranslation();
  const { data: rows, loading, error, refresh } = useAsyncData(
    () => apiClient.getFleetPerformance(),
    [],
  );
  // Car names and rates, from the business's own fleet — see hooks/useFleet.ts.
  const cars = useFleetLookup();

  if (loading || cars.loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={34} width="35%" />
        <Skeleton height={112} radius="var(--radius-lg)" />
        <Skeleton height={320} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title={t('pp.perf.emptyTitle')}
        body={t('pp.perf.emptyBody')}
        icon="flash-outline"
        actionLabel={t('pp.import.seeFleet')}
        actionHref="/provider/fleet"
      />
    );
  }

  const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const totalBookings = rows.reduce((sum, row) => sum + row.bookings, 0);
  const totalInquiries = rows.reduce((sum, row) => sum + row.inquiries, 0);
  const averageOccupancy =
    rows.reduce((sum, row) => sum + row.occupancyRate, 0) / rows.length;

  // The one earning least, which is usually the useful thing to look at.
  const weakest = [...rows].sort((a, b) => a.revenue - b.revenue)[0];
  const weakestVehicle = weakest ? cars.vehicle(weakest.vehicleId) : undefined;

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('web.provider.performance')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.perf.intro')}
          </Text>
        </div>
      </div>

      <div className={styles.statGrid}>
        <StatTile
          label={t('pp.perf.youEarned')}
          value={money(totalRevenue)}
          icon="card-outline"
          note={t('pp.perf.afterCommission')}
        />
        <StatTile
          label={t('pp.perf.bookings')}
          value={String(totalBookings)}
          icon="calendar-outline"
          note={t('pp.perf.acrossFleet')}
        />
        <StatTile
          label={t('pp.perf.occupancy')}
          value={`${Math.round(averageOccupancy * 100)}%`}
          icon="time-outline"
          note={t('pp.perf.daysOut')}
        />
        <StatTile
          label={t('pp.perf.enquiries')}
          value={String(totalInquiries)}
          icon="chatbubble-outline"
          note={t('pp.perf.enquiriesNote')}
        />
      </div>

      <div className={styles.dashboardGrid}>
        {/* ---- WHAT EACH CAR EARNS ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.perf.revenueByVehicle')}
          </Text>

          <RankedBar
            items={rows.map((row) => {
              return {
                label: cars.name(row.vehicleId),
                value: row.revenue,
                sublabel: `${row.bookings} bookings`,
              };
            })}
          />
        </Card>

        {/* ---- HOW OFTEN EACH IS OUT ---- */}
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.perf.occupancyByVehicle')}
          </Text>

          <div className={styles.stack}>
            {rows.map((row) => {
              return (
                <PercentBar
                  key={row.vehicleId}
                  label={cars.name(row.vehicleId)}
                  value={row.occupancyRate}
                  tone={row.occupancyRate > 0.6 ? 'success' : row.occupancyRate > 0.3 ? 'brand' : 'warning'}
                />
              );
            })}
          </div>
        </Card>
      </div>

      {/* ---- THE FULL TABLE ---- */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="sr-only">
            {t('pp.perf.perVehicleNote')}
          </caption>

          <thead>
            <tr>
              <th scope="col">Vehicle</th>
              <th scope="col" className={styles.numeric}>
                Daily rate
              </th>
              <th scope="col" className={styles.numeric}>
                {t('web.provider.bookings')}
              </th>
              <th scope="col" className={styles.numeric}>
                Occupancy
              </th>
              <th scope="col" className={styles.numeric}>
                Enquiries
              </th>
              <th scope="col" className={styles.numeric}>
                {t('pp.fleet.youEarned')}
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const vehicle = cars.vehicle(row.vehicleId);

              return (
                <tr key={row.vehicleId}>
                  <td>
                    {vehicle ? (
                      <Link href={`/provider/fleet/${vehicle.id}`}>
                        <Text variant="label" as="span" raw>
                          {`${vehicle.make} ${vehicle.model}`}
                        </Text>
                      </Link>
                    ) : (
                      <Text variant="label" as="span" raw>
                        {cars.name(row.vehicleId)}
                      </Text>
                    )}
                  </td>

                  <td className={styles.numeric}>
                    <Text variant="body" tone="ink2" as="span" raw>
                      {vehicle ? perDay(vehicle.dailyRate) : '—'}
                    </Text>
                  </td>

                  <td className={styles.numeric}>
                    <Text variant="body" as="span" raw>
                      {String(row.bookings)}
                    </Text>
                  </td>

                  <td className={styles.numeric}>
                    <Text variant="body" as="span" raw>
                      {`${Math.round(row.occupancyRate * 100)}%`}
                    </Text>
                  </td>

                  <td className={styles.numeric}>
                    <Text variant="body" tone="ink2" as="span" raw>
                      {String(row.inquiries)}
                    </Text>
                  </td>


                  <td className={styles.numeric}>
                    <Text variant="label" as="span" raw>
                      {money(row.revenue)}
                    </Text>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---- SOMETHING WORTH LOOKING AT ---- */}
      {weakest && weakestVehicle ? (
        <Card padded>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="bulb-outline" size={18} color="var(--warning)" />
            <div>
              <Text variant="label" as="h2" raw>
                {t('pp.perf.worthALook')}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {`Your ${weakestVehicle.make} ${weakestVehicle.model} is out ${Math.round(
                  weakest.occupancyRate * 100,
                )}% of the time, with ${money(
                  weakest.revenue,
                )} as your share. If people ask about it but do not book, the price or the minimum rental length is usually the reason.`}
              </Text>
            </div>
          </div>
        </Card>
      ) : null}

      {/* ---- WHY THE ENQUIRY NUMBERS ARE COUNTS ONLY ---- */}
      <Card padded>
        <div className={styles.privacyNote}>
          <Icon name="lock-closed-outline" size={20} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h2" raw>
              {t('pp.perf.countsNotPeople')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('pp.perf.countsBody')}
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}
