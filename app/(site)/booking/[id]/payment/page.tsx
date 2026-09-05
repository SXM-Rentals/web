// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One step of the booking flow. This file only finds the
// car being booked and hands it on — the step itself lives in
// components/booking/BookingPaymentStep.tsx, which has to run in the browser
// because it reacts to what the person does.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findVehicle } from '@/lib/mock/vehicles';
import { BookingPaymentStep } from '@/components/booking/BookingPaymentStep';

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Payment',
  // A booking in progress has no business appearing in search results.
  robots: { index: false, follow: false },
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

  return <BookingPaymentStep vehicle={vehicle} />;
}
