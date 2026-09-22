// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One step of the booking flow. This file only finds the
// car being booked and hands it on — the step itself lives in
// components/booking/BookingAgreementStep.tsx, which has to run in the browser
// because it reacts to what the person does.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { BookingAgreementStep } from '@/components/booking/BookingAgreementStep';

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Rental Agreement',
  // A booking in progress has no business appearing in search results.
  robots: { index: false, follow: false },
};

// Never cached, for the reason spelled out on the first step of this flow —
// app/(site)/booking/[id]/page.tsx. The figures here are about to be charged.
export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await apiClient.getVehicle(id);
  // Only a car the backend has actually said does not exist gets a 404.
  // A cold server throws instead, and app/error.tsx offers to try again.
  if (!vehicle) notFound();

  return <BookingAgreementStep vehicle={vehicle} />;
}
