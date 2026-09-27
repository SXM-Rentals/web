// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the booking flow now that the backend prices the
// rental and makes the booking — the car page's total, the payment step, the
// confirmation, and the page after it.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - the site working out its own price again, and disagreeing with the bill;
//   - a car booked by somebody else in the meantime still looking bookable;
//   - a refused booking reported as "something went wrong" instead of why;
//   - the confirmation showing a made-up reference;
//   - the payment step drawing a card form on a page that takes no payment.

import React, { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import { SessionProvider } from '@/lib/auth';
import { TripProvider, useTrip, type Trip } from '@/lib/trip';
import type { Booking, BookingQuote, User, Vehicle } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
// Imported once, at the top — see the note in customer-screens.test.tsx.
import { BookingPanel } from '@/components/vehicle/BookingPanel';
import { BookingPaymentStep } from '@/components/booking/BookingPaymentStep';
import { BookingConfirmStep } from '@/components/booking/BookingConfirmStep';
import { BookingDoneStep } from '@/components/booking/BookingDoneStep';

const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), params: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push, replace: nav.replace, back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => nav.params,
  usePathname: () => '/booking/v1',
}));

const CAR = {
  id: 'v1',
  make: 'Kia',
  model: 'Picanto',
  year: 2023,
  seats: 4,
  dailyRate: 38,
  minimumDays: 1,
  maximumDays: 30,
  depositAmount: 250,
  pickupTown: 'Simpson Bay',
  side: 'dutch',
  deliveryAvailable: false,
  unavailableDates: [],
} as unknown as Vehicle;

// The backend's price for three days: a 5% service fee on $114 is $5.70.
const QUOTE: BookingQuote = {
  days: 3,
  lines: [
    { label: 'Rental (3 days x $38)', amount: 114 },
    { label: 'Service fee', amount: 5.7 },
  ],
  totalDueToday: 119.7,
  depositAmount: 250,
  available: true,
};

const CUSTOMER = {
  id: 'c1',
  firstName: 'Tessa',
  lastName: 'Customer',
  email: 'customer@example.com',
  phone: '',
  accountType: 'tourist',
  verification: { status: 'unstarted', selfieDone: false, licenseDone: false, identityDocDone: false },
  isIslander: false,
  memberSince: '2026-09-21T00:00:00.000Z',
} as User;

const DATES: Partial<Trip> = { startDate: '2030-10-05', endDate: '2030-10-08', collection: 'pickup' };

// The trip as somebody arriving from a car page has it: dates already chosen.
function WithDates({ children }: { children: React.ReactNode }) {
  const { setTrip, hasDates } = useTrip();
  useEffect(() => {
    setTrip(DATES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return hasDates ? <>{children}</> : null;
}

function renderWithTrip(ui: React.ReactElement) {
  return render(
    <SessionProvider>
      <TripProvider>
        <WithDates>{ui}</WithDates>
      </TripProvider>
    </SessionProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.params = new URLSearchParams();
});

describe('the price on a car page', () => {
  it('is the backend’s, cents and all — not a sum worked out in the browser', async () => {
    const calls = fakeBackend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /bookings/quote': { status: 200, body: QUOTE },
    });
    renderWithTrip(<BookingPanel vehicle={CAR} />);

    await screen.findByText('$119.70');
    expect(screen.getByText('Rental (3 days x $38)')).toBeInTheDocument();
    expect(screen.getByText('$5.70')).toBeInTheDocument();
    // Nothing is charged online, so nothing is "due today".
    expect(screen.queryByText(/due today/i)).not.toBeInTheDocument();
    expect(calls.sent.find((entry) => entry.call === 'POST /bookings/quote')?.body).toEqual({
      vehicleId: 'v1',
      startDate: '2030-10-05',
      endDate: '2030-10-08',
      collection: 'pickup',
    });
  });

  it('says so when the car has been booked for those dates in the meantime', async () => {
    fakeBackend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /bookings/quote': { status: 200, body: { ...QUOTE, available: false } },
    });
    renderWithTrip(<BookingPanel vehicle={CAR} />);

    await screen.findByText(/has just been booked for those dates/i);
    expect(screen.getByRole('button', { name: /Book This Car/i })).toBeDisabled();
  });
});

describe('the payment step', () => {
  it('takes no payment, says so, and draws no card form', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: CUSTOMER },
      'POST /bookings/quote': { status: 200, body: QUOTE },
    });
    renderWithTrip(<BookingPaymentStep vehicle={CAR} />);

    await screen.findByText(/You settle \$119\.70 with the rental business/);
    expect(screen.getByText('Paying Online Is Not Connected Yet')).toBeInTheDocument();
    expect(screen.queryByText(/card number/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pay and continue/i)).not.toBeInTheDocument();
  });
});

describe('confirming a booking', () => {
  it('shows the backend’s refusal in its own words, and goes nowhere', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: CUSTOMER },
      'POST /bookings/quote': { status: 200, body: QUOTE },
      'POST /bookings': refusal(409, 'vehicle_unavailable', 'Sorry — this vehicle has just been booked for those dates.'),
    });
    renderWithTrip(<BookingConfirmStep vehicle={CAR} />);

    const confirm = await screen.findByRole('button', { name: /Confirm Booking/i });
    await waitFor(() => expect(confirm).toBeEnabled());
    fireEvent.click(confirm);

    await screen.findByText('Sorry — this vehicle has just been booked for those dates.');
    expect(nav.push).not.toHaveBeenCalled();
  });

  it('carries the real reference to the page after it', async () => {
    const calls = fakeBackend({
      'GET /customers/me': { status: 200, body: CUSTOMER },
      'POST /bookings/quote': { status: 200, body: QUOTE },
      'POST /bookings': { status: 201, body: { id: 'b1', reference: 'SXM-4821' } as Booking },
    });
    renderWithTrip(<BookingConfirmStep vehicle={CAR} />);

    const confirm = await screen.findByRole('button', { name: /Confirm Booking/i });
    await waitFor(() => expect(confirm).toBeEnabled());
    fireEvent.click(confirm);

    await waitFor(() => expect(nav.push).toHaveBeenCalledWith('/booking/v1/done?ref=SXM-4821&booking=b1'));
    // Only the trip is sent; the price is the backend's to work out.
    const sent = calls.sent.find((entry) => entry.call === 'POST /bookings')?.body as Record<string, unknown>;
    expect(sent).toMatchObject({ vehicleId: 'v1', startDate: '2030-10-05', endDate: '2030-10-08', collection: 'pickup' });
    expect(sent).not.toHaveProperty('totalDueToday');
  });
});

describe('the page after booking', () => {
  it('shows the booking that was made, never a made-up one', async () => {
    fakeBackend({ 'GET /customers/me': { status: 200, body: CUSTOMER } });
    nav.params = new URLSearchParams('ref=SXM-4821&booking=b1');
    renderWithTrip(<BookingDoneStep vehicle={CAR} />);

    await screen.findByText('SXM-4821');
    expect(screen.queryByText('SXM-DEMO')).not.toBeInTheDocument();
    expect(screen.queryByText(/this is a demo booking/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See My Rentals/i })).toHaveAttribute('href', '/account/rentals/b1');
  });
});
