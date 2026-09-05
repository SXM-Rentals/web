'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Keeps track of whether the signed-in person also runs a
// rental business, and gives them the link across to their dashboard.
//
// WHY THE SITE HAS TWO SIDES: renting a car and running a rental company are
// completely different jobs, needing different pages and different navigation.
// Rather than cramming both into one menu, the site keeps them apart, the way
// Airbnb separates travelling from hosting.
//
// HOW THIS DIFFERS FROM THE PHONE APP: on the phone, switching sides swaps the
// whole bottom bar, so the app has to remember which mode it is in. On the web
// the two sides are simply different addresses — the customer site lives at /
// and the business dashboard at /provider, each with its own navigation. The
// address bar already says which side you are on, so there is no mode to track.
//
// Most people never see the business side at all. The dashboard link only
// appears for someone whose business has been approved.
//
// NOTE: this is pretend. Whether someone "has an approved business" is a fixed
// value below, so the dashboard can be looked at during development. In the
// finished site the answer comes from the server.

import React, { createContext, useContext, useMemo } from 'react';
import { mockBusinessProfile, SIGNED_IN_PROVIDER_ID } from '@/lib/mock/business';
import { findProvider } from '@/lib/mock/providers';
import type { BusinessProfile, Provider } from '@/types';

type BusinessValue = {
  // Whether this person has a business that has been approved. Controls whether
  // the dashboard link appears anywhere.
  hasBusiness: boolean;

  // The public half of their business record — name, rating, description.
  provider: Provider | undefined;
  // The private half — registration, locations, API connection.
  profile: BusinessProfile;
};

const BusinessContext = createContext<BusinessValue | null>(null);

// Set to false to see the site as an ordinary customer with no business — the
// dashboard link disappears everywhere.
const DEMO_HAS_APPROVED_BUSINESS = true;

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const provider = findProvider(SIGNED_IN_PROVIDER_ID);

  const value = useMemo<BusinessValue>(
    () => ({
      hasBusiness: DEMO_HAS_APPROVED_BUSINESS,
      provider,
      profile: mockBusinessProfile,
    }),
    [provider],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

// How a page finds out about the business:
//   const { hasBusiness, provider } = useBusiness();
export function useBusiness(): BusinessValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error('useBusiness must be used inside BusinessProvider (check app/layout.tsx)');
  }
  return ctx;
}
