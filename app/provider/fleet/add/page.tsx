// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The four ways a business can get its vehicles onto SXM
// Rentals, so it can pick whichever suits the size and shape of its operation.
//
// WHY FOUR RATHER THAN ONE: a business with three cars and a business with sixty
// have completely different problems. Making the sixty-car company type each one
// into a form is how they decide not to bother, and lowering that barrier is the
// whole point of the API-first idea in the Overview document — existing rental
// companies should be able to join without feeling replaced or re-typing their
// entire inventory.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { Card, ComingSoonBadge, Icon, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import styles from '../../provider.module.css';

export const metadata: Metadata = {
  title: 'Add Vehicles',
};

const ROUTES: {
  href: string;
  title: string;
  blurb: string;
  best: string;
  icon: IconName;
  available: boolean;
}[] = [
  {
    href: '/provider/fleet/new',
    title: 'Add one vehicle',
    blurb:
      'Fill in a form: photos, the price, how long it can be rented for, the deposit, and anything declared about its history.',
    best: 'Best for a handful of vehicles, or adding one to a fleet already listed.',
    icon: 'add',
    available: true,
  },
  {
    href: '/provider/fleet/import',
    title: 'Upload a spreadsheet',
    blurb:
      'Drag in a spreadsheet and see every row read back before anything is saved. Rows with something wrong are shown with the reason, and can be fixed on screen.',
    best: 'Best for getting an existing fleet onto the platform in one go.',
    icon: 'cloud-upload-outline',
    available: true,
  },
  {
    href: '/provider/fleet/api',
    title: 'Connect your own system',
    blurb:
      'If you already run booking software, connect it directly. Your inventory and availability stay in one place instead of being kept up to date twice.',
    best: 'Best for a business with its own booking system it intends to keep.',
    icon: 'flash-outline',
    available: true,
  },
  {
    href: '/provider/fleet/add',
    title: 'Send it to us',
    blurb:
      'Send a list in whatever form you have it — a photo of a whiteboard, an email, a PDF — and SXM Rentals staff put it in for you.',
    best: 'Best if your records are not in a spreadsheet at all.',
    icon: 'mail-outline',
    available: false,
  },
];

export default function AddVehiclePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Fleet', href: '/provider/fleet' },
          { label: 'Add vehicles' },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1">
            Add vehicles
          </Text>
          <Text variant="body" tone="ink2">
            Four ways to do it. There is no limit on how many vehicles you can list.
          </Text>
        </div>
      </div>

      <div className={styles.routeGrid}>
        {ROUTES.map((route) =>
          route.available ? (
            <Link key={route.title} href={route.href} className={styles.route}>
              <span className={styles.routeIcon}>
                <Icon name={route.icon} size={22} />
              </span>

              <Text variant="h3" as="h2">
                {route.title}
              </Text>
              <Text variant="small" tone="ink2" as="span">
                {route.blurb}
              </Text>
              <Text variant="caption" tone="ink3" as="span" style={{ marginTop: 'auto' }}>
                {route.best}
              </Text>
            </Link>
          ) : (
            // Not built yet, and drawn so it plainly is not — rather than
            // looking normal and doing nothing when clicked.
            <div
              key={route.title}
              className={styles.route}
              style={{ opacity: 0.65, borderStyle: 'dashed' }}
            >
              <span className={styles.routeIcon}>
                <Icon name={route.icon} size={22} />
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <Text variant="h3" as="h2">
                  {route.title}
                </Text>
                <ComingSoonBadge />
              </span>

              <Text variant="small" tone="ink3" as="span">
                {route.blurb}
              </Text>
              <Text variant="caption" tone="ink3" as="span" style={{ marginTop: 'auto' }}>
                {route.best}
              </Text>
            </div>
          ),
        )}
      </div>

      <Card padded>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="shield-checkmark-outline" size={18} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h2">
              What happens after you add one
            </Text>
            <Text variant="small" tone="ink2">
              Nothing goes live immediately. SXM Rentals staff check the registration and
              insurance documents for each vehicle before it appears to customers — that
              check is what the SXM Verified badge on your listings actually stands for.
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}
