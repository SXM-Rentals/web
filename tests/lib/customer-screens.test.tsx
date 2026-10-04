// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the customer's signed-in screens now that they
// read from and write to the backend — rentals, cancelling, notifications and
// messages.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - one catalogue fetch shared by every screen, and a failed one not
//     remembered, so the next screen tries again;
//   - a booking still shown when the car names could not be fetched;
//   - the cancel page never quoting a refund nobody will pay;
//   - "read" taken back off a notification the backend would not mark;
//   - a message that failed to send left in the box, not lost.

import React, { Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import { apiClient, clearCatalogueLookup } from '@/lib/api-client';
import type { AppNotification, Booking, ChatThread, Provider, Vehicle } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
// Pages are imported here, once, rather than inside each test: loading a page
// module is slow the first time, and inside a test that time counts against
// the test's limit — enough, with every test file running at once, to make
// a test fail at random.
import CancelRentalPage from '@/app/(site)/account/rentals/[id]/cancel/page';
import NotificationsPage from '@/app/(site)/account/notifications/page';
import { MessagesView } from '@/components/messages/MessagesView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/account',
}));

const CAR = { id: 'v1', make: 'Kia', model: 'Picanto', dailyRate: 38, unavailableDates: [], providerId: 'p1' } as unknown as Vehicle;
const BUSINESS = { id: 'p1', businessName: 'Harbour View Rentals' } as Provider;

const BOOKING = {
  id: 'b1',
  reference: 'SXM-6788',
  vehicleId: 'v1',
  providerId: 'p1',
  status: 'upcoming',
  startDate: '2030-10-05',
  endDate: '2030-10-08',
  pickupTime: '10:00',
  returnTime: '10:00',
  collection: 'pickup',
  location: 'Simpson Bay',
  lines: [{ label: '3 days × $38', amount: 114 }],
  depositAmount: 250,
  depositStatus: 'not_taken',
  totalDueToday: 114,
  agreementSigned: false,
  createdAt: '2026-09-21T00:00:00.000Z',
} as Booking;

/**
 * Page parameters as Next.js hands them over: a promise. Marked as already
 * settled, which React reads directly — otherwise `use(params)` suspends in a
 * test and never wakes, because nothing outside a real app nudges it again.
 */
function settledParams<T>(value: T): Promise<T> {
  return Object.assign(Promise.resolve(value), { status: 'fulfilled', value });
}

beforeEach(() => {
  clearCatalogueLookup();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the shared lookup of cars and businesses', () => {
  it('fetches the catalogue once, however many screens ask', async () => {
    const calls = fakeBackend({
      'GET /vehicles': { status: 200, body: [CAR] },
      'GET /providers': { status: 200, body: [BUSINESS] },
    });
    const [first, second] = await Promise.all([apiClient.catalogueLookup(), apiClient.catalogueLookup()]);
    expect(first.vehicle('v1')?.model).toBe('Picanto');
    expect(second.provider('p1')?.businessName).toBe('Harbour View Rentals');
    expect(calls.filter((c) => c === 'GET /vehicles')).toHaveLength(1);
  });

  it('does not remember a failed fetch — the next screen tries again', async () => {
    let fail = true;
    fakeBackend({
      'GET /vehicles': () => (fail ? refusal(500, 'unknown') : { status: 200, body: [CAR] }),
      'GET /providers': { status: 200, body: [BUSINESS] },
    });
    await expect(apiClient.catalogueLookup()).rejects.toBeDefined();
    fail = false;
    const lookup = await apiClient.catalogueLookup();
    expect(lookup.vehicle('v1')?.make).toBe('Kia');
  });
});

