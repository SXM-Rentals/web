// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up rentals for the signed-in customer, covering all
// four situations the My Rentals screen has to show: a trip coming up, a car
// they have right now, trips that have finished, and one that was cancelled.
// Notice the security deposit is always its own separate figure — it is money
// held and given back, not money charged.

import type { Booking } from '@/types';

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    reference: 'SXM-4821',
    vehicleId: 'v2',
    providerId: 'p2',
    status: 'upcoming',
    startDate: '2026-09-18',
    endDate: '2026-09-23',
    pickupTime: '10:30',
    returnTime: '17:00',
    collection: 'delivery',
    location: 'Princess Juliana Airport, arrivals',
    lines: [
      { label: 'Rental (5 days x $78)', amount: 390 },
      { label: 'Delivery to airport', amount: 25 },
      { label: 'Service fee', amount: 18 },
    ],
    depositAmount: 500,
    depositStatus: 'not_taken',
    totalDueToday: 433,
    agreementSigned: true,
    createdAt: '2026-08-30T14:05:00Z',
  },
  {
    id: 'b2',
    reference: 'SXM-4602',
    vehicleId: 'v1',
    providerId: 'p1',
    status: 'active',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    pickupTime: '09:00',
    returnTime: '09:00',
    collection: 'pickup',
    location: 'Simpson Bay Auto, Airport Road',
    lines: [
      { label: 'Rental (7 days x $45)', amount: 315 },
      { label: 'Additional driver', amount: 35 },
      { label: 'Service fee', amount: 15 },
    ],
    depositAmount: 300,
    depositStatus: 'held',
    totalDueToday: 365,
    agreementSigned: true,
    createdAt: '2026-08-24T08:30:00Z',
  },
  {
    id: 'b3',
    reference: 'SXM-4180',
    vehicleId: 'v6',
    providerId: 'p5',
    status: 'completed',
    startDate: '2026-07-11',
    endDate: '2026-07-15',
    pickupTime: '11:00',
    returnTime: '11:00',
    collection: 'pickup',
    location: 'Cole Bay Wheels, Welfare Road',
    lines: [
      { label: 'Rental (4 days x $62)', amount: 248 },
      { label: 'Service fee', amount: 12 },
    ],
    depositAmount: 400,
    depositStatus: 'released',
    totalDueToday: 260,
    agreementSigned: true,
    createdAt: '2026-07-02T19:12:00Z',
  },
  {
    id: 'b4',
    reference: 'SXM-3944',
    vehicleId: 'v4',
    providerId: 'p4',
    status: 'completed',
    startDate: '2026-05-20',
    endDate: '2026-05-24',
    pickupTime: '08:30',
    returnTime: '18:00',
    collection: 'delivery',
    location: 'Orient Bay, Hotel La Plantation',
    lines: [
      { label: 'Rental (4 days x $95)', amount: 380 },
      { label: 'Delivery', amount: 30 },
      { label: 'Service fee', amount: 18 },
    ],
    depositAmount: 700,
    depositStatus: 'released',
    totalDueToday: 428,
    agreementSigned: true,
    createdAt: '2026-05-09T10:41:00Z',
  },
  {
    id: 'b5',
    reference: 'SXM-3710',
    vehicleId: 'v3',
    providerId: 'p3',
    status: 'cancelled',
    startDate: '2026-04-02',
    endDate: '2026-04-05',
    pickupTime: '12:00',
    returnTime: '12:00',
    collection: 'pickup',
    location: 'Philipsburg Car Hire, Back Street',
    lines: [
      { label: 'Rental (3 days x $38)', amount: 114 },
      { label: 'Service fee', amount: 8 },
    ],
    depositAmount: 250,
    depositStatus: 'not_taken',
    totalDueToday: 0,
    agreementSigned: false,
    createdAt: '2026-03-28T15:20:00Z',
  },
];

// Look up one rental by its id — used by the rental detail, extend and cancel
// screens.
export function findBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

// Adds up everything except the deposit. The deposit is deliberately left out:
// it is held temporarily and returned, so folding it into the total would make
// the rental look more expensive than it is.
export function bookingSubtotal(booking: Booking): number {
  return booking.lines.reduce((sum, line) => sum + line.amount, 0);
}
