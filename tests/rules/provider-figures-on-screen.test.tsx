// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Guards product rule 3 where a business actually reads
// it — on the payouts page and the bookings list. Every figure is the
// business's own share, shown with what the customer paid and what was
// deducted beside it, so the deduction can be checked.
//
// WHY ON SCREEN, AND TO THE CENT: the backend's figures have cents. A 30%
// commission on $119.70 is $35.91, leaving $83.79. When the site rounded every
// amount to the dollar, those became $120, $36 and $84 — which happen to agree —
// and on other bookings they did not: $101 − $30 shown against a net of $70.
// A business checking the deduction would find it a dollar out and nothing to
// explain it. So these checks look for the exact figures, as a business would.
//
// The shape of the figures themselves is checked in
// tests/rules/provider-figures-are-their-own-share.test.ts.

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../render';
import { fakeBackend } from '../fakeBackend';
import { payouts, providerBookings } from '../fixtures/business';
import { fleet } from '../fixtures/catalogue';
import type { PayoutRecord } from '@/types';
import ProviderPayoutsPage from '@/app/provider/payouts/page';
import ProviderBookingsPage from '@/app/provider/bookings/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/provider',
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Rule 3, on screen — every figure beside the other two', () => {
  it('shows each payout’s gross, commission and net, to the cent', async () => {
    fakeBackend({ 'GET /providers/me/payouts': { status: 200, body: payouts } });
    render(<ProviderPayoutsPage />);

    await screen.findByText('SXM-PO-2031');
    for (const payout of payouts) {
      expect(screen.getAllByText(`$${payout.grossAmount.toFixed(2)}`).length, payout.reference).toBeGreaterThan(0);
      expect(screen.getAllByText(`− $${payout.commission.toFixed(2)}`).length, payout.reference).toBeGreaterThan(0);
      expect(screen.getAllByText(`$${payout.amount.toFixed(2)}`).length, payout.reference).toBeGreaterThan(0);
    }
  });

  it('calls the earliest payout still to come the next one', async () => {
    // The backend sends payouts newest first. The next one due is the pending
    // payout with the earliest period — not simply the first on the list.
    const later: PayoutRecord = {
      ...payouts[0],
      id: 'po-2033',
      reference: 'SXM-PO-2033',
      periodStart: '2030-11-01',
      periodEnd: '2030-11-30',
    };
    fakeBackend({ 'GET /providers/me/payouts': { status: 200, body: [later, ...payouts] } });
    render(<ProviderPayoutsPage />);

    const next = await screen.findByText(/^SXM-PO-2032 ·/);
    expect(next).toBeInTheDocument();
    expect(screen.queryByText(/^SXM-PO-2033 ·/)).not.toBeInTheDocument();
  });

  it('shows a booking’s net with the gross and commission beside it, to the cent', async () => {
    fakeBackend({
      'GET /providers/me/bookings': { status: 200, body: providerBookings },
      'GET /providers/me/vehicles': { status: 200, body: fleet },
    });
    render(<ProviderBookingsPage />);

    // The upcoming booking: $119.70 paid, $35.91 commission, $83.79 to the business.
    await screen.findByText('$83.79');
    expect(screen.getByText('$119.70 − $35.91')).toBeInTheDocument();
  });
});
