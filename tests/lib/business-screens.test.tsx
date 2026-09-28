// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the business dashboard's screens now that they
// read from and write to the backend — adding, editing and removing a car,
// the bookings list, replying to a renter, and registering a business.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - a new car sent without the map position the backend requires;
//   - an edit sending fields the backend ignores, so the form would look
//     saved and not be;
//   - a car with a rental coming up "removed" on screen when it was not;
//   - a cancelled booking still promising the business its payout;
//   - a reply that failed to send thrown away, or a sent one not stored;
//   - an application going off without the registered name, town and side;
//   - an empty accident history reading to a customer as a clean one.

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import { SessionProvider } from '@/lib/auth';
import { BusinessProvider } from '@/lib/business';
import type {
  BusinessChatThread,
  BusinessProfile,
  FleetVehicle,
  Provider,
  ProviderBooking,
  User,
  Vehicle,
} from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
// Imported once, at the top — see the note in customer-screens.test.tsx.
import { VehicleForm } from '@/components/business/VehicleForm';
import { ProviderMessagesView } from '@/components/business/ProviderMessagesView';
import { AccidentBlock } from '@/components/vehicle/VehicleDetails';
import ProviderBookingsPage from '@/app/provider/bookings/page';
import ProviderApplyPage from '@/app/provider/apply/page';

const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push, replace: nav.replace, back: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/provider',
}));

// A car still waiting for approval: in the business's fleet, not in search.
const FLEET_CAR = {
  id: 'v7',
  reference: 'SXM-V-4410',
  listingStatus: 'pending_review',
  providerId: 'p9',
  make: 'Kia',
  model: 'Picanto',
  year: 2023,
  trim: '',
  vehicleClass: 'economy',
  transmission: 'automatic',
  fuel: 'petrol',
  seats: 4,
  doors: 5,
  airConditioning: true,
  dailyRate: 38,
  weeklyRate: undefined,
  minimumDays: 1,
  maximumDays: 30,
  depositAmount: 250,
  pickupTown: 'Simpson Bay',
  side: 'dutch',
  deliveryAvailable: false,
  description: '',
  accidentHistory: [],
  rating: 0,
  reviewCount: 0,
  unavailableDates: [],
} as unknown as FleetVehicle;

const CANCELLED_BOOKING = {
  id: 'b4',
  reference: 'SXM-7001',
  vehicleId: 'v7',
  status: 'cancelled',
  renterDisplayName: 'Maria K.',
  renterVerified: true,
  startDate: '2030-10-05',
  endDate: '2030-10-08',
  pickupTime: '10:00',
  returnTime: '10:00',
  collection: 'pickup',
  location: 'Simpson Bay',
  // The backend keeps a cancelled booking's original figures.
  grossAmount: 300,
  commission: 90,
  netAmount: 210,
  depositAmount: 250,
  depositStatus: 'released',
} as ProviderBooking;

const THREAD = {
  id: 't1',
  renterDisplayName: 'Maria K.',
  renterVerified: true,
  bookingRef: 'SXM-7001',
  vehicleId: 'v7',
  messages: [
    { id: 'm1', from: 'customer', body: 'Where do I collect the car?', sentAt: '2026-09-21T09:00:00.000Z', read: false },
  ],
  unreadCount: 1,
} as BusinessChatThread;

beforeEach(() => {
  // The car form scrolls back to the top when it saves. The test browser has
  // no page to scroll, and says so loudly.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  nav.push.mockReset();
  nav.replace.mockReset();
});

// Every label on the form has a required-field star after it, so labels are
// matched from their start — and without regard to case where the form's
// label style puts them in Title Case.
const field = (label: RegExp) => screen.getByLabelText(label);
const type = (label: RegExp, value: string) => fireEvent.change(field(label), { target: { value } });

