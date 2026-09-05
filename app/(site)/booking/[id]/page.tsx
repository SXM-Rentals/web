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
import { findVehicle } from '@/lib/mock/vehicles';
import { BookingTripStep } from '@/components/booking/BookingTripStep';

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Your Trip',
  // A half-finished booking has no business appearing in search results.
  robots: { index: false, follow: false },
};

export default async function BookingTripPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

  return <BookingTripStep vehicle={vehicle} />;
}
