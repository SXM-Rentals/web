// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the card on /provider/payouts that sends a
// business to Stripe to say where its money goes.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - a business with no way to set up payouts, or sent back from Stripe to a
//     page that says nothing about how it went;
//   - the browser sent anywhere but Stripe;
//   - Stripe's own codes for what it still needs shown to a business;
//   - "set up payouts" offered to a business whose payouts are already on;
//   - a business sent to Stripe without saying where its bank is, or a
//     Dutch-side bank sent to Stripe, which cannot pay it.

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import type { PayoutAccount } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
import ProviderPayoutsPage from '@/app/provider/payouts/page';

const leave = vi.hoisted(() => ({ leaveSiteFor: vi.fn() }));
vi.mock('@/lib/leave-site', () => leave);

// The business looking: which side of the island it is on.
const business = vi.hoisted(() => ({ side: 'dutch' as 'dutch' | 'french' }));
vi.mock('@/lib/business', () => ({
  useBusiness: () => ({ provider: { id: 'p9', businessName: 'Gio Test Business', side: business.side } }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  leave.leaveSiteFor.mockReset();
  business.side = 'dutch';
});

const account = (changes: Partial<PayoutAccount>): PayoutAccount => ({
  status: 'not_started',
  payoutsEnabled: false,
  outstanding: [],
  country: 'SX',
  ...changes,
});

const STRIPE_LINK = 'https://connect.stripe.com/setup/e/acct_123/abc';

describe('setting up where the money goes', () => {
  it('sends a business that has not started to Stripe, and says it will come back', async () => {
    const calls = fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': { status: 200, body: account({}) },
      'POST /providers/me/payout-account': { status: 200, body: { url: STRIPE_LINK } },
    });
    render(<ProviderPayoutsPage />);

    // A Dutch-side business has to say where its bank is first.
    const start = await screen.findByRole('button', { name: /Set up payouts/i });
    expect(start).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /United States/i }));
    fireEvent.click(start);

    await waitFor(() => expect(leave.leaveSiteFor).toHaveBeenCalledWith(STRIPE_LINK));
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/payout-account')?.body).toEqual({
      returnTo: 'web',
      bankCountry: 'US',
    });
    expect(screen.getByText(/come back here when you’re done/)).toBeInTheDocument();
  });

  it('counts what Stripe still needs, without showing Stripe’s own codes', async () => {
    fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': {
        status: 200,
        body: account({ status: 'pending', outstanding: ['external_account', 'individual.verification.document'] }),
      },
    });
    render(<ProviderPayoutsPage />);

    expect(await screen.findByText(/\(2 to go\)/)).toBeInTheDocument();
    expect(screen.queryByText(/external_account|verification\.document/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue with Stripe/i })).toBeInTheDocument();
  });

  it('offers nothing to do once payouts are on', async () => {
    fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': {
        status: 200,
        body: account({ status: 'active', payoutsEnabled: true }),
      },
    });
    render(<ProviderPayoutsPage />);

    expect(await screen.findByText(/Payouts are on/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Set up payouts|Continue with Stripe/i })).not.toBeInTheDocument();
  });

  it('will not send the browser anywhere but Stripe', async () => {
    fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': { status: 200, body: account({}) },
      'POST /providers/me/payout-account': { status: 200, body: { url: 'https://stripe.com.evil.example/setup' } },
    });
    render(<ProviderPayoutsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /United States/i }));
    fireEvent.click(screen.getByRole('button', { name: /Set up payouts/i }));

    await screen.findByText(/did not look right/);
    expect(leave.leaveSiteFor).not.toHaveBeenCalled();
  });

  it('pays a bank on the Dutch side by bank transfer, without sending anybody to Stripe', async () => {
    let chosen = false;
    const calls = fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': () => ({
        status: 200,
        body: chosen ? account({ status: 'pending', method: 'bank_transfer' }) : account({}),
      }),
      'POST /providers/me/payout-account': () => {
        chosen = true;
        return {
          status: 200,
          body: { url: null, method: 'bank_transfer', message: 'Businesses banking on the Dutch side are paid by bank transfer.' },
        };
      },
    });
    render(<ProviderPayoutsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /Dutch side/i }));
    expect(screen.getByText(/pays you by bank transfer instead/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Set up payouts/i }));

    expect(await screen.findByText(/You’re paid by bank transfer from SXM Rentals/)).toBeInTheDocument();
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/payout-account')?.body).toEqual({
      returnTo: 'web',
      bankCountry: 'SX',
    });
    expect(leave.leaveSiteFor).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /Set up payouts|Continue with Stripe/i })).not.toBeInTheDocument();
  });

  it('starts a French-side business with France chosen', async () => {
    business.side = 'french';
    const calls = fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': { status: 200, body: account({ country: 'FR' }) },
      'POST /providers/me/payout-account': { status: 200, body: { url: STRIPE_LINK, method: 'stripe', message: null } },
    });
    render(<ProviderPayoutsPage />);

    expect(await screen.findByRole('button', { name: /French side or France/i })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Set up payouts/i }));

    await waitFor(() => expect(leave.leaveSiteFor).toHaveBeenCalledWith(STRIPE_LINK));
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/payout-account')?.body).toEqual({
      returnTo: 'web',
      bankCountry: 'FR',
    });
  });

  it('does not ask again once the Stripe account exists', async () => {
    const calls = fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': {
        status: 200,
        body: account({ status: 'pending', method: 'stripe', country: 'US', outstanding: ['external_account'] }),
      },
      'POST /providers/me/payout-account': { status: 200, body: { url: STRIPE_LINK, method: 'stripe', message: null } },
    });
    render(<ProviderPayoutsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /Continue with Stripe/i }));
    expect(screen.queryByText(/Where is your bank account/)).not.toBeInTheDocument();

    await waitFor(() => expect(leave.leaveSiteFor).toHaveBeenCalledWith(STRIPE_LINK));
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/payout-account')?.body).toEqual({
      returnTo: 'web',
    });
  });

  it('says plainly when payouts cannot be set up yet', async () => {
    fakeBackend({
      'GET /providers/me/payouts': { status: 200, body: [] },
      'GET /providers/me/payout-account': refusal(503, 'payments_unavailable', 'Card payments are not switched on yet.'),
    });
    render(<ProviderPayoutsPage />);

    expect(await screen.findByText(/Payouts can’t be set up just yet/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Set up payouts/i })).not.toBeInTheDocument();
  });
});