describe('adding a car', () => {
  it('sends the town with its side and map position, and says it waits for approval', async () => {
    const calls = fakeBackend({
      'POST /providers/me/vehicles': { status: 201, body: { ...FLEET_CAR, pickupTown: 'Marigot', side: 'french' } },
    });
    render(<VehicleForm />);

    type(/^Make/, 'Kia');
    type(/^Model/, 'Picanto');
    type(/^Year/, '2023');
    type(/^Daily rate/i, '38');
    type(/^Deposit amount/i, '250');
    type(/^Collected from/, 'Marigot');
    fireEvent.click(screen.getByRole('button', { name: /Add This Vehicle/i }));

    await screen.findByText('Submitted for Approval');
    const sent = calls.sent.find((entry) => entry.call === 'POST /providers/me/vehicles')?.body as Record<string, unknown>;
    expect(sent).toMatchObject({
      make: 'Kia',
      model: 'Picanto',
      year: 2023,
      dailyRate: 38,
      depositAmount: 250,
      pickupTown: 'Marigot',
      side: 'french',
      latitude: 18.068,
      longitude: -63.0825,
    });
    // Neither of these has anywhere to go on the backend.
    expect(sent).not.toHaveProperty('deliveryFee');
    expect(sent).not.toHaveProperty('accidentHistory');
  });

  it('will not send without a town from the list', () => {
    const calls = fakeBackend({});
    render(<VehicleForm />);
    type(/^Make/, 'Kia');
    type(/^Model/, 'Picanto');
    type(/^Year/, '2023');
    type(/^Daily rate/i, '38');
    type(/^Deposit amount/i, '250');

    expect(screen.getByText('Choose where the vehicle is collected from.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add This Vehicle/i })).toBeDisabled();
    expect(calls).toHaveLength(0);
  });
});

describe('editing a car', () => {
  it('offers only what the backend will change, and sends only that', async () => {
    const calls = fakeBackend({
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [] },
      'PATCH /providers/me/vehicles/v7': { status: 200, body: { ...FLEET_CAR, dailyRate: 42 } },
    });
    render(<VehicleForm vehicle={FLEET_CAR} />);

    // What the car is, and where it is collected from, are shown — not offered.
    expect(screen.queryByLabelText(/^Make/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Collected from/)).not.toBeInTheDocument();
    expect(screen.getByText('Kia Picanto')).toBeInTheDocument();

    type(/^Daily rate/i, '42');
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await screen.findByText('Changes Saved');
    const sent = calls.sent.find((entry) => entry.call === 'PATCH /providers/me/vehicles/v7')?.body as Record<string, unknown>;
    expect(sent.dailyRate).toBe(42);
    for (const ignored of ['make', 'model', 'year', 'vehicleClass', 'transmission', 'fuel', 'pickupTown', 'side', 'latitude', 'longitude']) {
      expect(sent, `${ignored} was sent`).not.toHaveProperty(ignored);
    }
  });

  it('keeps a car with a rental coming up, and says why', async () => {
    fakeBackend({
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [] },
      'DELETE /providers/me/vehicles/v7': refusal(
        409,
        'vehicle_has_bookings',
        'This vehicle has a rental coming up, so it cannot be removed yet.',
      ),
    });
    render(<VehicleForm vehicle={FLEET_CAR} />);

    fireEvent.click(screen.getByRole('button', { name: /Remove This Vehicle/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Remove It/i }));

    await screen.findByText('This vehicle has a rental coming up, so it cannot be removed yet.');
    expect(nav.push).not.toHaveBeenCalled();
  });
});

describe('the bookings list', () => {
  it('names a car still waiting for approval, and promises nothing for a cancelled booking', async () => {
    fakeBackend({
      'GET /providers/me/bookings': { status: 200, body: [CANCELLED_BOOKING] },
      'GET /providers/me/vehicles': { status: 200, body: [FLEET_CAR] },
    });
    render(<ProviderBookingsPage />);

    fireEvent.click(await screen.findByRole('tab', { name: /Past/ }));

    // From the business's own fleet: this car is not in the public catalogue.
    await screen.findByText('Kia Picanto');
    expect(screen.getByText('Cancelled — nothing is paid out')).toBeInTheDocument();
    expect(screen.queryByText('$210')).not.toBeInTheDocument();
    // "Returned" would describe a hold that may never have been placed.
    expect(screen.queryByText(/RETURNED/)).not.toBeInTheDocument();
  });
});

