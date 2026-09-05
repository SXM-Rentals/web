// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Editing a vehicle already listed. It finds the vehicle
// and hands it to the same form used for adding one, so the two can never end up
// offering different fields.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findVehicle } from '@/lib/mock/vehicles';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { Button, Text } from '@/components/ui';
import { VehicleForm } from '@/components/business/VehicleForm';
import styles from '../../provider.module.css';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = findVehicle(id);
  return { title: vehicle ? `Edit ${vehicle.make} ${vehicle.model}` : 'Vehicle not found' };
}

export default async function EditVehiclePage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

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
