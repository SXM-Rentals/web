// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A rental business's public page — who they are, where
// they operate, whether they deliver, and every car they have listed.
//
// WHAT THIS PAGE CAN AND CANNOT SEE, which is the important part: it reads from
// the "Provider" record, which holds ONLY the things a customer is allowed to
// see. The private half of a business — its earnings, its payouts, its booking
// counts — lives on a completely separate record called BusinessProfile, which
// this page has no access to. That separation is what guarantees this page
// cannot leak a business's takings, even by accident: the numbers are not
// merely hidden here, they were never handed to it.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProvider } from '@/lib/mock/providers';
import { mockVehicles } from '@/lib/mock/vehicles';
import { longDate, sideLabels } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, Card, EmptyState, Icon, StarRow, StatusPill, Text } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { VerifiedBadge } from '@/components/vehicle/VerifiedBadge';
import { JsonLd } from '@/components/seo/JsonLd';
import { canonical, jsonLdProvider, jsonLdBreadcrumbs } from '@/lib/seo';
import styles from './provider.module.css';
import { T } from '@/components/i18n/T';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const provider = findProvider(id);
  if (!provider) return { title: 'Rental business not found' };

  return {
    alternates: canonical(`/providers/${provider.id}`),
    title: provider.businessName,
    description: `${provider.businessName} rents cars from ${provider.town}, ${
      sideLabels[provider.side]
    }. Rated ${provider.rating.toFixed(1)} from ${provider.reviewCount} reviews on SXM Rentals.`,
  };
}

export default async function ProviderPage({ params }: PageProps) {
  const { id } = await params;
  const provider = findProvider(id);
  if (!provider) notFound();

  // Every car this business has listed.
  const fleet = mockVehicles.filter((vehicle) => vehicle.providerId === provider.id);

  return (
    <div className="container">
      {/* Read by search engines only. Somebody who has heard this business's
          name and is checking whether it is real should find this page, with
          its rating and its town attached. */}
      <JsonLd
        data={[
          jsonLdProvider(provider),
          jsonLdBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Find a Car', href: '/search' },
            { label: provider.businessName },
          ]),
        ]}
      />

      <PageHeader
        title={provider.businessName}
        crumbs={[
          { labelKey: 'web.nav.home', href: '/' },
          { labelKey: 'search.title', href: '/search' },
          { label: provider.businessName },
        ]}
      />

      <div className={styles.layout}>
        {/* ---- WHO THEY ARE ---- */}
        <Card padded className={styles.about}>
          <div className={styles.identity}>
            <Avatar name={provider.businessName} size={64} tone="brand" />

            <div className={styles.identityBody}>
              <span className={styles.nameRow}>
                <Text variant="h3" as="h2" raw>
                  {provider.businessName}
                </Text>
                {provider.isVerified ? <VerifiedBadge variant="row" /> : null}
              </span>

              <StarRow rating={provider.rating} reviewCount={provider.reviewCount} />
            </div>
          </div>

          <Text variant="body" tone="ink2">
            {provider.description}
          </Text>

          <div className={styles.facts}>
            <span className={styles.fact}>
              <Icon name="location-outline" size={16} />
              <Text variant="small" tone="ink2" as="span" raw>
                {`${provider.town}, ${sideLabels[provider.side]}`}
              </Text>
            </span>

            <span className={styles.fact}>
              <Icon name="time-outline" size={16} />
              <Text variant="small" tone="ink2" as="span">
                {provider.respondsIn}
              </Text>
            </span>

            <span className={styles.fact}>
              <Icon name="calendar-outline" size={16} />
              <Text variant="small" tone="ink2" as="span" raw>
                {`On SXM Rentals since ${longDate(provider.memberSince)}`}
              </Text>
            </span>
          </div>

          <div className={styles.badges}>
            {provider.deliversVehicles ? (
              <StatusPill label={<T k="provider.deliversVehicles" />} tone="success" />
            ) : null}
            {provider.airportPickup ? (
              <StatusPill label={<T k="provider.airportCollection" />} tone="success" />
            ) : null}
          </div>

          {/* Contact happens through the app's own messaging, which is why no
              phone number or email is offered as a way to arrange a rental
              directly. */}
          <div className={styles.contactNote}>
            <Icon name="chatbubble-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3">
              Message this business through SXM Rentals once you have a booking. Keeping
              it on the platform is what makes the deposit, the agreement and any dispute
              something we can actually help with.
            </Text>
          </div>
        </Card>

        {/* ---- THEIR CARS ---- */}
        <div className={styles.fleet}>
          <Text variant="h3" as="h2">
            {`Their cars (${fleet.length})`}
          </Text>

          {fleet.length > 0 ? (
            <div className={styles.fleetGrid}>
              {fleet.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} showDeposit />
              ))}
            </div>
          ) : (
            <EmptyState
              title={<T k="provider.noCarsTitle" />}
              body="This business has no vehicles available at the moment. They may be adding some, or everything may currently be out on rental."
              icon="car-outline"
              actionLabel="Browse other cars"
              actionHref="/search"
            />
          )}
        </div>
      </div>
    </div>
  );
}
