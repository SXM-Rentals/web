// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the small functions that turn raw values into the
// words people read — prices, dates, and the Title Case used on every heading.
//
// THESE ARE WORTH TESTING because they are used everywhere and their mistakes
// are quiet ones. A price rendered as "$1020" instead of "$1,020" is harder to
// read but nothing fails. A heading that comes out "Terms Of Service" is wrong
// in a way that is obvious to a reader and invisible to a compiler. The Title
// Case rules in particular have several exceptions layered on top of each other,
// and exceptions are exactly what a later change breaks by accident.

import { describe, expect, it } from 'vitest';
import {
  money,
  perDay,
  titleCase,
  daysBetween,
  initials,
  capitalise,
  dateRange,
  longDate,
} from '@/lib/format';

describe('money', () => {
  it('writes whole dollars with no decimal places', () => {
    expect(money(65)).toBe('$65');
    expect(money(455)).toBe('$455');
  });

  it('groups thousands, so a long number can be read at a glance', () => {
    expect(money(1020)).toBe('$1,020');
    expect(money(12500)).toBe('$12,500');
  });

  it('rounds rather than showing a stray fraction of a cent', () => {
    expect(money(64.6)).toBe('$65');
    expect(money(64.4)).toBe('$64');
  });

  it('shows cents when asked, for a receipt', () => {
    expect(money(64.5, { decimals: true })).toBe('$64.50');
    expect(money(65, { decimals: true })).toBe('$65.00');
  });

  it('handles zero and a negative discount line', () => {
    expect(money(0)).toBe('$0');
    expect(money(-55)).toBe('$-55');
  });

  it('adds the per-day suffix used on car cards', () => {
    expect(perDay(45)).toBe('$45/day');
  });
});

describe('titleCase', () => {
  it('capitalises the important words', () => {
    expect(titleCase('find a car')).toBe('Find a Car');
    expect(titleCase('my rentals')).toBe('My Rentals');
    expect(titleCase('business profile')).toBe('Business Profile');
  });

  it('leaves the small joining words alone in the middle', () => {
    expect(titleCase('terms of service')).toBe('Terms of Service');
    expect(titleCase('what to do in an accident')).toBe('What to Do in an Accident');
  });

  it('still capitalises a small word that opens or closes the title', () => {
    // "A" at the start and "To" at the end are the first and last word, so the
    // lowercase rule does not apply to them.
    expect(titleCase('a guide to renting')).toBe('A Guide to Renting');
    expect(titleCase('what we charge for')).toBe('What We Charge For');
  });

  it('leaves acronyms shouting', () => {
    expect(titleCase('SXM verified')).toBe('SXM Verified');
    expect(titleCase('upload your ID')).toBe('Upload Your ID');
    expect(titleCase('ATV rentals')).toBe('ATV Rentals');
  });

  it('does not mangle a name that has a capital in the middle', () => {
    // Only the first letter is touched; the rest of the word is left as it was,
    // so "McKenzie" survives. "from" stays lowercase because it is one of the
    // small joining words and is not the first or last word here.
    expect(titleCase('rented from McKenzie')).toBe('Rented from McKenzie');
    expect(titleCase('McKenzie car rental')).toBe('McKenzie Car Rental');
  });

  it('gives back an empty string unchanged rather than crashing', () => {
    expect(titleCase('')).toBe('');
  });

  it('keeps the original spacing', () => {
    expect(titleCase('save  a car')).toBe('Save  a Car');
  });
});

describe('daysBetween', () => {
  it('counts the nights between two dates', () => {
    expect(daysBetween('2026-09-01', '2026-09-08')).toBe(7);
    expect(daysBetween('2026-09-01', '2026-09-02')).toBe(1);
  });

  it('never returns zero for a same-day rental', () => {
    // A car collected and returned the same day is still a day's hire. Zero
    // would price it at nothing.
    expect(daysBetween('2026-09-01', '2026-09-01')).toBeGreaterThanOrEqual(1);
  });
});

describe('initials', () => {
  it('builds the two letters shown on an avatar', () => {
    expect(initials('Benjamin', 'Joseph')).toBe('BJ');
  });

  it('copes with only a first name', () => {
    expect(initials('Benjamin')).toBe('B');
  });

  it('falls back to a question mark rather than an empty circle', () => {
    expect(initials('')).toBe('?');
  });
});

describe('capitalise', () => {
  it('lifts the first letter only', () => {
    expect(capitalise('pending')).toBe('Pending');
  });
});

describe('dates', () => {
  it('writes a date the way it appears on a booking', () => {
    expect(longDate('2026-09-18')).toBe('18 Sep 2026');
  });

  it('writes a range as one phrase', () => {
    // The exact punctuation is not the point; that both ends appear is.
    const range = dateRange('2026-09-18', '2026-09-25');
    expect(range).toContain('18');
    expect(range).toContain('25');
    expect(range).toContain('Sep');
  });
});
