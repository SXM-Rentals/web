// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Fetches what a rental business's public page needs —
// the business, and the cars it has listed — as one call that can safely be
// made twice.
//
// ---- WHY IT IS ITS OWN FILE ----
//
// Same reason as the one beside the car page: generateMetadata and the page
// body are two functions Next.js runs for the same visit, and without React's
// cache() between them the business gets fetched twice.
//
// ---- THE EXPENSIVE PART, WHICH IS NOT OUR CHOICE ----
//
// listProviderVehicles fetches the WHOLE catalogue and narrows it here,
// because the backend has no way to ask for one business's cars — no
// providerId filter on /vehicles, and no /providers/:id/vehicles. The ask is
// filed in docs/backend-asks.md.
//
// That is survivable now and will not be at ten times the catalogue, which is
// why both fetches below ask to be reusable for five minutes. Without that,
// every visit to every business page would pull the entire catalogue down
// again.

import { cache } from 'react';
import { apiClient } from '@/lib/api-client';
import { CATALOGUE_MAX_AGE_SECONDS } from '@/lib/constants';
import type { Provider, Vehicle } from '@/types';

export type ProviderPageData = {
  /** Undefined means the backend said there is no such business. Anything else throws. */
  provider: Provider | undefined;
  fleet: Vehicle[];
};

export const providerPageData = cache(async (id: string): Promise<ProviderPageData> => {
  const provider = await apiClient.getProvider(id, { revalidate: CATALOGUE_MAX_AGE_SECONDS });
  if (!provider) return { provider: undefined, fleet: [] };

  // ---- A FAILED FLEET FETCH MUST NOT LOOK LIKE AN EMPTY ONE ----
  //
  // Not wrapped in allSettled, deliberately. "This business has no cars
  // listed" is a real thing a page can say, and a business that has eleven
  // cars would be shown saying it — to a customer, and to a crawler. Throwing
  // lands on app/error.tsx, which says something failed and offers to retry.
  // A wrong page is worse than an honest error.
  return {
    provider,
    fleet: await apiClient.listProviderVehicles(provider.id, {
      revalidate: CATALOGUE_MAX_AGE_SECONDS,
    }),
  };
});
