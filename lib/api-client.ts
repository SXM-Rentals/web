// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The single doorway between the app's screens and its
// information. Every screen asks this file, and this file decides where the
// answer comes from — the live backend, the sample data in lib/mock/, or, for
// the few screens whose backend does not exist yet, an honest refusal.
//
// Because every screen goes through here, connecting things up has meant
// changing this file rather than fifty others.
//
// ---- WHERE EACH ANSWER COMES FROM ----
//
//   ACCOUNTS — signing in and out, who is signed in, email links
//   Always the backend. There is no sample version of a session worth keeping.
//
//   EVERYTHING ELSE, EXCEPT THE CASES BELOW
//   The backend, or the sample data in lib/mock/, depending on one setting —
//   see lib/api/source.ts. That switch, the sample branches and lib/mock/
//   itself are all being removed, screen by screen, now that signing in is
//   real. Until the last of them goes, the setting decides: on, and it is all
//   the backend; off, and everything but accounts is sample data.
//
//   REWARDS, THE SPREADSHEET IMPORT, THE API CONNECTION DETAILS
//   Nothing. These screens were built before the backend had anywhere for them
//   to go, so they refuse in a way the screen can recognise and say "not
//   connected yet" — rather than calling an address that answers 404, which
//   looks like a bug and wastes a request finding out what we already know.
//
//   THE LEGAL DOCUMENTS
//   Local, permanently. They are fixed text, not records. The backend has no
//   address for them and never will.
//
// ---- THE ONE THING TO BE CAREFUL WITH ----
//
// A method that looks something up by id hands back `undefined` when it is not
// there, and THROWS for every other failure. Those are different things: the
// first means "no such car", the second means "we could not find out". A page
// that turns both into a 404 tells a search engine a car has been deleted
// because a server was briefly asleep, and the page drops out of the index.

import { mockVehicles, findVehicle } from './mock/vehicles';
import { mockProviders, findProvider } from './mock/providers';
import { reviewsForVehicle } from './mock/reviews';
import { mockBookings, findBooking } from './mock/bookings';
import { mockThreads, findThread } from './mock/messages';
import { mockNotifications } from './mock/notifications';
import { mockRewards } from './mock/rewards';
import { legalDocuments, findLegalDocument } from './content/legal';
import {
  businessSummary,
  findBusinessThread,
  findProviderBooking,
  mockBusinessThreads,
  mockBusinessProfile,
  mockPayouts,
  mockProviderBookings,
  mockVehiclePerformance,
  providerFleet,
} from './mock/business';
import { request } from './api/http';
import { isNotFound, notImplemented } from './api/errors';
import { useSampleCatalogue } from './api/source';
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

/**
 * A short made-up wait on the sample-data path only.
 *
 * It exists so the loading and skeleton states still get exercised while the
 * catalogue switch is off. Without it everything appears instantly and those
 * states are never seen until they break in front of somebody.
 */
function sampleDelay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Looks something up and turns "there is no such thing" into `undefined`,
 * while letting every other failure through.
 *
 * See the note at the top of this file about why that distinction matters.
 */
async function findOrUndefined<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch (caught) {
    if (isNotFound(caught)) return undefined;
    throw caught;
  }
}

// The options someone can narrow the car list down by on the Search screen.
// These are the exact names the backend expects — see the note in
// lib/api/http.ts about how lists and yes/no values have to be written.
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

/**
 * Narrowing and sorting the sample cars, for when the catalogue switch is off.
 *
 * The backend does all of this itself. This is only kept so the search screen
 * behaves identically either way — otherwise the switch would change how the
 * page works, not just where the data came from, and testing it would prove
 * nothing.
 */
function filterSampleVehicles(filters: VehicleFilters): Vehicle[] {
  let results = [...mockVehicles];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter((v) => `${v.make} ${v.model} ${v.pickupTown}`.toLowerCase().includes(q));
  }
  if (filters.classes?.length) {
    results = results.filter((v) => filters.classes!.includes(v.vehicleClass));
  }
  if (filters.minPrice != null) results = results.filter((v) => v.dailyRate >= filters.minPrice!);
  if (filters.maxPrice != null) results = results.filter((v) => v.dailyRate <= filters.maxPrice!);
  if (filters.seats != null) results = results.filter((v) => v.seats >= filters.seats!);
  if (filters.transmission) results = results.filter((v) => v.transmission === filters.transmission);
  if (filters.fuel) results = results.filter((v) => v.fuel === filters.fuel);
  if (filters.deliveryOnly) results = results.filter((v) => v.deliveryAvailable);
  if (filters.side) results = results.filter((v) => v.side === filters.side);

  switch (filters.sort) {
    case 'price_low':
      results.sort((a, b) => a.dailyRate - b.dailyRate);
      break;
    case 'price_high':
      results.sort((a, b) => b.dailyRate - a.dailyRate);
      break;
    default:
      // "Recommended" and "rating" both mean best rated first for now.
      results.sort((a, b) => b.rating - a.rating);
  }

  return results;
}