describe('cancelling a rental', () => {
  async function openCancelPage() {
    const params = settledParams({ id: 'b1' });
    render(
      <Suspense fallback={null}>
        <CancelRentalPage params={params} />
      </Suspense>,
    );
    await screen.findByText(/Kia Picanto/);
  }

  it('quotes no refund amount — the backend works none out', async () => {
    fakeBackend({
      'GET /bookings/b1': { status: 200, body: BOOKING },
      'GET /vehicles': { status: 200, body: [CAR] },
      'GET /providers': { status: 200, body: [BUSINESS] },
    });
    await openCancelPage();
    expect(screen.queryByText(/will go back to the card/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^refund$/i)).not.toBeInTheDocument();
    // What it does say: the refund policy, as a pointer.
    expect(screen.getByText(/cancellation and refund policy/i)).toBeInTheDocument();
  });

  it('cancels through the backend', async () => {
    const calls = fakeBackend({
      'GET /bookings/b1': { status: 200, body: BOOKING },
      'GET /vehicles': { status: 200, body: [CAR] },
      'GET /providers': { status: 200, body: [BUSINESS] },
      'POST /bookings/b1/cancel': { status: 200, body: { ...BOOKING, status: 'cancelled' } },
    });
    await openCancelPage();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /cancel this rental/i }));

    expect(await screen.findByText(/rental cancelled/i)).toBeInTheDocument();
    expect(calls).toContain('POST /bookings/b1/cancel');
  });

  it('treats "already cancelled" as done, not as a failure', async () => {
    fakeBackend({
      'GET /bookings/b1': { status: 200, body: BOOKING },
      'GET /vehicles': { status: 200, body: [CAR] },
      'GET /providers': { status: 200, body: [BUSINESS] },
      'POST /bookings/b1/cancel': refusal(409, 'already_cancelled'),
    });
    await openCancelPage();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /cancel this rental/i }));
    expect(await screen.findByText(/rental cancelled/i)).toBeInTheDocument();
  });

  it('still shows the booking when the car names cannot be fetched', async () => {
    fakeBackend({
      'GET /bookings/b1': { status: 200, body: BOOKING },
      'GET /vehicles': refusal(500, 'unknown'),
      'GET /providers': refusal(500, 'unknown'),
    });
    const params = settledParams({ id: 'b1' });
    render(
      <Suspense fallback={null}>
        <CancelRentalPage params={params} />
      </Suspense>,
    );
    // No car name — but the page, and the booking, are there.
    expect(await screen.findByText(/your rental car/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel this rental/i })).toBeInTheDocument();
  });
});

describe('notifications', () => {
  it('takes the "read" mark back off when the backend refuses it', async () => {
    const item: AppNotification = {
      id: 'n1',
      kind: 'booking_confirmed',
      title: 'Your booking is confirmed',
      body: 'SXM-6788',
      sentAt: '2026-09-21T10:00:00.000Z',
      read: false,
    } as AppNotification;
    fakeBackend({
      'GET /notifications': { status: 200, body: [item] },
      'POST /notifications/n1/read': refusal(500, 'unknown'),
    });
    render(<NotificationsPage />);

    const mark = await screen.findByRole('button', { name: /mark "your booking is confirmed" as read/i });
    fireEvent.click(mark);
    // It vanishes at once, then comes back when the backend refuses.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /mark "your booking is confirmed" as read/i })).toBeInTheDocument(),
    );
  });
});

describe('a notification about a rental', () => {
  it('opens the rental it is about — where a deposit hold that needs the customer is done', async () => {
    const item = {
      id: 'n2',
      kind: 'deposit_hold_needed',
      title: 'Your deposit hold needs you',
      body: 'Your bank wants you to approve the $55 deposit hold for SXM-6151.',
      sentAt: '2026-10-04T10:00:00.000Z',
      read: false,
      bookingId: 'b1',
    } as AppNotification;
    fakeBackend({ 'GET /notifications': { status: 200, body: [item] } });
    render(<NotificationsPage />);

    expect(await screen.findByText(/your deposit hold needs you/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open the Rental/i })).toHaveAttribute('href', '/account/rentals/b1');
  });
});

describe('messages', () => {
  it('keeps a message in the box when it fails to send', async () => {
    const thread: ChatThread = {
      id: 't1',
      providerId: 'p1',
      messages: [{ id: 'm1', from: 'provider', body: 'Welcome aboard.', sentAt: '2026-09-21T10:00:00.000Z', read: true }],
      unreadCount: 0,
    } as ChatThread;
    fakeBackend({
      'GET /messages/threads': { status: 200, body: [thread] },
      'GET /vehicles': { status: 200, body: [CAR] },
      'GET /providers': { status: 200, body: [BUSINESS] },
      'POST /messages/threads/t1/messages': refusal(500, 'unknown', 'The message could not be sent.'),
    });
    render(<MessagesView threadId="t1" />);

    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: 'Is it free next week?' } });
    fireEvent.submit(box.closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be sent/i);
    expect(box).toHaveValue('Is it free next week?');
  });
});
