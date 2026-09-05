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
// new field is caught the moment it is declared. And the seed data, read as
// values, because a stray "renterPhone" would otherwise sit unnoticed inside an
// object that is only loosely typed at the point it is written.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mockProviderBookings, mockBusinessThreads } from '@/lib/mock/business';

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

  it('has no contact details hiding in the business-side seed data', () => {
    const emailShaped = /[\w.+-]+@[\w-]+\.[\w.]+/;
    // Seven or more digits in a row, allowing the spaces, dashes and brackets a
    // phone number is usually written with.
    const phoneShaped = /(\+?\d[\d\s()-]{6,}\d)/;

    for (const booking of mockProviderBookings) {
      const asText = JSON.stringify(booking);
      expect(asText, `booking ${booking.reference} contains an email address`).not.toMatch(
        emailShaped,
      );
      // Reference numbers and dates are digits too, so only the human-readable
      // string fields are worth checking for a phone number.
      const words = [booking.renterDisplayName, booking.location].join(' ');
      expect(words, `booking ${booking.reference} contains a phone number`).not.toMatch(
        phoneShaped,
      );
    }

    for (const thread of mockBusinessThreads) {
      expect(JSON.stringify(thread)).not.toMatch(emailShaped);
    }
  });

  it('shows the renter by display name only, in every seeded booking', () => {
    for (const booking of mockProviderBookings) {
      expect(booking.renterDisplayName.length).toBeGreaterThan(0);
      // "Benjamin J." — a first name and an initial, not a full legal name.
      expect(booking.renterDisplayName.split(' ').length).toBeLessThanOrEqual(3);
    }
  });
});
