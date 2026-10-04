// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The single doorway between the app's screens and its
// information. Every screen asks this file, and this file decides where the
// answer comes from — the live backend, or, for the few screens whose backend
// does not exist yet, an honest refusal.
//
// Because every screen goes through here, connecting things up has meant
// changing this file rather than fifty others.
//
// ---- WHERE EACH ANSWER COMES FROM ----
//
//   EVERYTHING, EXCEPT THE CASES BELOW
//   The backend. There used to be a second source — made-up cars, bookings,
//   messages and a made-up business, in lib/mock/, behind a setting called
//   NEXT_PUBLIC_LIVE_CATALOGUE — and all of it has been deleted. An empty
//   platform now looks empty, which is the truth, rather than full of cars
//   nobody can rent.
//
//   THE SPREADSHEET IMPORT, THE API CONNECTION DETAILS
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

import { legalDocuments, findLegalDocument } from './content/legal';
import { request } from './api/http';
import { ApiError, isApiError, isNotFound, notImplemented } from './api/errors';
import { uploadPhoto } from './api/upload';
import type {
  AppNotification,
  BusinessChatThread,
  CardPaymentStart,
  DepositState,
  SavedCard,
  BusinessApplication,
  BusinessProfile,
  BusinessSummary,
  FleetVehicle,
  ImportRow,
  PayoutAccount,
  PayoutRecord,
  PhotoUploadTicket,
  ProviderBooking,
  VehiclePerformance,
  Booking,
  BookingQuote,
  ChatThread,
  LegalDocument,
  Provider,
  Review,
  User,
  Vehicle,
  VehicleClass,
  VehicleInput,
  VehiclePhoto,
} from '@/types';

// ---- THE SHARED LOOKUP (see catalogueLookup) ----
export type CatalogueLookup = {
  vehicle: (id: string) => Vehicle | undefined;
  provider: (id: string) => Provider | undefined;
};

const LOOKUP_MAX_AGE_MS = 5 * 60 * 1000;
let lookupCache: {
  fetchedAt: number;
  maps: Promise<{ vehicles: Map<string, Vehicle>; providers: Map<string, Provider> }>;
} | null = null;

/** Forgets the shared lookup, so the next screen fetches afresh. Used by tests. */
export function clearCatalogueLookup(): void {
  lookupCache = null;
}

/**
 * For an address the backend is expected to add but may not have yet.
 *
 * The backend answers an address it does not have with `route_not_found`.
 * Turning that into "not connected yet" lets the screen say so plainly — and
 * the moment the backend ships the address, the same code starts working,
 * with no change to the website. Every other refusal comes through as it is.
 */
async function notYetIfMissing<T>(promise: Promise<T>, what: string): Promise<T> {
  try {
    return await promise;
  } catch (caught) {
    if (isApiError(caught) && caught.code === 'route_not_found') notImplemented(what);
    throw caught;
  }
}

