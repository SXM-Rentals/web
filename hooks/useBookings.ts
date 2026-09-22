'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Fetches a customer's bookings — all of them, or one —
// together with the car and the business each one is for.
//
// ---- WHY THE CAR IS FETCHED SEPARATELY ----
//
// A booking from the backend names its car and its business by id only. To
// say "Kia Picanto, from Harbour View Rentals" the screen needs the records
// themselves, which come from the shared lookup in lib/api-client.ts
// (catalogueLookup). Both are asked for at the same time, so a rental page
// costs one wait, not two in a row.
//
// ---- THE NAMES ARE A NICETY; THE BOOKING IS THE PAGE ----
//
// If the lookup fails, the bookings are still shown — with "your rental car"
// where the name would be — rather than the whole page failing because a
// list of cars could not be fetched. Somebody checking their collection time
// does not need the model name to do it.
//
// And there are two different reasons a car's name can be missing, worth
// telling apart: the lookup failed ("your rental car"), or it worked and the
// car is no longer listed ("a car that is no longer listed").

import { useCallback } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n';
import type { Vehicle } from '@/types';

// A lookup that fails costs the names, never the list.
const lookupOrNothing = () => apiClient.catalogueLookup().catch(() => null);

/** Every booking, with a way to find each one's car and business. */
export function useBookings() {
  const state = useAsyncData(async (signal) => {
    const [bookings, lookup] = await Promise.all([apiClient.listBookings(signal), lookupOrNothing()]);
    return { bookings, lookup };
  }, []);

  return {
    ...state,
    bookings: state.data?.bookings,
    lookup: state.data?.lookup ?? null,
  };
}

/** One booking, with its car and business if they could be found. */
export function useBooking(id: string) {
  const state = useAsyncData(
    async (signal) => {
      const [booking, lookup] = await Promise.all([apiClient.getBooking(id, signal), lookupOrNothing()]);
      return { booking, lookup };
    },
    [id],
  );

  const booking = state.data?.booking;
  const lookup = state.data?.lookup ?? null;

  return {
    ...state,
    booking,
    /** Whether the names could be checked at all — see carName. */
    lookedUp: lookup !== null,
    vehicle: booking && lookup ? lookup.vehicle(booking.vehicleId) : undefined,
    provider: booking && lookup ? lookup.provider(booking.providerId) : undefined,
  };
}

/**
 * What to call the car on a booking.
 *
 * "Kia Picanto" when it was found; "a car that is no longer listed" when the
 * lookup worked and the car was not in it; "your rental car" when the lookup
 * itself could not be made.
 */
export function useCarName(): (vehicle: Vehicle | undefined, lookedUp: boolean) => string {
  const { t } = useTranslation();
  return useCallback(
    (vehicle, lookedUp) =>
      vehicle
        ? `${vehicle.make} ${vehicle.model}`
        : lookedUp
          ? t('acct.rentals.carUnlisted')
          : t('acct.rentals.carUnknown'),
    [t],
  );
}
