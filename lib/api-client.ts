// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: This is the single doorway between the app's screens and
// its information. Right now every function below hands back MOCK (made-up)
// data from the lib/mock folder — there is no server, no database and no real
// booking being made.
//
// WHY IT MATTERS: because all the screens ask this file for data instead of
// reaching for the mock files directly, connecting the real backend later means
// changing only this one file. No screen has to be rewritten.
//
// Each function is marked with a TODO naming the real address it will eventually
// call on the SXM Rentals backend.

import { mockVehicles, findVehicle } from './mock/vehicles';
import { mockProviders, findProvider } from './mock/providers';
import { mockReviews, reviewsForVehicle } from './mock/reviews';
import { mockBookings, findBooking } from './mock/bookings';
import { mockThreads, findThread } from './mock/messages';
import { mockNotifications } from './mock/notifications';
import { mockRewards } from './mock/rewards';
import { legalDocuments, findLegalDocument } from './mock/legal';
import { mockUser } from './mock/user';
import {
  businessSummary,
  findBusinessThread,
  findProviderBooking,
  mockBusinessThreads,
  mockApiConnection,
  mockBusinessProfile,
  mockImportRows,
  mockPayouts,
  mockProviderBookings,
  mockVehiclePerformance,
  providerFleet,
} from './mock/business';
import type {
  AppNotification,
  BusinessChatThread,
  BusinessProfile,
  ImportRow,
  PayoutRecord,
  ProviderBooking,
  VehiclePerformance,
  Booking,
  ChatThread,
  LegalDocument,
  Provider,
  Review,
  RewardsProfile,
  User,
  Vehicle,
  VehicleClass,
} from '@/types';

// A short made-up wait, so loading spinners and skeleton screens behave the way
// they will once there is a real server to wait for. Without this, everything
// would appear instantly and we would never see those states during testing.
function fakeNetworkDelay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// The options someone can narrow the car list down by on the Search screen.
export type VehicleFilters = {
  search?: string;
  classes?: VehicleClass[];
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  transmission?: 'automatic' | 'manual';
  fuel?: string;
  deliveryOnly?: boolean;
  side?: 'dutch' | 'french';
  sort?: 'recommended' | 'price_low' | 'price_high' | 'rating';
};

