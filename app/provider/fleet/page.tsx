'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every vehicle this business has listed, with what each
// one earns and how often it is out.
//
// THERE IS NO LIMIT ON FLEET SIZE. More listings mean more bookings, and every
// booking earns the platform its commission, so there is no reason to cap this.
// A business with two cars and a business with sixty use the same page.
//
// Revenue shown per vehicle is the business's own share after commission, in
// line with every other figure in the portal.

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { performanceForVehicle } from '@/lib/mock/business';
import { money, perDay, vehicleClassLabels } from '@/lib/format';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  PhotoPlaceholder,
  Skeleton,
  StarRow,
  StatusPill,
  Text,
} from '@/components/ui';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderFleetPage() {
  const { t } = useTranslation();
  const { data: fleet, loading, error, refresh } = useAsyncData(
    () => apiClient.getMyFleet(),
    [],
  );

  const renderBody = () => {
    if (loading) {
      return (
        <div className={styles.fleetGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={260} radius="var(--radius-lg)" />
          ))}
        </div>
      );
    }

    if (error) return <ErrorState message={error} onRetry={refresh} />;

    if (!fleet || fleet.length === 0) {
      return (
        <EmptyState
          title={t('pp.fleet.emptyTitle')}
          body={t('pp.fleet.emptyBody')}
          icon="car-outline"
          actionLabel="Add a vehicle"
          actionHref="/provider/fleet/add"
        />
      );
    }

    return (
      <div className={styles.fleetGrid}>
        {fleet.map((vehicle) => {
          const performance = performanceForVehicle(vehicle.id);

          return (
            <Card key={vehicle.id} padded={false} flush>
              <PhotoPlaceholder shape="wide" iconSize={40} />

              <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div>
                  <Text variant="label" as="h2" raw>
                    <Link href={`/provider/fleet/${vehicle.id}`}>
                      {`${vehicle.make} ${vehicle.model}`}
                    </Link>
                  </Text>
                  <Text variant="small" tone="ink3" raw>
                    {`${vehicle.year} · ${vehicleClassLabels[vehicle.vehicleClass]} · ${vehicle.seats} seats`}
                  </Text>
                </div>

                <StarRow rating={vehicle.rating} reviewCount={vehicle.reviewCount} size={13} />

                <div className={styles.infoRow}>
                  <Text variant="small" tone="ink2" as="span" raw>
                    {t('pp.fleet.yourRate')}
                  </Text>
                  <Text variant="label" as="span" raw>
                    {perDay(vehicle.dailyRate)}
                  </Text>
                </div>

                <div className={styles.infoRow}>
                  <Text variant="small" tone="ink2" as="span">
                    Deposit
                  </Text>
                  <Text variant="small" as="span" raw>
                    {money(vehicle.depositAmount)}
                  </Text>
                </div>

                {performance ? (
                  <div className={styles.infoRow}>
                    <Text variant="small" tone="ink2" as="span" raw>
                      {t('pp.fleet.youEarned')}
                    </Text>
                    <Text variant="label" as="span" tone="success" raw>
                      {money(performance.revenue)}
                    </Text>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  {vehicle.deliveryAvailable ? (
                    <StatusPill label={t('pp.fleet.delivers')} tone="success" dot={false} />
                  ) : null}
                  {vehicle.accidentHistory.length > 0 ? (
                    <StatusPill label={t('pp.fleet.historyDeclared')} tone="warning" dot={false} />
                  ) : null}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                  <Button
                    label={t('pp.fleet.edit')}
                    href={`/provider/fleet/${vehicle.id}`}
                    variant="secondary"
                    size="sm"
                  />
                  <Button
                    label={t('pp.fleet.viewListing')}
                    href={`/vehicles/${vehicle.id}`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('pp.apply.yourFleet')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {fleet
              ? `${fleet.length} ${fleet.length === 1 ? 'vehicle' : 'vehicles'} listed. There is no limit on how many you can add.`
              : 'Everything you have listed on SXM Rentals.'}
          </Text>
        </div>

        <div className={styles.headActions}>
          <Button label="Add a vehicle" href="/provider/fleet/add" size="sm" />
          <Button
            label={t('pp.import.title')}
            href="/provider/fleet/import"
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      {renderBody()}

      <Card padded>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="information-circle-outline" size={16} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.fleet.earningsNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