/**
 * How a catalogue read may be cached, and for how long.
 *
 * ---- WHY THIS EXISTS AT ALL, AND WHY IT IS NOT A DEFAULT ----
 *
 * The backend sends "Cache-Control: no-store" on everything, which is the
 * right thing for it to do and reads like an instruction not to cache. It is
 * not quite: asking Next.js for a cache duration explicitly overrides it, and
 * the answer is then reused across visitors for that long. This was measured
 * against a server sending no-store, not assumed.
 *
 * That is worth a great deal here. The backend sleeps after about fifteen
 * minutes and takes up to a minute to wake, and it allows 300 requests per
 * window. Caching a car for five minutes means one visitor pays for the wake
 * and everybody else is served instantly — and a cached answer keeps being
 * served while the backend is down, which turns an outage into nothing
 * visible.
 *
 * ---- SO WHY NOT CACHE EVERYTHING ----
 *
 * Because the booking flow shows the price about to be charged, and a
 * five-minute-old rate is a quoted price that does not match the one taken.
 * The same applies to whether a car is free: a cached "available" is how two
 * people book the same car.
 *
 * So caching is asked for, never assumed. A page that wants it says so, and
 * the reason is written at the page. Leaving this out means live data, which
 * is the answer that can only ever be too slow, never wrong.
 *
 * It does nothing in the browser — the option is a Next.js server idea and is
 * ignored there — so a screen fetching as somebody types always gets live
 * results whatever it passes.
 */
export type ReadOptions = {
  /** Cancels the request. Client screens pass this; the server has no use for it. */
  signal?: AbortSignal;
  /** Seconds this answer may be reused for. Omitted means always live. */
  revalidate?: number;
};

