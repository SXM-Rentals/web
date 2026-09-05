// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: A made-up list of rental businesses on both sides of the
// island, used to fill the screens while we build. When the real system is
// ready this is replaced by data from the server. None of these companies exist.
//
// EVERYTHING HERE IS PUBLIC — it is what a customer sees on a business's page.
// A business's private figures (earnings, payouts, bookings) live separately in
// business.ts, so a customer-facing screen has no way to reach them.

import type { Provider } from '@/types';

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    businessName: 'Simpson Bay Auto',
    side: 'dutch',
    town: 'Simpson Bay',
    rating: 4.8,
    reviewCount: 212,
    isVerified: true,
    respondsIn: 'Usually replies within an hour',
    phone: '+1 721 555 0142',
    description:
      'Family-run since 2011, working mostly out of Simpson Bay and the airport. We keep a small fleet and look after it properly rather than running dozens of tired cars.',
    deliversVehicles: true,
    airportPickup: true,
    memberSince: '2011-03-14',
  },
  {
    id: 'p2',
    businessName: 'Marigot Motors',
    side: 'french',
    town: 'Marigot',
    rating: 4.6,
    reviewCount: 138,
    isVerified: true,
    respondsIn: 'Usually replies within 2 hours',
    phone: '+590 590 555 018',
    description:
      "Marigot's largest independent hire company. Everything from little runabouts to the odd premium car, and we will bring it to you anywhere on the French side.",
    deliversVehicles: true,
    airportPickup: true,
    memberSince: '2015-07-02',
  },
  {
    id: 'p3',
    businessName: 'Philipsburg Car Hire',
    side: 'dutch',
    town: 'Philipsburg',
    rating: 4.4,
    reviewCount: 96,
    isVerified: true,
    respondsIn: 'Usually replies same day',
    phone: '+1 721 555 0177',
    description:
      'Straightforward, well-priced cars in the middle of Philipsburg. Collection only, but we are two minutes from the cruise pier.',
    deliversVehicles: false,
    airportPickup: false,
    memberSince: '2018-01-20',
  },
  {
    id: 'p4',
    businessName: 'Orient Bay Rentals',
    side: 'french',
    town: 'Orient Bay',
    rating: 4.9,
    reviewCount: 64,
    isVerified: false,
    respondsIn: 'Usually replies within an hour',
    phone: '+590 590 555 044',
    description:
      'Beach-focused hire in Orient Bay. Jeeps and open-tops, and we know every back road worth taking.',
    deliversVehicles: false,
    airportPickup: false,
    memberSince: '2021-11-08',
  },
  {
    id: 'p5',
    businessName: 'Cole Bay Wheels',
    side: 'dutch',
    town: 'Cole Bay',
    rating: 4.2,
    reviewCount: 51,
    isVerified: true,
    respondsIn: 'Usually replies within 3 hours',
    phone: '+1 721 555 0163',
    description:
      'Cole Bay locals renting reliable, well-serviced cars. Hybrids and small four-wheel drives are what we do best.',
    deliversVehicles: true,
    airportPickup: false,
    memberSince: '2016-05-30',
  },
];

// Quick way for a screen to look up a business by its id.
export function findProvider(id: string): Provider | undefined {
  return mockProviders.find((p) => p.id === id);
}
