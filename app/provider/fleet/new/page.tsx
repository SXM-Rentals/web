// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Adding a single vehicle by filling in a form. The form
// itself lives in components/business/VehicleForm.tsx, because adding a vehicle
// and editing one need exactly the same fields — keeping them as one form is
// what stops the two quietly drifting apart.

import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { Text } from '@/components/ui';
import { VehicleForm } from '@/components/business/VehicleForm';
import styles from '../../provider.module.css';

export const metadata: Metadata = {
  title: 'Add a Vehicle',
};

export default function NewVehiclePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Fleet', href: '/provider/fleet' },
          { label: 'Add a vehicle' },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1">
            Add a vehicle
          </Text>
          <Text variant="body" tone="ink2">
            It goes live once SXM Rentals has checked its registration and insurance
            documents.
          </Text>
        </div>
      </div>

      <VehicleForm />
    </>
  );
}