export const apiClient = {
  // ---- CARS ----

  // MOCK. TODO: replace with GET /vehicles on the SXM Rentals backend.
  async listVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
    let results = [...mockVehicles];

    // Match the typed words against the make, model or town.
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter((v) =>
        `${v.make} ${v.model} ${v.pickupTown}`.toLowerCase().includes(q),
      );
    }

    if (filters.classes?.length) {
      results = results.filter((v) => filters.classes!.includes(v.vehicleClass));
    }
    if (filters.minPrice != null) {
      results = results.filter((v) => v.dailyRate >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      results = results.filter((v) => v.dailyRate <= filters.maxPrice!);
    }
    if (filters.seats != null) {
      results = results.filter((v) => v.seats >= filters.seats!);
    }
    if (filters.transmission) {
      results = results.filter((v) => v.transmission === filters.transmission);
    }
    if (filters.fuel) {
      results = results.filter((v) => v.fuel === filters.fuel);
    }
    if (filters.deliveryOnly) {
      results = results.filter((v) => v.deliveryAvailable);
    }
    if (filters.side) {
      results = results.filter((v) => v.side === filters.side);
    }

    // Put them in the order the person asked for.
    switch (filters.sort) {
      case 'price_low':
        results.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price_high':
        results.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "Recommended" — best rated first, as a reasonable stand-in until the
        // real ranking rules are decided.
        results.sort((a, b) => b.rating - a.rating);
    }

    return fakeNetworkDelay(results);
  },

  // MOCK. TODO: replace with GET /vehicles/:id.
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return fakeNetworkDelay(findVehicle(id));
  },

  // ---- RENTAL BUSINESSES ----

  // MOCK. TODO: replace with GET /providers.
  async listProviders(): Promise<Provider[]> {
    return fakeNetworkDelay(mockProviders);
  },

  // MOCK. TODO: replace with GET /providers/:id.
  async getProvider(id: string): Promise<Provider | undefined> {
    return fakeNetworkDelay(findProvider(id));
  },

  // ---- REVIEWS ----

  // MOCK. TODO: replace with GET /vehicles/:id/reviews.
  async getReviews(vehicleId: string): Promise<Review[]> {
    return fakeNetworkDelay(reviewsForVehicle(vehicleId));
  },

  // MOCK. TODO: replace with GET /reviews.
  async listAllReviews(): Promise<Review[]> {
    return fakeNetworkDelay(mockReviews);
  },

  // ---- BOOKINGS ----

  // MOCK. TODO: replace with GET /bookings for the signed-in customer.
  async listBookings(): Promise<Booking[]> {
    return fakeNetworkDelay(mockBookings);
  },

  // MOCK. TODO: replace with GET /bookings/:id.
  async getBooking(id: string): Promise<Booking | undefined> {
    return fakeNetworkDelay(findBooking(id));
  },

  // MOCK. TODO: replace with POST /bookings. Nothing is reserved or charged.
  async createBooking(draft: Partial<Booking>): Promise<Booking> {
    const created: Booking = {
      id: `demo-${Date.now()}`,
      reference: 'SXM-DEMO',
      vehicleId: draft.vehicleId ?? 'v1',
      providerId: draft.providerId ?? 'p1',
      status: 'upcoming',
      startDate: draft.startDate ?? '',
      endDate: draft.endDate ?? '',
      pickupTime: draft.pickupTime ?? '10:00',
      returnTime: draft.returnTime ?? '10:00',
      collection: draft.collection ?? 'pickup',
      location: draft.location ?? '',
      lines: draft.lines ?? [],
      depositAmount: draft.depositAmount ?? 0,
      depositStatus: 'not_taken',
      totalDueToday: draft.totalDueToday ?? 0,
      agreementSigned: false,
      createdAt: new Date().toISOString(),
    };
    return fakeNetworkDelay(created, 700);
  },

  // ---- MESSAGES ----

  // MOCK. TODO: replace with GET /messages/threads.
  async listThreads(): Promise<ChatThread[]> {
    return fakeNetworkDelay(mockThreads);
  },

  // MOCK. TODO: replace with GET /messages/threads/:id.
  async getThread(id: string): Promise<ChatThread | undefined> {
    return fakeNetworkDelay(findThread(id));
  },

  // ---- NOTIFICATIONS ----

  // MOCK. TODO: replace with GET /notifications.
  async listNotifications(): Promise<AppNotification[]> {
    return fakeNetworkDelay(mockNotifications);
  },

  // ---- REWARDS ----

  // MOCK. TODO: replace with GET /rewards. The Rewards tab is marked
  // "Coming Soon", so this is only a preview of the idea.
  async getRewards(): Promise<RewardsProfile> {
    return fakeNetworkDelay(mockRewards);
  },

  // ---- THE SIGNED-IN CUSTOMER ----

  // MOCK. TODO: replace with GET /customers/me.
  async getCurrentUser(): Promise<User> {
    return fakeNetworkDelay(mockUser);
  },


  // ---- THE BUSINESS SIDE ----
  // Everything below is what a rental business sees about itself. None of it is
  // reachable from a customer-facing screen.

  // MOCK. TODO: replace with GET /providers/me/summary.
  async getBusinessSummary() {
    return fakeNetworkDelay(businessSummary());
  },

  // MOCK. TODO: replace with GET /providers/me.
  async getBusinessProfile(): Promise<BusinessProfile> {
    return fakeNetworkDelay(mockBusinessProfile);
  },

  // MOCK. TODO: replace with GET /providers/me/vehicles.
  async getMyFleet(): Promise<Vehicle[]> {
    return fakeNetworkDelay(providerFleet());
  },

  // MOCK. TODO: replace with GET /providers/me/performance.
  async getFleetPerformance(): Promise<VehiclePerformance[]> {
    // Best earner first, which is how the screen ranks them.
    return fakeNetworkDelay([...mockVehiclePerformance].sort((a, b) => b.revenue - a.revenue));
  },

  // MOCK. TODO: replace with GET /providers/me/bookings.
  // Returns bookings WITHOUT customer contact details, on purpose — see the
  // note on the ProviderBooking type.
  async getProviderBookings(): Promise<ProviderBooking[]> {
    return fakeNetworkDelay(mockProviderBookings);
  },

  // MOCK. TODO: replace with GET /providers/me/bookings/:id.
  async getProviderBooking(id: string): Promise<ProviderBooking | undefined> {
    return fakeNetworkDelay(findProviderBooking(id));
  },

  // MOCK. TODO: replace with GET /providers/me/messages.
  // Conversations with renters, WITHOUT their contact details — same rule as
  // the bookings above.
  async getBusinessThreads(): Promise<BusinessChatThread[]> {
    return fakeNetworkDelay(mockBusinessThreads);
  },

  // MOCK. TODO: replace with GET /providers/me/messages/:id.
  async getBusinessThread(id: string): Promise<BusinessChatThread | undefined> {
    return fakeNetworkDelay(findBusinessThread(id));
  },

  // MOCK. TODO: replace with GET /providers/me/payouts.
  async getPayouts(): Promise<PayoutRecord[]> {
    return fakeNetworkDelay(mockPayouts);
  },

  // MOCK. TODO: replace with POST /providers/me/vehicles/import (multipart).
  // The real version uploads the file and the server reads it. Here it simply
  // hands back a pretend set of rows so the preview screen can be built.
  async readImportFile(): Promise<ImportRow[]> {
    return fakeNetworkDelay(mockImportRows, 900);
  },

  // MOCK. TODO: replace with GET /providers/me/api-credentials.
  async getApiConnection() {
    return fakeNetworkDelay(mockApiConnection);
  },

  // ---- LEGAL DOCUMENTS ----

  // MOCK. TODO: these may end up as static content rather than an API call.
  async listLegalDocuments(): Promise<LegalDocument[]> {
    return fakeNetworkDelay(legalDocuments, 100);
  },

  async getLegalDocument(slug: string): Promise<LegalDocument | undefined> {
    return fakeNetworkDelay(findLegalDocument(slug), 100);
  },
};
