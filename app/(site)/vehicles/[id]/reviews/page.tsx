// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every review left for one car, on its own page. The car's
// own page shows the first few; this shows the lot, along with how the ratings
// break down across the five stars.
//
// IT HAS ITS OWN ADDRESS on purpose — reviews are exactly the kind of thing
// somebody sends to whoever they are travelling with, and a link that opens the
// car page and expects them to scroll and press something is a worse link.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findVehicle } from '@/lib/mock/vehicles';
import { reviewsForVehicle } from '@/lib/mock/reviews';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, EmptyState, StarRow, Text } from '@/components/ui';
import { ReviewCard } from '@/components/vehicle/ReviewCard';
import styles from './reviews.module.css';
import { T } from '@/components/i18n/T';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) return { title: 'Car not found' };

  return {
    title: `Reviews for the ${vehicle.make} ${vehicle.model}`,
    description: `${vehicle.reviewCount} reviews, rated ${vehicle.rating.toFixed(
      1,
    )} out of 5, from people who have actually rented this car.`,
  };
}

export default async function VehicleReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

  const reviews = reviewsForVehicle(vehicle.id);
  const name = `${vehicle.make} ${vehicle.model}`;

  // How many reviews gave each number of stars, counted down from five so the
  // bars read top to bottom the way people expect.
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => Math.round(review.rating) === stars).length,
  }));

  return (
    <div className="container">
      <PageHeader
        title={`Reviews for the ${name}`}
        subtitleKey="vehicle.reviews.subtitle"
        crumbs={[
          { labelKey: 'web.nav.home', href: '/' },
          { labelKey: 'search.title', href: '/search' },
          { label: name, href: `/vehicles/${vehicle.id}` },
          { labelKey: 'vehicle.reviews.title' },
        ]}
      />

      {reviews.length === 0 ? (
        <EmptyState
          title={<T k="vehicle.reviews.emptyTitle" />}
          body="This car has not been reviewed. Reviews appear once someone has rented it and returned it."
          icon="chatbubble-outline"
          actionLabel="Back to the car"
          actionHref={`/vehicles/${vehicle.id}`}
        />
      ) : (
        <div className={styles.layout}>
          {/* ---- THE SUMMARY ---- */}
          <Card padded className={styles.summary}>
            <Text variant="display" as="p" raw>
              {vehicle.rating.toFixed(1)}
            </Text>
            <StarRow rating={vehicle.rating} size={18} showStars />
            <Text variant="small" tone="ink2">
              {`Based on ${vehicle.reviewCount} ${vehicle.reviewCount === 1 ? 'review' : 'reviews'}`}
            </Text>

            {/* The bars are plain blocks sized by percentage. No chart library —
                they inherit the theme and cost nothing. */}
            <div className={styles.breakdown}>
              {breakdown.map((row) => {
                const share = reviews.length > 0 ? (row.count / reviews.length) * 100 : 0;

                return (
                  <div key={row.stars} className={styles.breakdownRow}>
                    <Text variant="small" tone="ink2" as="span" className={styles.starLabel}>
                      {`${row.stars}★`}
                    </Text>
                    <span className={styles.barTrack} aria-hidden="true">
                      <span className={styles.barFill} style={{ width: `${share}%` }} />
                    </span>
                    <Text variant="small" tone="ink3" as="span" className={styles.countLabel}>
                      {row.count}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ---- THE REVIEWS ---- */}
          <div className={styles.list}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
