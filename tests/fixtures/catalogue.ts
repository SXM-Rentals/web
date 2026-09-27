// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A few cars and rental businesses, shaped exactly as the
// backend sends them, for the tests that need a catalogue to work on — the
// sitemap, and what a search engine is told about a car or a business.
//
// These used to come from lib/mock/, the sample data the whole site once ran
// on. That is deleted. Tests keep their own small, deliberate set instead, so
// what a test depends on is written down where the test can see it, rather
// than borrowed from a demo that could change underneath it.

import type { FleetVehicle, Provider, Vehicle } from '@/types';

export const providers: Provider[] = [
  {
    id: 'p-harbour',
    businessName: 'Harbour View Rentals',
    side: 'dutch',
    town: 'Simpson Bay',
    rating: 4.8,
    reviewCount: 64,
    isVerified: true,
    respondsIn: 'usually replies within an hour',
    // Here so the tests can check it is never handed to a search engine.
    phone: '+1 721 555 0100',
    description: 'Family-run since 2009, on the Simpson Bay strip.',
    deliversVehicles: true,
    airportPickup: true,
    memberSince: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'p-marigot',
    businessName: 'Marigot Car Hire',
    side: 'french',
    town: 'Marigot',
    rating: 0,
    reviewCount: 0,
    isVerified: false,
    respondsIn: 'usually replies within a day',
    phone: '+590 590 55 01 02',
    description: '',
    deliversVehicles: false,
    airportPickup: false,
    memberSince: '2026-09-20T00:00:00.000Z',
  },
];

// What most listed cars have in common, so each one below says only how it
// differs. The lists are written out per car: shared, one car's change would
// quietly become every car's.
const base: Pick<Vehicle, 'type' | 'airConditioning' | 'minimumDays' | 'maximumDays' | 'depositIsVehicleSpecific'> = {
  type: 'car',
  airConditioning: true,
  minimumDays: 1,
  maximumDays: 30,
  depositIsVehicleSpecific: true,
};

export const vehicles: Vehicle[] = [
  {
    ...base,
    id: 'v-picanto',
    make: 'Kia',
    model: 'Picanto',
    year: 2023,
    vehicleClass: 'economy',
    transmission: 'automatic',
    fuel: 'petrol',
    seats: 4,
    doors: 5,
    providerId: 'p-harbour',
    dailyRate: 38,
    depositAmount: 250,
    pickupTown: 'Simpson Bay',
    side: 'dutch',
    deliveryAvailable: true,
    latitude: 18.0386,
    longitude: -63.0922,
    rating: 4.7,
    reviewCount: 12,
    description: 'Small, frugal, and easy to park in Philipsburg.',
    accidentHistory: [],
    unavailableDates: [],
    photos: [],
  },
  {
    ...base,
    id: 'v-jimny',
    make: 'Suzuki',
    model: 'Jimny',
    year: 2024,
    vehicleClass: 'fourByFour',
    transmission: 'manual',
    fuel: 'petrol',
    seats: 4,
    doors: 3,
    providerId: 'p-harbour',
    // Not a whole number, the way a business is free to set it.
    dailyRate: 72.5,
    weeklyRate: 450,
    minimumDays: 2,
    maximumDays: 21,
    depositAmount: 500,
    pickupTown: 'Simpson Bay',
    side: 'dutch',
    deliveryAvailable: false,
    latitude: 18.0386,
    longitude: -63.0922,
    rating: 0,
    reviewCount: 0,
    description: '',
    accidentHistory: [],
    unavailableDates: [],
    photos: [],
  },
  {
    ...base,
    id: 'v-tucson',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    vehicleClass: 'suv',
    transmission: 'automatic',
    fuel: 'hybrid',
    seats: 5,
    doors: 5,
    providerId: 'p-marigot',
    dailyRate: 96,
    depositAmount: 600,
    pickupTown: 'Marigot',
    side: 'french',
    deliveryAvailable: false,
    latitude: 18.068,
    longitude: -63.0825,
    rating: 4.2,
    reviewCount: 3,
    description: 'Room for luggage.',
    accidentHistory: [],
    unavailableDates: [],
    photos: [],
  },
];

/** The same cars as a business sees them in its own fleet. */
export const fleet: FleetVehicle[] = vehicles.map((vehicle, index) => ({
  ...vehicle,
  listingStatus: 'live',
  reference: `SXM-V-${4410 + index}`,
}));
