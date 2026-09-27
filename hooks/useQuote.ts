'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Asks the backend what a rental would cost, for a car and
// a set of dates, and asks again whenever either changes.
//
// ---- WHY THE PRICE IS NOT WORKED OUT HERE ----
//
// It used to be. The site kept its own copy of the rules — the weekly rate,
// a service fee, a delivery charge — and drew the breakdown from them. The
// backend's rules had drifted away from that copy: it charges a 5% service
// fee where the site showed 8%, and nothing at all for delivery where the site
// added the business's delivery fee. So the page quoted one price and the
// booking recorded another, and neither was obviously wrong to look at.
//
// Now the backend is asked. It is the thing that takes the money, so its
// arithmetic is the only arithmetic. The quote is public — no account needed —
// which is why a car's page can show the real total to somebody who has not
// signed in.
//
// A quote is never cached: it decides what somebody is about to agree to pay,
// and it carries whether the car is still free for those dates.

import { useAsyncData } from '@/hooks/useAsyncData';
import { apiClient } from '@/lib/api-client';
import type { BookingQuote } from '@/types';

export type QuoteState = {
  quote: BookingQuote | undefined;
  loading: boolean;
  /** Something readable when the backend refused — "at least 3 days", say. */
  error: string | undefined;
  refresh: () => void;
};

/**
 * The price for these dates. With no dates there is nothing to ask about, so
 * nothing is asked and nothing is shown.
 */
export function useQuote(
  vehicleId: string,
  trip: { startDate?: string; endDate?: string; collection: 'pickup' | 'delivery' },
): QuoteState {
  const { startDate, endDate, collection } = trip;

  const state = useAsyncData(
    async (signal) => {
      if (!startDate || !endDate) return undefined;
      return apiClient.quoteBooking({ vehicleId, startDate, endDate, collection }, signal);
    },
    [vehicleId, startDate, endDate, collection],
  );

  return {
    quote: state.data,
    // Nothing to fetch is not "still loading", or a page with no dates would
    // sit on a skeleton for ever.
    loading: state.loading && Boolean(startDate && endDate),
    error: state.error,
    refresh: state.refresh,
  };
}
