'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Editing a vehicle already listed. It fetches the vehicle
// and hands it to the same form used for adding one, so the two can never end
// up offering different fields.
//
// ---- WHY THIS RUNS IN THE BROWSER, WHEN IT USED TO RUN ON THE SERVER ----
//
// It was the only page in the business dashboard built on the server. That was
// harmless while the car came from a file sitting in memory. It stopped being
// harmless the moment the car had to be fetched: a page built on the server
// that needs a signed-in session has to forward the session cookie, and a page
// that varies by who is asking must never be cached — get that pairing wrong
// once and one business is served a page built for another.
//
// Every other page in this dashboard already runs in the browser, where the
// session cookie goes with each request on its own and there is nothing to
// cache. Making this one match removes the whole class of mistake for the sake
// of one page's server rendering, which bought nothing here: the dashboard is
// noindex, so no crawler was ever going to read it.
//
// The page title is now the layout's default, "Business Dashboard", which is
// what every other page in this section already shows. A client page cannot
// export its own, and the layout says so in the same words.

import React, { use } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { Button, EmptyState, ErrorState, Skeleton, Text } from '@/components/ui';
import { VehicleForm } from '@/components/business/VehicleForm';
import styles from '../../provider.module.css';

type PageProps = { params: Promise<{ id: string }> };

export default function EditVehiclePage({ params }: PageProps) {
  const { id } = use(params);

  const { data: vehicle, loading, error, refresh } = useAsyncData(
    (signal) => apiClient.getVehicle(id, { signal }),
    [id],
  );

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="40%" />
        <Skeleton height={320} radius="var(--radius-lg)" />
      </div>
    );
  }

  // A failure and a car that is not there are different things, and they get
  // different answers. This one means we could not find out — so it offers to
  // try again rather than claiming the car is gone.
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!vehicle) {
    return (
      <EmptyState
        title="That vehicle is not listed"
        body="It may have been removed. Your other vehicles are still on the fleet page."
        icon="car-outline"
        actionLabel="Back to the fleet"
        actionHref="/provider/fleet"
      />
    );
  }

  const name = `${vehicle.make} ${vehicle.model}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Fleet', href: '/provider/fleet' },
          { label: name },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {name}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {`${vehicle.year} · ${vehicle.pickupTown}`}
          </Text>
        </div>

        <div className={styles.headActions}>
          <Button
            label="View the public listing"
            href={`/vehicles/${vehicle.id}`}
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <VehicleForm vehicle={vehicle} />
    </>
  );
}
