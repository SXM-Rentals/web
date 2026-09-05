// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up customer reviews shown on the car detail screen
// and the full reviews list. The names and comments are invented.

import type { Review } from '@/types';

export const mockReviews: Review[] = [
  {
    id: 'r1',
    vehicleId: 'v1',
    authorName: 'Marcus D.',
    rating: 5,
    date: '2026-08-29',
    body: 'Car was spotless and ready when I landed. Handover took five minutes and the deposit came back the same week.',
  },
  {
    id: 'r2',
    vehicleId: 'v1',
    authorName: 'Elise R.',
    rating: 5,
    date: '2026-08-21',
    body: 'Perfect little runaround for the week. Air conditioning worked properly, which is not a given here.',
  },
  {
    id: 'r3',
    vehicleId: 'v1',
    authorName: 'Tariq B.',
    rating: 4,
    date: '2026-08-04',
    body: 'Good value and no surprises on the bill. Slight delay at pickup but they called ahead to warn me.',
  },
  {
    id: 'r4',
    vehicleId: 'v1',
    authorName: 'Sophie M.',
    rating: 5,
    date: '2026-07-18',
    body: 'Second time renting from them. Straightforward, friendly, and the car is always clean.',
  },
  {
    id: 'r5',
    vehicleId: 'v1',
    authorName: 'Daniel W.',
    rating: 3,
    date: '2026-07-02',
    body: 'The car was fine but it was returned to me with less than a quarter tank. Worth checking before you drive off.',
  },
  {
    id: 'r6',
    vehicleId: 'v2',
    authorName: 'Priya N.',
    rating: 5,
    date: '2026-08-27',
    body: 'Plenty of room for four adults and luggage. Handled the hill to Colombier without complaining.',
  },
  {
    id: 'r7',
    vehicleId: 'v2',
    authorName: 'Jean-Luc F.',
    rating: 4,
    date: '2026-08-11',
    body: 'Comfortable and quiet. Delivery to the hotel was on time and the paperwork was already done.',
  },
  {
    id: 'r8',
    vehicleId: 'v4',
    authorName: 'Chantal V.',
    rating: 5,
    date: '2026-08-19',
    body: 'Exactly what you want for the beaches. Roof off in two minutes and it went everywhere we pointed it.',
  },
];

// Returns just the reviews for one car, newest first.
export function reviewsForVehicle(vehicleId: string): Review[] {
  return mockReviews
    .filter((r) => r.vehicleId === vehicleId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