export const apiClient = {
  // ==================== CARS ====================

  async listVehicles(filters: VehicleFilters = {}, options: ReadOptions = {}): Promise<Vehicle[]> {
    if (useSampleCatalogue()) return sampleDelay(filterSampleVehicles(filters));

    return request<Vehicle[]>('/vehicles', {
      ...options,
      query: {
        search: filters.search,
        classes: filters.classes,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        seats: filters.seats,
        transmission: filters.transmission,
        fuel: filters.fuel,
        // Must be the word, not a 1 — the backend rejects anything else.
        deliveryOnly: filters.deliveryOnly ? 'true' : undefined,
        side: filters.side,
        sort: filters.sort,
      },
    });
  },

  async getVehicle(id: string, options: ReadOptions = {}): Promise<Vehicle | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findVehicle(id));
    return findOrUndefined(request<Vehicle>(`/vehicles/${encodeURIComponent(id)}`, options));
  },

  // ==================== RENTAL BUSINESSES ====================

  async listProviders(options: ReadOptions = {}): Promise<Provider[]> {
    if (useSampleCatalogue()) return sampleDelay(mockProviders);
    return request<Provider[]>('/providers', options);
  },

  async getProvider(id: string, options: ReadOptions = {}): Promise<Provider | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findProvider(id));
    return findOrUndefined(request<Provider>(`/providers/${encodeURIComponent(id)}`, options));
  },

  /**
   * Every car belonging to one business.
   *
   * There is no address for this. The backend has no providerId filter on
   * /vehicles and no /providers/:id/vehicles, so the whole catalogue is
   * fetched and narrowed here. That is acceptable at the current size and will
   * not be at ten times it — the ask is filed in docs/backend-asks.md. Doing
   * the filtering in one named place means there is exactly one line to
   * change when the address appears.
   */
  async listProviderVehicles(providerId: string, options: ReadOptions = {}): Promise<Vehicle[]> {
    const all = await apiClient.listVehicles({}, options);
    return all.filter((v) => v.providerId === providerId);
  },

  // ==================== REVIEWS ====================

  async getReviews(vehicleId: string, options: ReadOptions = {}): Promise<Review[]> {
    if (useSampleCatalogue()) return sampleDelay(reviewsForVehicle(vehicleId));
    return request<Review[]>(`/vehicles/${encodeURIComponent(vehicleId)}/reviews`, options);
  },

  // ==================== BOOKINGS ====================
  // NOT always live, despite what this used to say. While signing in is
  // unconnected these read sample data like everything else — see the note in
  // lib/api/source.ts. These are the first branches to delete once there is a
  // real session to ask with.

  async listBookings(signal?: AbortSignal): Promise<Booking[]> {
    if (useSampleCatalogue()) return sampleDelay(mockBookings);
    return request<Booking[]>('/bookings', { signal, auth: true });
  },

  async getBooking(id: string, signal?: AbortSignal): Promise<Booking | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findBooking(id));
    return findOrUndefined(
      request<Booking>(`/bookings/${encodeURIComponent(id)}`, { signal, auth: true }),
    );
  },

  /**
   * What a rental would cost, worked out by the backend before anything is
   * booked.
   *
   * The price used to be calculated in the browser. It should not be: the
   * backend is what actually charges, and two sets of pricing rules drift
   * apart the first time one of them changes. Note the deposit comes back
   * BESIDE the total and is never inside it.
   */
  async quoteBooking(
    input: { vehicleId: string; startDate: string; endDate: string; collection: 'pickup' | 'delivery' },
    signal?: AbortSignal,
  ): Promise<{
    days: number;
    lines: { label: string; amount: number; note?: string }[];
    totalDueToday: number;
    depositAmount: number;
    available: boolean;
  }> {
    return request('/bookings/quote', { method: 'POST', body: input, signal });
  },

  async createBooking(draft: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    collection: 'pickup' | 'delivery';
    location?: string;
    pickupTime?: string;
    returnTime?: string;
  }): Promise<Booking> {
    // Deliberately no `signal`. A booking must not be cancellable halfway —
    // the request may already have reserved the car.
    return request<Booking>('/bookings', { method: 'POST', body: draft, auth: true });
  },

  async cancelBooking(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      auth: true,
    });
  },

  // ==================== MESSAGES ====================

  async listThreads(signal?: AbortSignal): Promise<ChatThread[]> {
    if (useSampleCatalogue()) return sampleDelay(mockThreads);
    return request<ChatThread[]>('/messages/threads', { signal, auth: true });
  },

  async getThread(id: string, signal?: AbortSignal): Promise<ChatThread | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findThread(id));
    return findOrUndefined(
      request<ChatThread>(`/messages/threads/${encodeURIComponent(id)}`, { signal, auth: true }),
    );
  },

  // ==================== NOTIFICATIONS ====================

  async listNotifications(signal?: AbortSignal): Promise<AppNotification[]> {
    if (useSampleCatalogue()) return sampleDelay(mockNotifications);
    return request<AppNotification[]>('/notifications', { signal, auth: true });
  },

  // ==================== ACCOUNTS ====================
  // Always live, whatever the catalogue switch says. There is no sample
  // version of signing in worth keeping: a made-up session is exactly how
  // every visitor ended up "signed in" as the same demo person.
  //
  // THE SESSION ITSELF IS NEVER SEEN HERE. Signing in sets an httpOnly cookie
  // that page scripts cannot read; it rides along on every request through the
  // proxy in next.config.mjs. The only way to learn whether somebody is signed
  // in is to ask — which is what getCurrentUser does.

  /** Who is signed in. Fails with `unauthorized` when nobody is. */
  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    return request<User>('/customers/me', { signal, auth: true });
  },

  /**
   * Signs in and hands back the person.
   *
   * Fails with `invalid_credentials` for a wrong email or password — never
   * `unauthorized`, which means something else entirely — and with
   * `email_not_verified` for somebody who never opened their confirmation link.
   */
  async login(email: string, password: string): Promise<User> {
    const { user } = await request<{ user: User }>('/auth/login', {
      method: 'POST',
      // "web" is what makes the backend answer with a cookie rather than
      // handing the session code back in the response, where a script could
      // read it. It is also the backend's default; said out loud anyway.
      body: { email, password, client: 'web' },
      auth: true,
    });
    return user;
  },

  /**
   * Creates an account. Does NOT sign anybody in.
   *
   * The backend emails a confirmation link and refuses to sign the person in
   * until it has been opened. It also gives the same answer whether or not the
   * address was already registered, so this cannot be used to find out who
   * has an account here.
   */
  async signup(details: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: 'local' | 'tourist';
  }): Promise<void> {
    await request('/auth/signup', { method: 'POST', body: details });
  },

  async logout(): Promise<void> {
    await request('/auth/logout', { method: 'POST', auth: true });
  },

  /** Opens the link from the confirmation email. */
  async verifyEmail(token: string): Promise<void> {
    await request('/auth/verify-email', { method: 'POST', body: { token } });
  },

  async resendVerification(email: string): Promise<void> {
    await request('/auth/verify-email/resend', { method: 'POST', body: { email } });
  },

  /** Same answer whether or not the address has an account — see above. */
  async forgotPassword(email: string): Promise<void> {
    await request('/auth/password/forgot', { method: 'POST', body: { email } });
  },

  /**
   * Sets a new password from the emailed link. The backend signs the person
   * out everywhere at the same moment, so they sign in again afterwards.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await request('/auth/password/reset', {
      method: 'POST',
      // The backend calls this field newPassword, not password.
      body: { token, newPassword },
    });
  },

  // ==================== THE BUSINESS SIDE ====================
  // What a rental business sees about itself. None of it is reachable from a
  // customer-facing screen.

  async getBusinessSummary(signal?: AbortSignal) {
    if (useSampleCatalogue()) return sampleDelay(businessSummary());
    return request<ReturnType<typeof businessSummary>>('/providers/me/summary', {
      signal,
      auth: true,
    });
  },

  async getBusinessProfile(signal?: AbortSignal): Promise<BusinessProfile> {
    if (useSampleCatalogue()) return sampleDelay(mockBusinessProfile);
    return request<BusinessProfile>('/providers/me', { signal, auth: true });
  },

  async getMyFleet(signal?: AbortSignal): Promise<Vehicle[]> {
    if (useSampleCatalogue()) return sampleDelay(providerFleet());
    return request<Vehicle[]>('/providers/me/vehicles', { signal, auth: true });
  },

  async getFleetPerformance(signal?: AbortSignal): Promise<VehiclePerformance[]> {
    if (useSampleCatalogue()) {
      return sampleDelay([...mockVehiclePerformance].sort((a, b) => b.revenue - a.revenue));
    }
    const rows = await request<VehiclePerformance[]>('/providers/me/performance', {
      signal,
      auth: true,
    });
    // Best earner first, which is how the screen ranks them.
    return [...rows].sort((a, b) => b.revenue - a.revenue);
  },

  /**
   * Bookings across the fleet, WITHOUT customer contact details.
   *
   * That absence is product rule 2, and it is enforced in the type: there is
   * no field to put a phone number in. Do not add one. A business gets a first
   * name and a last initial, which is what is actually needed to hand over a
   * car, and talks to the customer through SXM Rentals.
   */
  async getProviderBookings(signal?: AbortSignal): Promise<ProviderBooking[]> {
    if (useSampleCatalogue()) return sampleDelay(mockProviderBookings);
    return request<ProviderBooking[]>('/providers/me/bookings', { signal, auth: true });
  },

  async getProviderBooking(id: string, signal?: AbortSignal): Promise<ProviderBooking | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findProviderBooking(id));
    return findOrUndefined(
      request<ProviderBooking>(`/providers/me/bookings/${encodeURIComponent(id)}`, {
        signal,
        auth: true,
      }),
    );
  },

  /** Conversations with renters — same contact-detail rule as the bookings above. */
  async getBusinessThreads(signal?: AbortSignal): Promise<BusinessChatThread[]> {
    if (useSampleCatalogue()) return sampleDelay(mockBusinessThreads);
    return request<BusinessChatThread[]>('/providers/me/messages', { signal, auth: true });
  },

  async getBusinessThread(id: string, signal?: AbortSignal): Promise<BusinessChatThread | undefined> {
    if (useSampleCatalogue()) return sampleDelay(findBusinessThread(id));
    return findOrUndefined(
      request<BusinessChatThread>(`/providers/me/messages/${encodeURIComponent(id)}`, {
        signal,
        auth: true,
      }),
    );
  },

  async getPayouts(signal?: AbortSignal): Promise<PayoutRecord[]> {
    if (useSampleCatalogue()) return sampleDelay(mockPayouts);
    return request<PayoutRecord[]>('/providers/me/payouts', { signal, auth: true });
  },

  // ==================== BUILT, BUT WITH NOTHING BEHIND THEM ====================
  // These screens exist and the backend has no address for them. They refuse
  // in a way the screen recognises, so it shows "not connected yet" rather
  // than a spinner that never stops or an error that looks like a fault.

  async getRewards(): Promise<RewardsProfile> {
    if (useSampleCatalogue()) return sampleDelay(mockRewards);
    notImplemented('Rewards');
  },

  async readImportFile(): Promise<ImportRow[]> {
    notImplemented('Spreadsheet import');
  },

  // The shape is still declared even though nothing is returned. The screen
  // reads these fields, and without the type every line of it fails to
  // compile — for a screen that at runtime only ever shows "not connected
  // yet". Keeping the shape is what lets the screen stay written and ready.
  async getApiConnection(): Promise<{
    apiKey: string;
    pushEndpoint: string;
    bookingsWebhook: string;
    docsUrl: string;
  }> {
    notImplemented('API connection details');
  },

  // ==================== LEGAL DOCUMENTS ====================
  // Local, permanently. Fixed text, not records — there is no address for
  // these and there is not meant to be.

  async listLegalDocuments(): Promise<LegalDocument[]> {
    return sampleDelay(legalDocuments, 100);
  },

  async getLegalDocument(slug: string): Promise<LegalDocument | undefined> {
    return sampleDelay(findLegalDocument(slug), 100);
  },
};
