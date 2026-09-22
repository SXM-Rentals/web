// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 1 of 4 — confirming the trip. The dates, whether the
// car is collected or delivered, and where.
//
// THIS IS THE FIRST PAGE ON THE SITE THAT NEEDS AN ACCOUNT. Everything before it
// — the homepage, search, every car page — works completely signed out. Asking
// here rather than at the door is deliberate: most visitors arrive from a search
// engine, and being asked to register before seeing a price is what makes them
// leave. By this point they have chosen a car and have a reason to sign up.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { BookingTripStep } from '@/components/booking/BookingTripStep';

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Your Trip',
  // A half-finished booking has no business appearing in search results.
  robots: { index: false, follow: false },
};

// ---- NEVER CACHED, UNLIKE EVERY OTHER PAGE THAT SHOWS A CAR ----
//
// A car's public page is rebuilt every five minutes, because a price arriving
// five minutes late costs nothing to somebody browsing. These four pages are
// where that stops being true: the number on them is the number about to be
// charged. Showing a rate from a cached copy, taken before the business
// changed it, means quoting a price and then taking a different one.
//
// It also covers availability. A car cached as free is a car two people can
// start booking at once.
//
// The cost is a fetch per visit, on four pages nobody lands on cold — they
// arrive here from a car page, so the backend is already awake. These pages
// are also already noindex, so there is no search cost to not caching them.
export const dynamic = 'force-dynamic';

export default async function BookingTripPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await apiClient.getVehicle(id);
  // Only a car the backend has actually said does not exist gets a 404.
  // A cold server throws instead, and app/error.tsx offers to try again.
  if (!vehicle) notFound();

  return <BookingTripStep vehicle={vehicle} />;
}
