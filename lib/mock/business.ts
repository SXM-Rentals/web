// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up figures for the rental business the demo signs
// in as — Simpson Bay Auto. This is what fills the business dashboard: earnings,
// payouts, how each car is performing, and the bookings across their fleet.
//
// NONE OF THIS IS EVER SHOWN TO A CUSTOMER. The public side of a business — its
// name, rating, description and fleet — lives in providers.ts and vehicles.ts.
// Keeping the two apart is what stops a customer screen showing a business's
// earnings by accident.
//
// TWO RULES EVERY FIGURE HERE FOLLOWS:
//   1. Revenue is the business's OWN share, after SXM Rentals' 30% commission.
//   2. Security deposits are never counted as revenue and never paid out. They
//      are held against the customer's card and given back.

import { mockVehicles } from './vehicles';
import type {
  BusinessChatThread,
  BusinessProfile,
  ImportRow,
  PayoutRecord,
  ProviderBooking,
  Vehicle,
  VehiclePerformance,
} from '@/types';

// The business the demo signs in as. It already exists in providers.ts, so the
// public and private halves describe the same company.
export const SIGNED_IN_PROVIDER_ID = 'p1';

// The share of each booking SXM Rentals keeps, from the Overview document.
export const COMMISSION_RATE = 0.3;

// ---- THE PRIVATE HALF OF THE BUSINESS RECORD ----
export const mockBusinessProfile: BusinessProfile = {
  providerId: SIGNED_IN_PROVIDER_ID,
  legalName: 'Simpson Bay Auto N.V.',
  website: 'www.simpsonbayauto.sx',
  registrationStatus: 'registered',
  registeredIn: 'Sint Maarten (Dutch side)',
  registrationNumber: 'SXM-CoC-118427',
  fleetSizeBand: '3–5',
  locations: ['Simpson Bay — Airport Road', 'Princess Juliana Airport (by arrangement)'],
  operatingSide: 'dutch',
  deliversVehicles: true,
  airportPickup: true,
  apiConnected: false,
};

// ---- THE FLEET ----
// Read straight out of the customer-facing vehicle list, so a business always
// sees exactly the cars customers can see. One list, not two that can drift.
export function providerFleet(providerId: string = SIGNED_IN_PROVIDER_ID): Vehicle[] {
  return mockVehicles.filter((vehicle) => vehicle.providerId === providerId);
}

// ---- HOW EACH CAR IS DOING ----
// Revenue is the business's share. Occupancy is the fraction of days in the last
// 90 the car was actually out.
export const mockVehiclePerformance: VehiclePerformance[] = [
  {
    vehicleId: 'v1', // Hyundai Accent
    revenue: 4284,
    bookings: 19,
    occupancyRate: 0.74,
    inquiries: 41,
    conversions: 19,
  },
  {
    vehicleId: 'v11', // Ford Explorer
    revenue: 3612,
    bookings: 9,
    occupancyRate: 0.58,
    inquiries: 27,
    conversions: 9,
  },
  {
    vehicleId: 'v5', // Nissan Versa
    revenue: 1946,
    bookings: 11,
    occupancyRate: 0.41,
    inquiries: 33,
    conversions: 11,
  },
];

// ---- PAYOUTS ----
// "amount" is what actually reached the bank. "grossAmount" is what customers
// paid before commission — shown so the deduction is visible rather than hidden.
export const mockPayouts: PayoutRecord[] = [
  {
    id: 'po-next',
    reference: 'PO-2026-0914',
    amount: 812,
    grossAmount: 1160,
    commission: 348,
    bookingCount: 4,
    periodStart: '2026-09-01',
    periodEnd: '2026-09-07',
    status: 'pending',
  },
  {
    id: 'po-4',
    reference: 'PO-2026-0907',
    amount: 1043,
    grossAmount: 1490,
    commission: 447,
    bookingCount: 6,
    periodStart: '2026-08-25',
    periodEnd: '2026-08-31',
    paidOn: '2026-09-07',
    status: 'paid',
  },
  {
    id: 'po-3',
    reference: 'PO-2026-0831',
    amount: 966,
    grossAmount: 1380,
    commission: 414,
    bookingCount: 5,
    periodStart: '2026-08-18',
    periodEnd: '2026-08-24',
    paidOn: '2026-08-31',
    status: 'paid',
  },
  {
    id: 'po-2',
    reference: 'PO-2026-0824',
    amount: 1274,
    grossAmount: 1820,
    commission: 546,
    bookingCount: 7,
    periodStart: '2026-08-11',
    periodEnd: '2026-08-17',
    paidOn: '2026-08-24',
    status: 'paid',
  },
  {
    id: 'po-1',
    reference: 'PO-2026-0817',
    amount: 889,
    grossAmount: 1270,
    commission: 381,
    bookingCount: 4,
    periodStart: '2026-08-04',
    periodEnd: '2026-08-10',
    paidOn: '2026-08-17',
    status: 'paid',
  },
];