describe('replying to a renter', () => {
  it('marks the conversation read, and shows the reply as the backend stored it', async () => {
    const reply = { id: 'm2', from: 'provider', body: 'At our Simpson Bay office.', sentAt: '2026-09-21T09:05:00.000Z', read: true };
    const calls = fakeBackend({
      'GET /providers/me/messages': { status: 200, body: [THREAD] },
      'GET /providers/me/vehicles': { status: 200, body: [FLEET_CAR] },
      'POST /providers/me/messages/t1/read': { status: 204 },
      'POST /providers/me/messages/t1/messages': {
        status: 201,
        body: { ...THREAD, unreadCount: 0, messages: [...THREAD.messages, reply] },
      },
    });
    render(<ProviderMessagesView threadId="t1" />);

    await screen.findAllByText('Where do I collect the car?');
    await waitFor(() => expect(calls).toContain('POST /providers/me/messages/t1/read'));

    const box = screen.getByRole('textbox');
    fireEvent.change(box, { target: { value: 'At our Simpson Bay office.' } });
    fireEvent.submit(box.closest('form')!);

    // In the list's preview and in the conversation itself.
    await screen.findAllByText('At our Simpson Bay office.');
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/messages/t1/messages')?.body).toEqual({
      body: 'At our Simpson Bay office.',
    });
    expect(box).toHaveValue('');
  });

  it('keeps a reply that did not send', async () => {
    fakeBackend({
      'GET /providers/me/messages': { status: 200, body: [{ ...THREAD, unreadCount: 0 }] },
      'GET /providers/me/vehicles': { status: 200, body: [FLEET_CAR] },
      'POST /providers/me/messages/t1/messages': refusal(500, 'unknown', 'Something went wrong on our side.'),
    });
    render(<ProviderMessagesView threadId="t1" />);

    await screen.findAllByText('Where do I collect the car?');
    const box = screen.getByRole('textbox');
    fireEvent.change(box, { target: { value: 'At our office.' } });
    fireEvent.submit(box.closest('form')!);

    await screen.findByRole('alert');
    expect(box).toHaveValue('At our office.');
  });
});

describe('registering a business', () => {
  const OWNER = {
    id: 'c2',
    firstName: 'Omar',
    lastName: 'Owner',
    email: 'owner@example.com',
    phone: '',
    accountType: 'local',
    verification: { status: 'unstarted', selfieDone: false, licenseDone: false, identityDocDone: false },
    isIslander: true,
    memberSince: '2026-09-21T00:00:00.000Z',
  } as User;

  it('sends the registered name, town and side, then says it was received', async () => {
    let applied = false;
    const calls = fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': () =>
        applied
          ? { status: 200, body: { providerId: 'p9', legalName: 'Harbour View Rentals N.V.' } as BusinessProfile }
          : refusal(403, 'not_a_provider', 'This account is not linked to a rental business.'),
      'GET /providers/p9': { status: 200, body: { id: 'p9', businessName: 'Harbour View Rentals' } as Provider },
      'POST /providers/apply': () => {
        applied = true;
        return { status: 201, body: { providerId: 'p9' } };
      },
    });
    render(
      <SessionProvider>
        <BusinessProvider>
          <ProviderApplyPage />
        </BusinessProvider>
      </SessionProvider>,
    );

    // The contact starts as the person signed in.
    await waitFor(() => expect(field(/^Your Name/)).toHaveValue('Omar Owner'));
    type(/^Business Name/, 'Harbour View Rentals');
    type(/^Registered Name/, 'Harbour View Rentals N.V.');
    type(/^Phone/i, '+1 721 555 0100');
    type(/^Town/, 'Philipsburg');
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    for (const box of await screen.findAllByRole('checkbox')) fireEvent.click(box);
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await screen.findByText(/Application Received/i);
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/apply')?.body).toMatchObject({
      businessName: 'Harbour View Rentals',
      legalName: 'Harbour View Rentals N.V.',
      ownerName: 'Omar Owner',
      contactEmail: 'owner@example.com',
      ownerPhone: '+1 721 555 0100',
      town: 'Philipsburg',
      side: 'dutch',
      operatingSide: 'dutch',
      registrationStatus: 'registered',
    });
  });
});

describe('the accident history on a listing', () => {
  it('does not present an empty history as a clean one', () => {
    render(<AccidentBlock vehicle={{ accidentHistory: [] } as unknown as Vehicle} />);
    expect(screen.queryByText(/No accidents reported/i)).not.toBeInTheDocument();
    expect(screen.getByText(/not recorded on SXM Rentals yet/)).toBeInTheDocument();
    // "As reported by the provider" beside a report nobody made.
    expect(screen.queryByText(/As reported by the provider/)).not.toBeInTheDocument();
  });
});
