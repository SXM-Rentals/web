// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: What a rental business is sent about its own bookings,
// payouts and conversations, shaped exactly as the backend sends them, for the
// product-rule tests.
//
// THE FIGURES ARE THE BACKEND'S OWN ARITHMETIC, worked in cents the way it
// works them: the rental, a 5% service fee on it, and 30% commission on the
// whole. So they have cents, the way real ones do — which is the case the
// sample data never exercised, and the one where showing all three figures
// together can go wrong.
//
// These replace lib/mock/business.ts, deleted with the rest of the sample data.

import type { BusinessChatThread, PayoutRecord, ProviderBooking } from '@/types';

export const providerBookings: ProviderBooking[] = [
  {
    // 3 days × $38 = $114, fee $5.70 → $119.70. Commission $35.91, leaving $83.79.
    id: 'b-4821',
    reference: 'SXM-4821',
    vehicleId: 'v-picanto',
    status: 'upcoming',
    renterDisplayName: 'Maria K.',
    renterVerified: true,
    startDate: '2030-10-05',
    endDate: '2030-10-08',
    pickupTime: '10:00',
    returnTime: '10:00',
    collection: 'pickup',
    location: 'Simpson Bay',
    grossAmount: 119.7,
    commission: 35.91,
    netAmount: 83.79,
    depositAmount: 250,
    depositStatus: 'not_taken',
  },
  {
    // One week at the $450 weekly rate, fee $22.50 → $472.50. Commission
    // $141.75, leaving $330.75.
    id: 'b-5307',
    reference: 'SXM-5307',
    vehicleId: 'v-jimny',
    status: 'completed',
    renterDisplayName: 'Benjamin J.',
    renterVerified: true,
    startDate: '2030-09-02',
    endDate: '2030-09-09',
    pickupTime: '09:00',
    returnTime: '09:00',
    collection: 'pickup',
    location: 'Simpson Bay',
    grossAmount: 472.5,
    commission: 141.75,
    netAmount: 330.75,
    depositAmount: 500,
    depositStatus: 'released',
  },
  {
    // Cancelled. The backend keeps the original figures on a cancelled booking
    // (docs/backend-asks.md, ask 14); the screens show no payout for it.
    id: 'b-6102',
    reference: 'SXM-6102',
    vehicleId: 'v-picanto',
    status: 'cancelled',
    renterDisplayName: 'Ana P.',
    renterVerified: false,
    startDate: '2030-11-01',
    endDate: '2030-11-07',
    pickupTime: '10:00',
    returnTime: '10:00',
    collection: 'pickup',
    location: 'Simpson Bay',
    grossAmount: 239.4,
    commission: 71.82,
    netAmount: 167.58,
    depositAmount: 250,
    depositStatus: 'released',
  },
];

// Newest first, the order the backend sends them in.
export const payouts: PayoutRecord[] = [
  {
    id: 'po-2032',
    reference: 'SXM-PO-2032',
    amount: 83.79,
    grossAmount: 119.7,
    commission: 35.91,
    bookingCount: 1,
    periodStart: '2030-10-01',
    periodEnd: '2030-10-31',
    status: 'pending',
  },
  {
    id: 'po-2031',
    reference: 'SXM-PO-2031',
    amount: 330.75,
    grossAmount: 472.5,
    commission: 141.75,
    bookingCount: 1,
    periodStart: '2030-09-01',
    periodEnd: '2030-09-30',
    paidOn: '2030-10-03',
    status: 'paid',
  },
];

export const businessThreads: BusinessChatThread[] = [
  {
    id: 't-4821',
    renterDisplayName: 'Maria K.',
    renterVerified: true,
    bookingRef: 'SXM-4821',
    vehicleId: 'v-picanto',
    messages: [
      {
        id: 'm-1',
        from: 'customer',
        body: 'Where exactly do I collect the car?',
        sentAt: '2030-10-01T09:00:00.000Z',
        read: false,
      },
    ],
    unreadCount: 1,
  },
];