// ---- BOOKINGS ACROSS THE FLEET ----
// Notice what is NOT here: no phone number, no email address. A business sees
// who is collecting the car and when, and talks to them through the app.
export const mockProviderBookings: ProviderBooking[] = [
  {
    id: 'pb1',
    reference: 'SXM-4602',
    vehicleId: 'v1',
    status: 'active',
    renterDisplayName: 'Benjamin J.',
    renterVerified: true,
    threadId: 't1',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    pickupTime: '09:00',
    returnTime: '09:00',
    collection: 'pickup',
    location: 'Simpson Bay Auto, Airport Road',
    grossAmount: 365,
    commission: 110,
    netAmount: 255,
    depositAmount: 300,
    depositStatus: 'held',
  },
  {
    id: 'pb2',
    reference: 'SXM-4915',
    vehicleId: 'v11',
    status: 'upcoming',
    renterDisplayName: 'Priya N.',
    renterVerified: true,
    startDate: '2026-09-12',
    endDate: '2026-09-19',
    pickupTime: '11:30',
    returnTime: '11:30',
    collection: 'delivery',
    location: 'Princess Juliana Airport, arrivals',
    grossAmount: 711,
    commission: 213,
    netAmount: 498,
    depositAmount: 600,
    depositStatus: 'not_taken',
  },
  {
    id: 'pb3',
    reference: 'SXM-4938',
    vehicleId: 'v5',
    status: 'upcoming',
    renterDisplayName: 'Tariq B.',
    renterVerified: false,
    startDate: '2026-09-15',
    endDate: '2026-09-18',
    pickupTime: '14:00',
    returnTime: '14:00',
    collection: 'pickup',
    location: 'Simpson Bay Auto, Airport Road',
    grossAmount: 172,
    commission: 52,
    netAmount: 120,
    depositAmount: 300,
    depositStatus: 'not_taken',
  },
  {
    id: 'pb4',
    reference: 'SXM-4488',
    vehicleId: 'v1',
    status: 'completed',
    renterDisplayName: 'Elise R.',
    renterVerified: true,
    startDate: '2026-08-19',
    endDate: '2026-08-26',
    pickupTime: '10:00',
    returnTime: '10:00',
    collection: 'pickup',
    location: 'Simpson Bay Auto, Airport Road',
    grossAmount: 330,
    commission: 99,
    netAmount: 231,
    depositAmount: 300,
    depositStatus: 'released',
  },
  {
    id: 'pb5',
    reference: 'SXM-4401',
    vehicleId: 'v11',
    status: 'completed',
    renterDisplayName: 'Marcus D.',
    renterVerified: true,
    startDate: '2026-08-10',
    endDate: '2026-08-16',
    pickupTime: '08:30',
    returnTime: '18:00',
    collection: 'delivery',
    location: 'Maho Beach, Sonesta Maho',
    grossAmount: 613,
    commission: 184,
    netAmount: 429,
    depositAmount: 600,
    depositStatus: 'released',
  },
  {
    id: 'pb6',
    reference: 'SXM-4377',
    vehicleId: 'v5',
    status: 'cancelled',
    renterDisplayName: 'Daniel W.',
    renterVerified: true,
    startDate: '2026-08-05',
    endDate: '2026-08-09',
    pickupTime: '12:00',
    returnTime: '12:00',
    collection: 'pickup',
    location: 'Simpson Bay Auto, Airport Road',
    grossAmount: 0,
    commission: 0,
    netAmount: 0,
    depositAmount: 300,
    depositStatus: 'not_taken',
  },
];

