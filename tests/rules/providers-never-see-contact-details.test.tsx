// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Guards product rule 2 — a rental business never sees a
// customer's phone number or email address. They message through SXM Rentals.
//
// HOW THE RULE IS ENFORCED: in the shapes themselves. ProviderBooking and
// BusinessChatThread simply have no field to put a phone number in, so no page
// on the business side can display one — a component cannot leak what it was
// never handed. This test exists to keep it that way, because the field that
// breaks the rule would be added with good intentions ("the business needs to
// call about a late return") and would look perfectly reasonable in review.
//
// IT CHECKS TWO THINGS, deliberately. The type definitions, read as text, so a
// new field is caught the moment it is declared. And the business screens
// themselves, handed a booking and a conversation that DO carry a phone number
// and an email address — as though the backend had leaked them — to prove the
// screens show only what the types allow, whatever arrives.
//
// (It used to check the sample data for stray contact details instead. The
// sample data is deleted; checking what the screens actually show is the
// stronger guard anyway.)

import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../render';
import { fakeBackend } from '../fakeBackend';
import { businessThreads, providerBookings } from '../fixtures/business';
import { fleet } from '../fixtures/catalogue';
import ProviderBookingsPage from '@/app/provider/bookings/page';
import { ProviderMessagesView } from '@/components/business/ProviderMessagesView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/provider',
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

const typesSource = readFileSync(join(process.cwd(), 'types', 'index.ts'), 'utf8');

// Pulls one type declaration out of the source by name, from its opening line
// to the closing brace in the first column. Crude, but the file is written in
// exactly that style, and it means the test reads the real contract rather than
// a description of it kept in step by hand.
function typeBody(name: string): string {
  const start = typesSource.indexOf(`export type ${name} = {`);
  expect(start, `${name} should exist in types/index.ts`).toBeGreaterThan(-1);
  const end = typesSource.indexOf('\n};', start);
  return typesSource.slice(start, end);
}

// Words that would signal a contact detail arriving on the business side.
// "renterDisplayName" is fine and expected — a first name and an initial is how
// you greet the right person at the counter. A way to reach them privately is
// not.
const FORBIDDEN = ['email', 'phone', 'mobile', 'whatsapp', 'telephone', 'contactNumber'];

// What a leak would look like, if the backend ever sent one.
const LEAKED = {
  renterEmail: 'maria.k@example.com',
  renterPhone: '+1 721 555 0199',
  email: 'maria.k@example.com',
  phone: '+1 721 555 0199',
};

describe('Rule 2 — providers never see customer contact details', () => {
  it('gives ProviderBooking nowhere to put a phone number or email', () => {
    const body = typeBody('ProviderBooking').toLowerCase();
    for (const word of FORBIDDEN) {
      expect(body, `ProviderBooking must not carry "${word}"`).not.toContain(word.toLowerCase());
    }
  });

  it('gives BusinessChatThread nowhere either', () => {
    const body = typeBody('BusinessChatThread').toLowerCase();
    for (const word of FORBIDDEN) {
      expect(body, `BusinessChatThread must not carry "${word}"`).not.toContain(word.toLowerCase());
    }
  });

  it('keeps the renter identifiable enough to serve, and no more', () => {
    const body = typeBody('ProviderBooking');
    // The business does get a display name and whether SXM Rentals has checked
    // the person's documents. That is what is actually needed to hand over a
    // car, and the reason the rule is workable rather than obstructive.
    expect(body).toContain('renterDisplayName');
    expect(body).toContain('renterVerified');
  });

  it('shows no contact details on the bookings list, even if the backend sent some', async () => {
    fakeBackend({
      'GET /providers/me/bookings': { status: 200, body: [{ ...providerBookings[0], ...LEAKED }] },
      'GET /providers/me/vehicles': { status: 200, body: fleet },
    });
    render(<ProviderBookingsPage />);

    await screen.findByText('Maria K.');
    const onScreen = document.body.textContent ?? '';
    expect(onScreen).not.toContain(LEAKED.renterEmail);
    expect(onScreen).not.toContain('555 0199');
  });

  it('shows no contact details in a conversation, even if the backend sent some', async () => {
    fakeBackend({
      'GET /providers/me/messages': { status: 200, body: [{ ...businessThreads[0], ...LEAKED, unreadCount: 0 }] },
      'GET /providers/me/vehicles': { status: 200, body: fleet },
    });
    render(<ProviderMessagesView threadId={businessThreads[0].id} />);

    await screen.findAllByText('Maria K.');
    const onScreen = document.body.textContent ?? '';
    expect(onScreen).not.toContain(LEAKED.renterEmail);
    expect(onScreen).not.toContain('555 0199');
  });
});
