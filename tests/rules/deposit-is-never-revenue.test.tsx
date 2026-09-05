// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Guards product rule 1 — a security deposit is money set
// aside and given back, so it is NEVER added into what the customer is charged.
//
// WHY THIS IS WORTH A TEST RATHER THAN A COMMENT: the mistake it prevents is a
// tidy-looking one. Somebody adding a "grand total" line, or reusing this
// component somewhere new, could reasonably think the deposit belongs in the
// sum. Nothing would crash and nothing would look broken — every price on the
// site would simply be wrong, quietly, by hundreds of dollars, in a way that
// misstates what the customer has agreed to pay. A comment cannot stop that.
// A failing test can.
//
// It renders the real component, not a copy, so the test still means something
// after the component is changed.

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '../render';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import type { PriceLine } from '@/types';

// A believable week's rental: rental, delivery, service fee. The deposit is
// deliberately a large round number — if it ever leaked into the total, the
// figure on screen would be unmistakably wrong rather than arguably off.
const lines: PriceLine[] = [
  { label: '$65 × 7 days', amount: 455 },
  { label: 'Delivery to Princess Juliana Airport', amount: 25 },
  { label: 'Service fee', amount: 40 },
];
const DEPOSIT = 500;
const EXPECTED_TOTAL = 455 + 25 + 40; // 520

describe('Rule 1 — a security deposit is never revenue', () => {
  it('charges the sum of the price lines and nothing more', () => {
    render(<PriceBreakdown lines={lines} depositAmount={DEPOSIT} />);

    // The figure a customer reads as "this is what leaves my account today".
    expect(screen.getByText('$520')).toBeInTheDocument();

    // And the number it would become if the deposit were folded in. Checking
    // for its absence is the actual guard: the assertion above would still pass
    // if a second, larger total appeared somewhere alongside it.
    expect(screen.queryByText('$1,020')).not.toBeInTheDocument();
  });

  it('shows the deposit as its own separate figure', () => {
    render(<PriceBreakdown lines={lines} depositAmount={DEPOSIT} />);

    // Body text is left exactly as written — only headings and labels get
    // Title Case — so this is the sentence case the component actually renders.
    expect(screen.getByText('Security deposit')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('says in plain words that the deposit is not part of the total', () => {
    render(<PriceBreakdown lines={lines} depositAmount={DEPOSIT} />);

    // The wording matters as much as the arithmetic. A customer seeing $500
    // next to $520 needs to be told which one is being taken, or the separation
    // is only visual.
    expect(screen.getByText(/not included in the total above/i)).toBeInTheDocument();
    expect(screen.getByText(/released when you return the car/i)).toBeInTheDocument();
  });

  it('says something different once the deposit is actually being held', () => {
    render(<PriceBreakdown lines={lines} depositAmount={DEPOSIT} depositHeld />);

    expect(screen.getByText(/currently held on your card/i)).toBeInTheDocument();
    // Still not revenue: the total has not moved.
    expect(screen.getByText('$520')).toBeInTheDocument();
  });

  it('leaves the deposit box out entirely when there is no deposit', () => {
    render(<PriceBreakdown lines={lines} depositAmount={0} />);

    // An empty "Security deposit — $0" row invites the question of whether one
    // is coming later. Nothing at all is the honest answer.
    expect(screen.queryByText('Security deposit')).not.toBeInTheDocument();
    expect(screen.getByText('$520')).toBeInTheDocument();
  });

  it('still totals correctly when there is only one line', () => {
    // The line's own amount and the total are both on screen, so they are told
    // apart by role: "Due today" is a heading, the line is body text.
    render(<PriceBreakdown lines={[{ label: 'One day', amount: 90 }]} depositAmount={250} />);

    expect(screen.getAllByText('$90')).toHaveLength(2); // the line, and the total
    expect(screen.queryByText('$340')).not.toBeInTheDocument();
  });

  it('handles a discount line without the deposit rescuing the total', () => {
    // A negative line is the one case where a careless "add everything up"
    // implementation might look right by accident.
    render(
      <PriceBreakdown
        lines={[
          { label: '$65 × 7 days', amount: 455 },
          { label: 'Weekly discount', amount: -55 },
        ]}
        depositAmount={500}
      />,
    );

    expect(screen.getByText('$400')).toBeInTheDocument();
    expect(screen.queryByText('$900')).not.toBeInTheDocument();
  });
});