// ---- THE HEADLINE FIGURES ON THE OVERVIEW SCREEN ----
export function businessSummary() {
  const fleet = providerFleet();

  const paidOut = mockPayouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = mockPayouts
    .filter((p) => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeBookings = mockProviderBookings.filter((b) => b.status === 'active').length;
  const upcomingBookings = mockProviderBookings.filter((b) => b.status === 'upcoming').length;

  // The average of the ratings on their own cars.
  const rated = fleet.filter((v) => v.reviewCount > 0);
  const averageRating =
    rated.length > 0 ? rated.reduce((sum, v) => sum + v.rating, 0) / rated.length : 0;

  return {
    paidOut,
    pending,
    nextPayoutDate: '2026-09-14',
    activeBookings,
    upcomingBookings,
    fleetSize: fleet.length,
    averageRating,
    // Across the fleet, how many enquiries turned into bookings. Counts only.
    totalInquiries: mockVehiclePerformance.reduce((sum, p) => sum + p.inquiries, 0),
    totalConversions: mockVehiclePerformance.reduce((sum, p) => sum + p.conversions, 0),
  };
}

// ---- A PRETEND SPREADSHEET, ALREADY READ ----
// What the import screen shows after someone uploads a file: mostly good rows,
// and a few with something wrong, each with the reason spelled out. Being shown
// this BEFORE anything is saved is the whole point of the screen.
export const mockImportRows: ImportRow[] = [
  { rowNumber: 2, make: 'Kia', model: 'Rio', year: 2023, registration: 'M 4821', dailyRate: 42, seats: 5, problems: [] },
  { rowNumber: 3, make: 'Kia', model: 'Picanto', year: 2024, registration: 'M 4822', dailyRate: 38, seats: 4, problems: [] },
  { rowNumber: 4, make: 'Hyundai', model: 'i10', year: 2023, registration: 'M 4823', dailyRate: 36, seats: 4, problems: [] },
  {
    rowNumber: 5,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    registration: undefined,
    dailyRate: 55,
    seats: 5,
    problems: ['No registration number'],
  },
  { rowNumber: 6, make: 'Suzuki', model: 'Swift', year: 2023, registration: 'M 4825', dailyRate: 40, seats: 5, problems: [] },
  {
    rowNumber: 7,
    make: 'Nissan',
    model: 'Kicks',
    year: 2024,
    registration: 'M 4826',
    dailyRate: undefined,
    seats: 5,
    problems: ['No daily rate'],
  },
  { rowNumber: 8, make: 'Hyundai', model: 'Tucson', year: 2022, registration: 'M 4827', dailyRate: 68, seats: 5, problems: [] },
  {
    rowNumber: 9,
    make: 'Jeep',
    model: 'Renegade',
    year: 1899,
    registration: 'M 4828',
    dailyRate: 75,
    seats: 5,
    problems: ['Year looks wrong'],
  },
  { rowNumber: 10, make: 'Toyota', model: 'Yaris', year: 2023, registration: 'M 4829', dailyRate: 44, seats: 5, problems: [] },
  { rowNumber: 11, make: 'Kia', model: 'Seltos', year: 2023, registration: 'M 4830', dailyRate: 62, seats: 5, problems: [] },
  { rowNumber: 12, make: 'Suzuki', model: 'Jimny', year: 2024, registration: 'M 4831', dailyRate: 64, seats: 4, problems: [] },
  {
    rowNumber: 13,
    make: 'Chevrolet',
    model: 'Spark',
    year: 2021,
    registration: 'M 4825',
    dailyRate: 35,
    seats: 4,
    problems: ['Registration M 4825 is already used on row 6'],
  },
];

// The made-up connection details shown on the API setup screen.
export const mockApiConnection = {
  apiKey: 'sxm_live_8f2b41d9c7e04a6b93razz',
  pushEndpoint: 'https://api.sxmrentals.com/v1/providers/p1/inventory',
  bookingsWebhook: 'https://your-system.example.com/sxm/bookings',
  docsUrl: 'https://developers.sxmrentals.com',
};

export function findProviderBooking(id: string): ProviderBooking | undefined {
  return mockProviderBookings.find((b) => b.id === id);
}

export function performanceForVehicle(vehicleId: string): VehiclePerformance | undefined {
  return mockVehiclePerformance.find((p) => p.vehicleId === vehicleId);
}

// ---- CONVERSATIONS WITH RENTERS ----
// The same privacy rule as the bookings above: a display name and nothing else.
// A business talks to its customers here, inside SXM Rentals, which keeps a
// record both sides can point to if there is ever a disagreement.
//
// Note "from" is written from the CUSTOMER's point of view, matching the rest of
// the app — 'customer' means the renter wrote it, 'provider' means the business
// did. The business screens flip that round when drawing the bubbles.
export const mockBusinessThreads: BusinessChatThread[] = [
  {
    id: 'bt1',
    renterDisplayName: 'Benjamin J.',
    renterVerified: true,
    bookingRef: 'SXM-4602',
    vehicleId: 'v1',
    unreadCount: 1,
    messages: [
      {
        id: 'bm1',
        from: 'provider',
        body: 'Morning! Your Accent is washed and ready. We are open from 8am if you want to collect early.',
        sentAt: '2026-09-03T08:12:00Z',
        read: true,
      },
      {
        id: 'bm2',
        from: 'customer',
        body: 'Great, thanks. I should be there around nine.',
        sentAt: '2026-09-03T08:20:00Z',
        read: true,
      },
      {
        id: 'bm3',
        from: 'customer',
        body: 'Quick question — is there a spare tyre in the boot? Heading up to the north coast.',
        sentAt: '2026-09-04T07:45:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'bt2',
    renterDisplayName: 'Priya N.',
    renterVerified: true,
    bookingRef: 'SXM-4915',
    vehicleId: 'v11',
    unreadCount: 2,
    messages: [
      {
        id: 'bm4',
        from: 'customer',
        body: 'Hello — our flight lands at 11:05 on the 12th. Will someone be waiting at arrivals?',
        sentAt: '2026-09-03T16:02:00Z',
        read: false,
      },
      {
        id: 'bm5',
        from: 'customer',
        body: 'Also, is a child seat something you can add? We have a two year old.',
        sentAt: '2026-09-03T16:04:00Z',
        read: false,
      },
      {
        id: 'bm5b',
        from: 'provider',
        body: 'Yes to both. If you would rather something smaller for the town, this one is cheaper:',
        vehicleId: 'v1',
        sentAt: '2026-09-03T16:40:00Z',
        read: true,
      },
    ],
  },
  {
    id: 'bt3',
    renterDisplayName: 'Marcus D.',
    renterVerified: true,
    bookingRef: 'SXM-4401',
    vehicleId: 'v11',
    unreadCount: 0,
    messages: [
      {
        id: 'bm6',
        from: 'provider',
        body: 'Thanks for bringing the Explorer back in such good shape. Your deposit has been released.',
        sentAt: '2026-08-16T18:20:00Z',
        read: true,
      },
      {
        id: 'bm7',
        from: 'customer',
        body: 'Appreciated. Great car, we will book with you again next year.',
        sentAt: '2026-08-16T19:02:00Z',
        read: true,
      },
    ],
  },
  {
    id: 'bt4',
    renterDisplayName: 'Tariq B.',
    renterVerified: false,
    bookingRef: 'SXM-4938',
    vehicleId: 'v5',
    unreadCount: 0,
    messages: [
      {
        id: 'bm8',
        from: 'customer',
        body: 'Booked the Versa for the 15th. Is it automatic?',
        sentAt: '2026-09-02T11:30:00Z',
        read: true,
      },
      {
        id: 'bm9',
        from: 'provider',
        body: 'It is, yes. Automatic, air conditioning, and a decent sized boot.',
        sentAt: '2026-09-02T11:48:00Z',
        read: true,
      },
    ],
  },
];

export function findBusinessThread(id: string): BusinessChatThread | undefined {
  return mockBusinessThreads.find((t) => t.id === id);
}