/** Where one of the business's own cars keeps its photos. */
const photosPath = (vehicleId: string) =>
  `/providers/me/vehicles/${encodeURIComponent(vehicleId)}/photos`;

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
    return findOrUndefined(request<Vehicle>(`/vehicles/${encodeURIComponent(id)}`, options));
  },

  // ==================== RENTAL BUSINESSES ====================

  async listProviders(options: ReadOptions = {}): Promise<Provider[]> {
    return request<Provider[]>('/providers', options);
  },

  async getProvider(id: string, options: ReadOptions = {}): Promise<Provider | undefined> {
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
    return request<Review[]>(`/vehicles/${encodeURIComponent(vehicleId)}/reviews`, options);
  },

  // ==================== LOOKING THINGS UP BY ID ====================

  /**
   * Car and business details by id, for the screens that are handed only ids.
   *
   * ---- WHY THIS EXISTS ----
   *
   * A booking says `vehicleId` and `providerId`; a conversation says
   * `providerId`. To draw either — "Kia Picanto from Harbour View Rentals" —
   * the screen needs the car and the business themselves. Over the network
   * that is a request, and one request per row would be slow and would spend
   * the backend's 300-per-window allowance a list at a time.
   *
   * So the whole catalogue is fetched once — the backend returns all of it in
   * one answer anyway — and kept for five minutes, shared by every screen that
   * asks. The real fix is the backend putting a small summary of the car on
   * the booking itself; it is ask #1 in docs/backend-asks.md, and when it
   * lands this goes.
   *
   * ---- WHAT IT CANNOT FIND ----
   *
   * Only cars that are currently listed. One taken off the platform since it
   * was booked is in neither the list nor the single-car address — both show
   * listed cars only — so the screen says "a car that is no longer listed"
   * rather than asking again for something that is not there.
   */
  async catalogueLookup(): Promise<CatalogueLookup> {
    let entry = lookupCache;
    if (!entry || Date.now() - entry.fetchedAt >= LOOKUP_MAX_AGE_MS) {
      const maps = Promise.all([apiClient.listVehicles(), apiClient.listProviders()]).then(
        ([vehicles, providers]) => ({
          vehicles: new Map(vehicles.map((v) => [v.id, v])),
          providers: new Map(providers.map((p) => [p.id, p])),
        }),
      );
      const fresh = { fetchedAt: Date.now(), maps };
      entry = fresh;
      lookupCache = fresh;
      // A failure is not kept: the next screen should try again, not inherit it.
      maps.catch(() => {
        if (lookupCache === fresh) lookupCache = null;
      });
    }
    const { vehicles, providers } = await entry.maps;
    return { vehicle: (id) => vehicles.get(id), provider: (id) => providers.get(id) };
  },

  // ==================== BOOKINGS ====================
  // Always live. These are somebody's own reservations, and now that signing
  // in is real there is somebody to ask about. A sample booking shown here is
  // exactly how a demo gets mistaken for a real reservation.

  async listBookings(signal?: AbortSignal): Promise<Booking[]> {
    return request<Booking[]>('/bookings', { signal, auth: true });
  },

  async getBooking(id: string, signal?: AbortSignal): Promise<Booking | undefined> {
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
   *
   * Public — no account needed — because the price is shown on a car's page to
   * anyone. Refused, in words worth showing, when the dates are impossible:
   * `invalid_dates`, `below_minimum_days`, `above_maximum_days`,
   * `delivery_unavailable`.
   */
  async quoteBooking(
    input: {
      vehicleId: string;
      startDate: string;
      endDate: string;
      collection: 'pickup' | 'delivery';
    },
    signal?: AbortSignal,
  ): Promise<BookingQuote> {
    return request<BookingQuote>('/bookings/quote', { method: 'POST', body: input, signal });
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

  /**
   * Cancels a booking that has not started. Hands back the booking as it now
   * stands. Fails with `cannot_cancel` once the rental has begun, and with
   * `already_cancelled` if it was cancelled already — somewhere else, or by a
   * second click.
   */
  async cancelBooking(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      auth: true,
    });
  },

  // ==================== PAYING BY CARD ====================
  // The card number never comes near this site or the backend: each of these
  // hands back a one-time secret, and Stripe's own form, on the page, takes
  // the card with it (components/payments/CardForm.tsx). Nothing is paid or
  // held because the page says so — only Stripe telling the backend, which then
  // shows on the booking. Refused with `payments_unavailable` while Stripe is
  // not set up, or `feature_off` while the owner has it switched off.

  /**
   * Starts (or picks up) the card payment for one of the customer's rentals.
   *
   * `saveCardForDeposit` also saves the card, so the backend can place the
   * deposit hold on it by itself two days before pickup. Send it ONLY when
   * the customer has been shown, beside the pay button, that the card will be
   * used for that — it is their agreement to a hold placed while they are
   * not there (see components/payments/PayForBooking.tsx).
   */
  async startRentalPayment(
    bookingId: string,
    options: { saveCardForDeposit?: boolean } = {},
  ): Promise<CardPaymentStart> {
    return request<CardPaymentStart>(`/payments/bookings/${encodeURIComponent(bookingId)}/intent`, {
      method: 'POST',
      ...(options.saveCardForDeposit ? { body: { saveCardForDeposit: true } } : {}),
      auth: true,
    });
  },

  /** Where a booking's security deposit stands, and when it may be held. */
  async getDeposit(bookingId: string, signal?: AbortSignal): Promise<DepositState | undefined> {
    return findOrUndefined(
      request<DepositState>(`/deposits/bookings/${encodeURIComponent(bookingId)}`, { signal, auth: true }),
    );
  },

  /**
   * Starts the hold for a booking's deposit: set aside on the card, never
   * taken. Refused with `too_early` before the two days before pickup.
   */
  async startDepositHold(bookingId: string): Promise<CardPaymentStart> {
    return request<CardPaymentStart>(`/deposits/bookings/${encodeURIComponent(bookingId)}/authorize`, {
      method: 'POST',
      auth: true,
    });
  },

  /** The customer's saved cards: brand, last four digits and expiry, never more. */
  async listCards(signal?: AbortSignal): Promise<SavedCard[]> {
    return request<SavedCard[]>('/payments/methods', { signal, auth: true });
  },

  /** A one-time secret for saving a new card through Stripe's own form. */
  async startCardSetup(): Promise<CardPaymentStart> {
    return request<CardPaymentStart>('/payments/methods/setup', { method: 'POST', auth: true });
  },

  async removeCard(cardId: string): Promise<void> {
    await request(`/payments/methods/${encodeURIComponent(cardId)}`, { method: 'DELETE', auth: true });
  },

  /** Makes a card the one offered first, and hands back the cards as they now stand. */
  async makeDefaultCard(cardId: string): Promise<SavedCard[]> {
    return request<SavedCard[]>(`/payments/methods/${encodeURIComponent(cardId)}/default`, {
      method: 'POST',
      auth: true,
    });
  },

  // ==================== MESSAGES ====================
  // Always live, for the same reason as bookings.

  async listThreads(signal?: AbortSignal): Promise<ChatThread[]> {
    return request<ChatThread[]>('/messages/threads', { signal, auth: true });
  },

  async getThread(id: string, signal?: AbortSignal): Promise<ChatThread | undefined> {
    return findOrUndefined(
      request<ChatThread>(`/messages/threads/${encodeURIComponent(id)}`, { signal, auth: true }),
    );
  },

  /**
   * Writes to a business — starting a conversation, or continuing the one
   * already open with them, since the backend keeps one per business. Hands
   * back that conversation with the new message in it. A booking or a car can
   * be attached, so the business sees what the message is about.
   */
  async startThread(input: {
    providerId: string;
    body: string;
    vehicleId?: string;
    bookingId?: string;
  }): Promise<ChatThread> {
    return request<ChatThread>('/messages/threads', { method: 'POST', body: input, auth: true });
  },

  /**
   * Sends a message and hands back the whole conversation as it now stands,
   * the new message included — so the screen shows what the backend stored,
   * not what it hoped it stored.
   */
  async sendMessage(threadId: string, body: string): Promise<ChatThread> {
    return request<ChatThread>(`/messages/threads/${encodeURIComponent(threadId)}/messages`, {
      method: 'POST',
      body: { body },
      auth: true,
    });
  },

  /** Marks the business's messages in a conversation as read. */
  async markThreadRead(threadId: string): Promise<void> {
    await request(`/messages/threads/${encodeURIComponent(threadId)}/read`, {
      method: 'POST',
      auth: true,
    });
  },

  // ==================== NOTIFICATIONS ====================
  // Always live, for the same reason as bookings.

  async listNotifications(signal?: AbortSignal): Promise<AppNotification[]> {
    return request<AppNotification[]>('/notifications', { signal, auth: true });
  },

  async markNotificationRead(id: string): Promise<void> {
    await request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST', auth: true });
  },

  async markAllNotificationsRead(): Promise<void> {
    await request('/notifications/read-all', { method: 'POST', auth: true });
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
  // customer-facing screen. Always live: it is somebody's own business, and a
  // sample answer is how every visitor used to "own" the same made-up one.

  async getBusinessSummary(signal?: AbortSignal): Promise<BusinessSummary> {
    return request<BusinessSummary>('/providers/me/summary', { signal, auth: true });
  },

  /**
   * The signed-in person's own business. It is how the site decides whether
   * somebody has a business at all (see lib/business.tsx). Fails with
   * `not_a_provider` when they have none.
   */
  async getBusinessProfile(signal?: AbortSignal): Promise<BusinessProfile> {
    return request<BusinessProfile>('/providers/me', { signal, auth: true });
  },

  /**
   * Registers a business for the signed-in person. Hands back its private
   * record. Fails with `already_a_provider` if they have one already.
   */
  async applyAsProvider(application: BusinessApplication): Promise<BusinessProfile> {
    return request<BusinessProfile>('/providers/apply', {
      method: 'POST',
      body: application,
      auth: true,
    });
  },

  /** Changes the business's own details. Only the fields given change. */
  async updateBusinessProfile(
    changes: Partial<Omit<BusinessApplication, 'businessName' | 'side' | 'registrationStatus' | 'registrationNumber' | 'registeredIn'>>,
  ): Promise<BusinessProfile> {
    return request<BusinessProfile>('/providers/me', { method: 'PATCH', body: changes, auth: true });
  },

  /**
   * Every car the business has listed — including those still waiting for
   * staff approval, which the public catalogue leaves out. That is also why
   * the dashboard looks its cars up here and not in the catalogue.
   */
  async getMyFleet(signal?: AbortSignal): Promise<FleetVehicle[]> {
    return request<FleetVehicle[]>('/providers/me/vehicles', { signal, auth: true });
  },

  /** Lists a new car. It waits for staff approval before customers see it. */
  async addVehicle(input: VehicleInput): Promise<FleetVehicle> {
    return request<FleetVehicle>('/providers/me/vehicles', { method: 'POST', body: input, auth: true });
  },

  async updateVehicle(id: string, changes: Partial<VehicleInput>): Promise<FleetVehicle> {
    return request<FleetVehicle>(`/providers/me/vehicles/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: changes,
      auth: true,
    });
  },

  /**
   * Takes a car off the platform. Fails with `vehicle_has_bookings` while it
   * still has bookings to honour.
   */
  async removeVehicle(id: string): Promise<void> {
    await request(`/providers/me/vehicles/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
  },

  // ==================== A CAR'S PHOTOS ====================
  // The photo itself never passes through the backend. It signs a ticket, the
  // file goes straight to Cloudinary with it (lib/api/upload.ts), and the
  // backend is then told the address. Until Cloudinary is set up there, the
  // ticket is refused with `uploads_unavailable`, which screens show as "not
  // switched on yet".

  /** The photos of one of the business's own cars, the cover first. */
  async getVehiclePhotos(vehicleId: string, signal?: AbortSignal): Promise<VehiclePhoto[]> {
    return notYetIfMissing(
      request<VehiclePhoto[]>(photosPath(vehicleId), { signal, auth: true }),
      'Car photos',
    );
  },

  /**
   * Steps one and two: a ticket from the backend, then the file straight to
   * Cloudinary with it. Hands back the address the photo is now at — which
   * is NOT on the listing until attachVehiclePhoto puts it there. The two are
   * kept apart so that a retry after a dropped connection can send the
   * address again without uploading the file a second time.
   *
   * Give it a photo made ready by preparePhoto in lib/photos.ts.
   */
  async uploadVehiclePhoto(vehicleId: string, photo: Blob, signal?: AbortSignal): Promise<string> {
    const ticket = await notYetIfMissing(
      request<PhotoUploadTicket>(`${photosPath(vehicleId)}/upload-ticket`, {
        method: 'POST',
        signal,
        auth: true,
      }),
      'Car photos',
    );
    return uploadPhoto(ticket, photo, signal);
  },

  /**
   * Step three: puts an uploaded photo on the listing, last in the order, and
   * hands back all of the car's photos. The same address sent twice changes
   * nothing, so this is safe to try again. Refused with `photo_not_recognised`
   * for an address that was not uploaded for this car, and `too_many_photos`
   * past twelve.
   */
  async attachVehiclePhoto(vehicleId: string, url: string): Promise<VehiclePhoto[]> {
    return request<VehiclePhoto[]>(photosPath(vehicleId), {
      method: 'POST',
      body: { url },
      auth: true,
    });
  },

  /**
   * Puts the photos in a new order. Every photo, each exactly once
   * (`incomplete_order` otherwise). The first is the cover.
   */
  async orderVehiclePhotos(vehicleId: string, order: string[]): Promise<VehiclePhoto[]> {
    return request<VehiclePhoto[]>(photosPath(vehicleId), {
      method: 'PATCH',
      body: { order },
      auth: true,
    });
  },

  /** Takes a photo off the listing, and hands back the ones left. */
  async removeVehiclePhoto(vehicleId: string, photoId: string): Promise<VehiclePhoto[]> {
    return request<VehiclePhoto[]>(`${photosPath(vehicleId)}/${encodeURIComponent(photoId)}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  async getFleetPerformance(signal?: AbortSignal): Promise<VehiclePerformance[]> {
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
    return request<ProviderBooking[]>('/providers/me/bookings', { signal, auth: true });
  },

  async getProviderBooking(id: string, signal?: AbortSignal): Promise<ProviderBooking | undefined> {
    return findOrUndefined(
      request<ProviderBooking>(`/providers/me/bookings/${encodeURIComponent(id)}`, {
        signal,
        auth: true,
      }),
    );
  },

  /** Conversations with renters — same contact-detail rule as the bookings above. */
  async getBusinessThreads(signal?: AbortSignal): Promise<BusinessChatThread[]> {
    return request<BusinessChatThread[]>('/providers/me/messages', { signal, auth: true });
  },

  async getBusinessThread(id: string, signal?: AbortSignal): Promise<BusinessChatThread | undefined> {
    return findOrUndefined(
      request<BusinessChatThread>(`/providers/me/messages/${encodeURIComponent(id)}`, {
        signal,
        auth: true,
      }),
    );
  },

  /**
   * Replies to a renter and hands back the conversation as it now stands. A
   * reply is words, a car to suggest, or both.
   */
  async replyAsBusiness(threadId: string, body: string): Promise<BusinessChatThread> {
    return request<BusinessChatThread>(
      `/providers/me/messages/${encodeURIComponent(threadId)}/messages`,
      { method: 'POST', body: { body }, auth: true },
    );
  },

  /** Marks the renter's messages in a conversation as read. */
  async markBusinessThreadRead(threadId: string): Promise<void> {
    await request(`/providers/me/messages/${encodeURIComponent(threadId)}/read`, {
      method: 'POST',
      auth: true,
    });
  },

  async getPayouts(signal?: AbortSignal): Promise<PayoutRecord[]> {
    return request<PayoutRecord[]>('/providers/me/payouts', { signal, auth: true });
  },

  /**
   * Where the business's money goes, read live from Stripe by the backend.
   * `undefined` when the business has no payout record at all, which reads the
   * same as never having started.
   */
  async getPayoutAccount(signal?: AbortSignal): Promise<PayoutAccount | undefined> {
    return findOrUndefined(
      request<PayoutAccount>('/providers/me/payout-account', { signal, auth: true }),
    );
  },

  /**
   * A one-time link to Stripe, where the business gives its bank details.
   * Stripe sends them back to /provider/payouts afterwards — and if the link
   * has expired by the time they use it, to the same page, which offers a new
   * one. Refused with `payments_unavailable` while Stripe is not set up.
   *
   * Only ever an https address on stripe.com: the browser is about to be sent
   * there, and a link anywhere else is not one Stripe made.
   */
  async startPayoutSetup(): Promise<string> {
    const { url } = await request<{ url: string }>('/providers/me/payout-account', {
      method: 'POST',
      body: { returnTo: 'web' },
      auth: true,
    });
    let address: URL | null = null;
    try {
      address = new URL(url);
    } catch {
      address = null;
    }
    const isStripe =
      address !== null &&
      address.protocol === 'https:' &&
      (address.hostname === 'stripe.com' || address.hostname.endsWith('.stripe.com'));
    if (!isStripe) {
      throw new ApiError({
        code: 'unknown',
        message: 'The link to set up payouts did not look right, so it was not opened. Please try again.',
        status: 0,
        developerHint: `POST /providers/me/payout-account returned ${String(url).slice(0, 120)}`,
      });
    }
    return url;
  },

  // ==================== CLOSING AN ACCOUNT OR A BUSINESS ====================
  // On the live backend since 2026-09-27. A backend without them answers
  // `route_not_found`, which both turn into "not connected yet" (see
  // notYetIfMissing) rather than an error that looks like a fault.

  /**
   * Closes the signed-in person's account for good. Needs their password
   * again (`wrong_password` if it is not right). Every session ends and the
   * sign-in cookie is taken off. Refused, in words worth showing, while a
   * rental is coming up or out (`has_live_rental`), a deposit is held
   * (`has_held_deposit`), or they run a business that is still open
   * (`owns_business`).
   */
  async closeAccount(password: string): Promise<void> {
    await notYetIfMissing(
      request('/customers/me/close', { method: 'POST', body: { password }, auth: true }),
      'Closing an account',
    );
  },

  /**
   * Closes the signed-in person's business: every car comes off SXM Rentals
   * and the business page goes. Needs their password again (`wrong_password`
   * if it is not right). Only its owner can (`owner_only`), and not while a
   * rental is coming up or out (`has_live_rental`), a deposit is held
   * (`has_held_deposit`) or a payment to the business is still on its way
   * (`payout_pending`). Their own account stays open, and they may register a
   * business again afterwards.
   */
  async closeBusiness(password: string): Promise<void> {
    await notYetIfMissing(
      request('/providers/me/close', { method: 'POST', body: { password }, auth: true }),
      'Closing a business',
    );
  },

  // ==================== BUILT, BUT WITH NOTHING BEHIND THEM ====================
  // These screens exist and the backend has no address for them. They refuse
  // in a way the screen recognises, so it shows "not connected yet" rather
  // than a spinner that never stops or an error that looks like a fault.

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
    return legalDocuments;
  },

  async getLegalDocument(slug: string): Promise<LegalDocument | undefined> {
    return findLegalDocument(slug);
  },
};
