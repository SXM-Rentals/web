// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests paying by card — for a rental, holding a
// deposit, and saving a card.
//
// Stripe's own form cannot load in the test browser, so it is stood in for: a
// box where the card fields would be, and a Stripe that answers how a test
// says it should. What is checked is everything around it.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - "paid" said because Stripe accepted the card, before the booking says so;
//   - Stripe sent back somewhere other than the rental's own page;
//   - a declined card, or a refusing bank, reported as anything but that;
//   - a payment started just by opening a page;
//   - a deposit hold offered before the backend would accept it;
//   - a card removed on a single click.

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import type { Booking, DepositState, SavedCard } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
import { PayForBooking } from '@/components/payments/PayForBooking';
import { HoldDeposit } from '@/components/payments/HoldDeposit';
import PaymentMethodsPage from '@/app/(site)/account/payment-methods/page';

const stripe = vi.hoisted(() => ({ confirmPayment: vi.fn(), confirmSetup: vi.fn() }));
const address = vi.hoisted(() => ({ search: '' }));

vi.mock('@stripe/react-stripe-js', async () => {
  const React = await import('react');
  return {
    Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    // Where Stripe's card fields would be. Reports itself filled in.
    PaymentElement: ({ onChange }: { onChange?: (event: { complete: boolean }) => void }) => {
      React.useEffect(() => onChange?.({ complete: true }), []);
      return <div data-testid="stripe-card-fields" />;
    },
    useStripe: () => stripe,
    useElements: () => ({}),
  };
});

vi.mock('@/lib/stripe-client', () => ({
  getStripe: () => Promise.resolve(null),
  STRIPE_TEST_MODE: true,
  STRIPE_PUBLISHABLE_KEY: 'pk_test_stand_in',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(address.search),
  usePathname: () => '/account/rentals/b1',
}));

afterEach(() => {
  vi.unstubAllGlobals();
  stripe.confirmPayment.mockReset();
  stripe.confirmSetup.mockReset();
  address.search = '';
});

// Stripe's form reports the card filled in a moment after it appears, and the
// button waits for that.
async function press(name: RegExp) {
  const button = await screen.findByRole('button', { name });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
}

const BOOKING = {
  id: 'b1',
  reference: 'SXM-4821',
  vehicleId: 'v7',
  status: 'upcoming',
  startDate: '2030-10-05',
  endDate: '2030-10-08',
  totalDueToday: 119.7,
  depositAmount: 250,
  depositStatus: 'not_taken',
  paymentStatus: 'authorized',
  lines: [],
} as unknown as Booking;

const deposit = (changes: Partial<DepositState>): DepositState => ({
  amount: 250,
  status: 'not_taken',
  heldSince: null,
  holdExpiresAt: null,
  expiresBeforeReturn: false,
  holdOpensAt: '2020-01-01T10:00:00.000Z',
  releasedAt: null,
  ...changes,
});

describe('paying for a rental', () => {
  it('starts nothing until asked, then says paid only once the booking does', async () => {
    let asked = 0;
    const calls = fakeBackend({
      'POST /payments/bookings/b1/intent': { status: 200, body: { clientSecret: 'pi_1_secret_x', amount: 119.7 } },
      // Stripe tells the backend a moment after the card goes through.
      'GET /bookings/b1': () => {
        asked += 1;
        return { status: 200, body: { ...BOOKING, paymentStatus: asked >= 2 ? 'paid' : 'authorized' } };
      },
    });
    stripe.confirmPayment.mockResolvedValue({ paymentIntent: { status: 'succeeded' } });
    render(<PayForBooking booking={BOOKING} />);

    expect(calls).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /Pay \$119\.70 by Card/i }));

    await screen.findByTestId('stripe-card-fields');
    expect(screen.getByText(/Test mode: no real card is charged/)).toBeInTheDocument();
    await press(/^Pay \$119\.70$/i);

    await waitFor(() => expect(stripe.confirmPayment).toHaveBeenCalled());
    const sent = stripe.confirmPayment.mock.calls[0][0];
    expect(sent.redirect).toBe('if_required');
    expect(sent.confirmParams.return_url).toMatch(/\/account\/rentals\/b1\?paying=rental$/);

    // Stripe has said yes; the booking has not caught up yet.
    expect(await screen.findByText(/Waiting for your booking to show it as paid/)).toBeInTheDocument();
    expect(await screen.findByText('Paid — $119.70 by card.', {}, { timeout: 8000 })).toBeInTheDocument();
  });

  it('shows a declined card in Stripe’s words, and does not wait for a payment that never happened', async () => {
    const calls = fakeBackend({
      'POST /payments/bookings/b1/intent': { status: 200, body: { clientSecret: 'pi_1_secret_x' } },
    });
    stripe.confirmPayment.mockResolvedValue({ error: { message: 'Your card was declined.' } });
    render(<PayForBooking booking={BOOKING} />);

    fireEvent.click(screen.getByRole('button', { name: /Pay \$119\.70 by Card/i }));
    await screen.findByTestId('stripe-card-fields');
    await press(/^Pay \$119\.70$/i);

    await screen.findByText('Your card was declined.');
    expect(calls).not.toContain('GET /bookings/b1');
  });

  it('says plainly when card payments are switched off', async () => {
    fakeBackend({
      'POST /payments/bookings/b1/intent': refusal(503, 'feature_off', 'This is not switched on yet.'),
    });
    render(<PayForBooking booking={BOOKING} />);

    fireEvent.click(screen.getByRole('button', { name: /Pay \$119\.70 by Card/i }));
    await screen.findByText(/Card payments aren’t switched on yet/);
  });

  it('offers nothing to pay on a paid rental', () => {
    fakeBackend({});
    render(<PayForBooking booking={{ ...BOOKING, paymentStatus: 'paid' }} />);

    expect(screen.getByText('Paid — $119.70 by card.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pay/i })).not.toBeInTheDocument();
  });

  it('says so when the bank turned the payment down on its own page', () => {
    fakeBackend({});
    address.search = 'paying=rental&payment_intent=pi_1&redirect_status=failed';
    render(<PayForBooking booking={BOOKING} />);

    expect(screen.getByText(/Your bank didn’t approve the payment/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay \$119\.70 by Card/i })).toBeInTheDocument();
  });
});

