// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A single car's page — the photos, everything about the
// car, the business renting it out, the security deposit, the accident history,
// the reviews, and the panel that starts a booking.
//
// THIS PAGE IS BUILT ON THE SERVER, and it is one of the two most important
// pages on the site for being found at all. Someone searching for "rent a jeep
// in Simpson Bay" should land here. A page assembled in the browser after the
// fact is far weaker in search results, so the wording, the price and the
// description all arrive as finished HTML.
//
// IT WORKS SIGNED OUT. The whole page is readable with no account. The only
// thing that needs one is the Book button, and that asks at the point it is
// pressed rather than blocking the page.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findVehicle } from '@/lib/mock/vehicles';
import { findProvider } from '@/lib/mock/providers';
import { reviewsForVehicle } from '@/lib/mock/reviews';
import {
  money,
  sideLabels,
  vehicleClassLabels,
  transmissionLabels,
} from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import { Button, Card, Divider, Icon, PhotoPlaceholder, StarRow, Text } from '@/components/ui';
import { BookingPanel } from '@/components/vehicle/BookingPanel';
import { ReviewCard } from '@/components/vehicle/ReviewCard';
import {
  AccidentBlock,
  DepositBlock,
  FeatureGrid,
  ProviderRow,
  RentalPeriod,
} from '@/components/vehicle/VehicleDetails';
import { JsonLd } from '@/components/seo/JsonLd';
import { canonical, jsonLdVehicle, jsonLdBreadcrumbs } from '@/lib/seo';
import styles from './vehicle.module.css';
import { T } from '@/components/i18n/T';

type PageProps = { params: Promise<{ id: string }> };

// ---- WHAT SEARCH ENGINES AND SHARED LINKS SHOW ----
// Built from the actual car, so a link posted in a message shows the make, model
// and price rather than a generic site description.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = findVehicle(id);

  if (!vehicle) return { title: 'Car not found' };

  const name = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;

  return {
    alternates: canonical(`/vehicles/${vehicle.id}`),
    title: `${name} — ${money(vehicle.dailyRate)} per day`,
    description: `Rent a ${name} in ${vehicle.pickupTown}, ${sideLabels[vehicle.side]}. ${
      vehicle.seats
    } seats, ${transmissionLabels[vehicle.transmission].toLowerCase()}. ${money(
      vehicle.dailyRate,
    )} per day, with a ${money(vehicle.depositAmount)} deposit held and returned.`,
    openGraph: {
      title: `${name} · SXM Rentals`,
      description: `${money(vehicle.dailyRate)} per day in ${vehicle.pickupTown}.`,
      type: 'website',
    },
  };
}

export default async function VehiclePage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = findVehicle(id);

  // A made-up address, or a car that has been removed, gets a proper 404 rather
  // than an empty page that looks like something failed to load.
  if (!vehicle) notFound();

  const provider = findProvider(vehicle.providerId);
  const reviews = reviewsForVehicle(vehicle.id);
  const name = `${vehicle.make} ${vehicle.model}`;

  return (
    <div className="container">
      {/* Read by search engines only — nothing is drawn. This is what turns a
          result from a blue link into one showing the daily price, the star
          rating and the number of reviews. Every figure comes from the same
          data the page below displays. */}
      <JsonLd
        data={[
          jsonLdVehicle(vehicle, provider),
          jsonLdBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Find a Car', href: '/search' },
            { label: name },
          ]),
        ]}
      />

      <div style={{ paddingTop: 'var(--space-xl)' }}>
        <Breadcrumbs
          items={[
            { labelKey: 'web.nav.home', href: '/' },
            { labelKey: 'search.title', href: '/search' },
            { label: name },
          ]}
        />
      </div>

      <div className={styles.layout}>
        {/* ==================== LEFT: THE CAR ==================== */}
        <div className={styles.main}>
          {/* ---- THE GALLERY ---- */}
          <div className={styles.gallery}>
            <PhotoPlaceholder shape="wide" iconSize={70} label={name} />
            <div className={styles.galleryStrip}>
              {Array.from({ length: 4 }).map((_, index) => (
                <PhotoPlaceholder key={index} shape="square" iconSize={26} />
              ))}
            </div>
          </div>

          {/* ---- THE HEADING ---- */}
          <div>
            <div className={styles.titleRow}>
              <div>
                <Text variant="h1" as="h1" raw>
                  {`${name} ${vehicle.year}`}
                </Text>
                {vehicle.trim ? (
                  <Text variant="body" tone="ink2">
                    {vehicle.trim}
                  </Text>
                ) : null}
              </div>
            </div>

            <div className={styles.titleMeta}>
              <StarRow rating={vehicle.rating} reviewCount={vehicle.reviewCount} />

              <span className={styles.metaItem}>
                <Icon name="location-outline" size={15} />
                <Text variant="small" tone="ink2" as="span" raw>
                  {`${vehicle.pickupTown}, ${sideLabels[vehicle.side]}`}
                </Text>
              </span>

              <span className={styles.metaItem}>
                <Icon name="pricetag-outline" size={15} />
                <Text variant="small" tone="ink2" as="span">
                  {vehicleClassLabels[vehicle.vehicleClass]}
                </Text>
              </span>
            </div>
          </div>

          {/* ---- WHAT THE CAR HAS ---- */}
          <div className={styles.section}>
            <Text variant="h3" as="h2">
              <T k="vehicle.atAGlance" />
            </Text>
            <FeatureGrid vehicle={vehicle} />
          </div>

          {/* ---- THE DESCRIPTION ---- */}
          <div className={styles.section}>
            <Text variant="h3" as="h2">
              <T k="vehicle.about" />
            </Text>
            <Text variant="body" tone="ink2">
              {vehicle.description}
            </Text>
          </div>

          {/* ---- THE RENTAL BUSINESS ---- */}
          {provider ? (
            <div className={styles.section}>
              <Text variant="h3" as="h2">
                <T k="vehicle.rentedBy" />
              </Text>
              <Card>
                <ProviderRow provider={provider} />
              </Card>
            </div>
          ) : null}

          {/* ---- THE DEPOSIT, THE HISTORY, AND HOW LONG FOR ---- */}
          <div className={styles.section}>
            <Text variant="h3" as="h2">
              <T k="vehicle.beforeYouBook" />
            </Text>
            <DepositBlock vehicle={vehicle} />
            <AccidentBlock vehicle={vehicle} />
            <RentalPeriod vehicle={vehicle} />
          </div>

          {/* ---- REVIEWS ---- */}
          <div className={styles.section}>
            <div className={styles.reviewsHead}>
              <Text variant="h3" as="h2">
                {`Reviews (${vehicle.reviewCount})`}
              </Text>
              {reviews.length > 0 ? (
                <Button
                  label="Read all reviews"
                  href={`/vehicles/${vehicle.id}/reviews`}
                  variant="outline"
                  size="sm"
                />
              ) : null}
            </div>

            {reviews.length > 0 ? (
              <div className={styles.reviews}>
                {reviews.slice(0, 4).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <Card>
                <Text variant="body" tone="ink2">
                  No reviews for this car yet. Reviews can only be left by someone who has
                  actually rented it.
                </Text>
              </Card>
            )}
          </div>
        </div>

        {/* ==================== RIGHT: THE BOOKING PANEL ==================== */}
        {/* Follows the page as it scrolls, so the price is never off screen. */}
        <BookingPanel vehicle={vehicle} />
      </div>
    </div>
  );
}
