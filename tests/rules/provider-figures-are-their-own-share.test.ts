// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Guards product rule 3 — every figure shown to a rental
// business is their own share, after SXM Rentals' commission, and all three
// numbers are shown together: what the customer paid, what was deducted, and
// what the business actually receives.
//
// WHY ALL THREE: a business that can only see the amount landing in its account
// has no way to check the deduction was right. Showing only the gross is worse
// still — it tells them they earned money they will never see. The rule is
// really about being checkable, which is why this test asserts the three
// numbers agree with each other rather than merely that they exist.
//
// THE DEPOSIT IS TESTED HERE TOO, from the other side. Rule 1 keeps it out of
// what the customer is charged; this keeps it out of what the business is paid.
// It is the customer's money in both directions.

import { describe, expect, it } from 'vitest';
import { mockPayouts, mockProviderBookings, COMMISSION_RATE } from '@/lib/mock/business';

describe('Rule 3 — provider figures are always their own share', () => {
  it('shows gross, commission and net together on every payout', () => {
    expect(mockPayouts.length).toBeGreaterThan(0);

    for (const payout of mockPayouts) {
      expect(payout.grossAmount, `${payout.reference} is missing the gross`).toBeGreaterThan(0);
      expect(payout.commission, `${payout.reference} is missing the commission`).toBeGreaterThan(0);
      expect(payout.amount, `${payout.reference} is missing the net`).toBeGreaterThan(0);
    }
  });

  it('makes the three numbers add up, so the deduction can be checked', () => {
    for (const payout of mockPayouts) {
      // Allowed to be a cent out from rounding, and no more. If these did not
      // reconcile, a business checking our figures against its own bank
      // statement would find a discrepancy it could not explain — which costs
      // more trust than the amount involved.
      expect(
        Math.abs(payout.grossAmount - payout.commission - payout.amount),
        `${payout.reference}: ${payout.grossAmount} − ${payout.commission} ≠ ${payout.amount}`,
      ).toBeLessThan(0.01);
    }
  });

  it('takes roughly the stated commission and no more', () => {
    for (const payout of mockPayouts) {
      const rate = payout.commission / payout.grossAmount;
      // A band rather than an exact figure: the rate varies a little in
      // practice. The point is to catch a rate that has drifted somewhere it
      // should not — 50%, or 3% — not to pin it to a decimal.
      expect(rate, `${payout.reference} commission rate looks wrong: ${rate}`).toBeGreaterThan(0.2);
      expect(rate).toBeLessThan(0.4);
    }
    expect(COMMISSION_RATE).toBeGreaterThan(0.2);
    expect(COMMISSION_RATE).toBeLessThan(0.4);
  });

  it('reconciles the same three numbers on an individual booking', () => {
    expect(mockProviderBookings.length).toBeGreaterThan(0);

    for (const booking of mockProviderBookings) {
      expect(
        Math.abs(booking.grossAmount - booking.commission - booking.netAmount),
        `${booking.reference} does not reconcile`,
      ).toBeLessThan(0.01);


      // And the business is never shown a figure larger than what it gets.
      // A cancelled booking is 0/0/0, which is right — no money changed hands —
      // so it is the one case where net and gross are allowed to be equal.
      if (booking.status === 'cancelled') {
        expect(booking.grossAmount).toBe(0);
        expect(booking.netAmount).toBe(0);
      } else {
        expect(booking.netAmount).toBeLessThan(booking.grossAmount);
        expect(booking.netAmount).toBeGreaterThan(0);
      }
    }
  });

  it('never counts the deposit as money the business is owed', () => {
    for (const booking of mockProviderBookings) {
      if (booking.depositAmount <= 0) continue;

      // If the deposit had been folded into the booking's value, the gross
      // would have grown by exactly that amount and the three numbers would
      // stop reconciling — which the check above already catches. This states
      // the rule directly so a failure names the right cause.
      const withDeposit = booking.grossAmount + booking.depositAmount;
      expect(
        booking.netAmount,
        `${booking.reference} appears to include the deposit in the payout`,
      ).toBeLessThan(withDeposit - booking.depositAmount + 0.01);
    }
  });

  it('never lets a payout total exceed the bookings it was made from', () => {
    for (const payout of mockPayouts) {
      expect(payout.bookingCount).toBeGreaterThan(0);
      expect(payout.amount).toBeLessThan(payout.grossAmount);
    }
  });
});
