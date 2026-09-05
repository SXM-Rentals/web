'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Remembers the trip someone is planning — the dates they
// want a car for, where they want to collect it, and whether they want it
// delivered.
//
// WHY IT LIVES HERE RATHER THAN ON ONE SCREEN: the bar showing "18 – 23 Sep,
// Simpson Bay" stays visible across the Home screen, the Search screen and the
// filters. They all need to read and change the same trip, so it is kept in one
// shared place instead of being copied between screens.

import React, { createContext, useContext, useMemo, useState } from 'react';

export type Trip = {
  // Written as YYYY-MM-DD. Empty until someone picks dates.
  startDate?: string;
  endDate?: string;
  // Where the car is collected, or where it should be delivered to.
  location: string;
  collection: 'pickup' | 'delivery';
};

type TripValue = {
  trip: Trip;
  setTrip: (trip: Partial<Trip>) => void;
  clearDates: () => void;
  // True once both dates are chosen, which several screens check before
  // showing prices for a whole trip rather than a daily rate.
  hasDates: boolean;
};

const TripContext = createContext<TripValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTripState] = useState<Trip>({
    location: 'Anywhere on the island',
    collection: 'pickup',
  });

  // Changes only the parts passed in, leaving the rest of the trip alone.
  const setTrip = (changes: Partial<Trip>) => {
    setTripState((current) => ({ ...current, ...changes }));
  };

  const clearDates = () => {
    setTripState((current) => ({ ...current, startDate: undefined, endDate: undefined }));
  };

  const value = useMemo<TripValue>(
    () => ({
      trip,
      setTrip,
      clearDates,
      hasDates: Boolean(trip.startDate && trip.endDate),
    }),
    [trip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripValue {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error('useTrip must be used inside TripProvider (check app/layout.tsx)');
  }
  return ctx;
}