describe('holding the deposit', () => {
  it('says when the hold can be placed, and offers no button before then', async () => {
    fakeBackend({
      'GET /deposits/bookings/b1': { status: 200, body: deposit({ holdOpensAt: '2099-10-03T10:00:00.000Z' }) },
    });
    render(<HoldDeposit booking={BOOKING} />);

    expect(await screen.findByText(/You can place the hold from/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hold/i })).not.toBeInTheDocument();
  });

  it('places the hold once the window is open, and waits for the deposit to say held', async () => {
    let asked = 0;
    const onHeld = vi.fn();
    const calls = fakeBackend({
      'GET /deposits/bookings/b1': () => {
        asked += 1;
        return { status: 200, body: deposit({ status: asked >= 3 ? 'held' : 'not_taken' }) };
      },
      'POST /deposits/bookings/b1/authorize': { status: 200, body: { clientSecret: 'pi_2_secret_y', amount: 250 } },
    });
    stripe.confirmPayment.mockResolvedValue({ paymentIntent: { status: 'requires_capture' } });
    render(<HoldDeposit booking={BOOKING} onHeld={onHeld} />);

    fireEvent.click(await screen.findByRole('button', { name: /Hold the \$250 Deposit/i }));
    await screen.findByTestId('stripe-card-fields');
    await press(/^Hold \$250$/i);

    await waitFor(() => expect(onHeld).toHaveBeenCalled(), { timeout: 8000 });
    expect(stripe.confirmPayment.mock.calls[0][0].confirmParams.return_url).toMatch(/\?paying=deposit$/);
    expect(calls).toContain('POST /deposits/bookings/b1/authorize');
  });
});

describe('saved cards', () => {
  const VISA: SavedCard = { id: 'pm_1', brand: 'visa', last4: '4242', expMonth: 4, expYear: 2031, isDefault: true };
  const MASTERCARD: SavedCard = { id: 'pm_2', brand: 'mastercard', last4: '4444', expMonth: 12, expYear: 2030, isDefault: false };

  it('lists the cards, and changes which comes first', async () => {
    const calls = fakeBackend({
      'GET /payments/methods': { status: 200, body: [VISA, MASTERCARD] },
      'POST /payments/methods/pm_2/default': {
        status: 200,
        body: [{ ...VISA, isDefault: false }, { ...MASTERCARD, isDefault: true }],
      },
    });
    render(<PaymentMethodsPage />);

    expect(await screen.findByText('Visa •••• 4242')).toBeInTheDocument();
    expect(screen.getByText('Expires 04/2031')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Make Default/i }));

    await waitFor(() => expect(calls).toContain('POST /payments/methods/pm_2/default'));
  });

  it('asks before removing a card', async () => {
    const calls = fakeBackend({
      'GET /payments/methods': { status: 200, body: [VISA] },
      'DELETE /payments/methods/pm_1': { status: 204 },
    });
    render(<PaymentMethodsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /^Remove$/i }));
    expect(calls).not.toContain('DELETE /payments/methods/pm_1');
    const buttons = await screen.findAllByRole('button', { name: /^Remove$/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => expect(calls).toContain('DELETE /payments/methods/pm_1'));
  });

  it('saves a new card through Stripe’s form, and lists it', async () => {
    let saved = false;
    const calls = fakeBackend({
      'GET /payments/methods': () => ({ status: 200, body: saved ? [VISA] : [] }),
      'POST /payments/methods/setup': { status: 200, body: { clientSecret: 'seti_1_secret_z' } },
    });
    stripe.confirmSetup.mockImplementation(async () => {
      saved = true;
      return { setupIntent: { status: 'succeeded' } };
    });
    render(<PaymentMethodsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /Add a Card/i }));
    await screen.findByTestId('stripe-card-fields');
    await press(/Save Card/i);

    expect(await screen.findByText('Visa •••• 4242')).toBeInTheDocument();
    expect(stripe.confirmSetup.mock.calls[0][0].confirmParams.return_url).toMatch(
      /\/account\/payment-methods\?saving=card$/,
    );
    expect(calls).toContain('POST /payments/methods/setup');
  });
});
