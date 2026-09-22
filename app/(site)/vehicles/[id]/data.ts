// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Fetches everything a car's page needs — the car, the
// business renting it out, and its reviews — as one call that can safely be
// made twice.
//
// ---- WHY IT IS ITS OWN FILE ----
//
// The page needs this data, and so does generateMetadata, which builds the
// title and the description a search engine shows. Those are two separate
// functions that Next.js runs for the same visit, so the naive version fetches
// the same car twice — two round trips to a server that may be waking up, for
// one page.
//
// React's cache() fixes that: the second call gets the first one's answer.
// It lasts for one page render and no longer, so there is nothing to
// invalidate and nothing that can go stale.
//
// ---- AND IT IS WHERE THE CACHING LIVES ----
//
// Every fetch below asks to be reusable for five minutes. Two different
// things are going on and it is worth keeping them apart:
//
//   cache()      — one render. Stops generateMetadata and the page body
//                  fetching the same car twice for one visitor.
//   revalidate   — five minutes, across everybody. The second visitor to a
//                  car page does not touch the backend at all.
//
// The second one is what keeps the site off the backend's rate limit, absorbs
// its cold start, and keeps pages working while it is down. The page itself
// carries no revalidate — see the note on ./page.tsx for why that would do
// nothing here.
//
// ---- THE ORDER OF THE REQUESTS ----
//
// The business can only be looked up once we have the car, because the car is
// what says which business it belongs to. So the car comes first, then the
// business and the reviews together rather than one after the other.

import { cache } from 'react';
import { apiClient } from '@/lib/api-client';
import { CATALOGUE_MAX_AGE_SECONDS } from '@/lib/constants';
import type { Provider, Review, Vehicle } from '@/types';

export type VehiclePageData = {
  /** Undefined means the backend said there is no such car. Anything else throws. */
  vehicle: Vehicle | undefined;
  provider: Provider | undefined;
  reviews: Review[];
};

export const vehiclePageData = cache(async (id: string): Promise<VehiclePageData> => {
  const vehicle = await apiClient.getVehicle(id, { revalidate: CATALOGUE_MAX_AGE_SECONDS });
  if (!vehicle) return { vehicle: undefined, provider: undefined, reviews: [] };

  // Both at once. Neither depends on the other, and doing them one after the
  // other would double the wait for no reason.
  //
  // allSettled rather than all: a car's page is still worth showing without
  // its reviews, or without the business's description. Losing the whole page
  // because one of two extras failed would be the wrong trade.
  const [providerResult, reviewsResult] = await Promise.allSettled([
    apiClient.getProvider(vehicle.providerId, { revalidate: CATALOGUE_MAX_AGE_SECONDS }),
    apiClient.getReviews(vehicle.id, { revalidate: CATALOGUE_MAX_AGE_SECONDS }),
  ]);

  return {
    vehicle,
    provider: providerResult.status === 'fulfilled' ? providerResult.value : undefined,
    reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : [],
  };
});

/**
 * The car and its reviews, for the reviews page next door.
 *
 * Deliberately not vehiclePageData. That one also fetches the business, which
 * the reviews page never shows — a third request on every visit for something
 * nobody sees. Two cached functions is the cheaper mistake.
 *
 * ---- AND IT DOES NOT SWALLOW A FAILED REVIEW FETCH, UNLIKE THE ONE ABOVE ----
 *
 * On the car's page, reviews are one section among several, so losing them
 * costs a section. Here they are the entire page. An empty list and a failed
 * fetch would render identically — "This car has not been reviewed" — which
 * is not a degraded page, it is a false statement about the car. So this one
 * throws, and app/error.tsx says the truth: something failed, try again.
 */
export const vehicleReviewsData = cache(
  async (id: string): Promise<{ vehicle: Vehicle | undefined; reviews: Review[] }> => {
    const vehicle = await apiClient.getVehicle(id, { revalidate: CATALOGUE_MAX_AGE_SECONDS });
    if (!vehicle) return { vehicle: undefined, reviews: [] };

    return {
      vehicle,
      reviews: await apiClient.getReviews(vehicle.id, { revalidate: CATALOGUE_MAX_AGE_SECONDS }),
    };
  },
);
