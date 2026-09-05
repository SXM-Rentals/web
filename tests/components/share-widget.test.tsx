// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the floating share button — that all six options
// are there, that copying puts the address of the page you are actually on onto
// the clipboard, and that a social account which does not exist yet says so
// instead of doing nothing.
//
// THAT LAST ONE IS THE POINT OF THE FILE. A social icon that silently does
// nothing when clicked is the single easiest way to make a finished site feel
// broken — people assume the site failed rather than that the account has not
// been opened. It is also the behaviour most likely to be lost in a rewrite,
// because nothing about it looks load-bearing.

import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../render';
import userEvent from '@testing-library/user-event';
import { SocialWidget } from '@/components/layout/SocialWidget';
import { SOCIAL_LINKS } from '@/lib/social';

// The widget asks which page it is on so it can share that page and fold itself
// away when you navigate. There is no router in a test, so it is given one.
vi.mock('next/navigation', () => ({
  usePathname: () => '/vehicles/v1',
}));

function renderWidget() {
  // The providers come from ../render — the widget needs the toast provider for
  // its "not set up yet" message and the language provider for its labels.
  return render(<SocialWidget />);
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /share sxm rentals/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('the share button', () => {
  it('starts folded away, so it never covers the page', () => {
    renderWidget();

    const toggle = screen.getByRole('button', { name: /share sxm rentals/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Instagram' })).not.toBeInTheDocument();
  });

  it('opens to show every share option, email included', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    for (const social of SOCIAL_LINKS) {
      expect(
        screen.getByRole('button', { name: social.name }),
        `${social.name} is missing from the share panel`,
      ).toBeInTheDocument();
    }

    expect(screen.getByRole('button', { name: /share by email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy the link/i })).toBeInTheDocument();
  });

  it('offers the four social accounts plus email and copy — six in all', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    // The toggle itself is a button too, hence the +1.
    expect(screen.getAllByRole('button')).toHaveLength(SOCIAL_LINKS.length + 2 + 1);
  });

  it('folds away again when clicked a second time', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    await user.click(screen.getByRole('button', { name: /hide the share options/i }));
    expect(screen.queryByRole('button', { name: 'Instagram' })).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Instagram' })).not.toBeInTheDocument();
  });

  it('copies the address of the page being looked at, not the homepage', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: /copy the link/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    // jsdom's address is http://localhost:3000/ — the full href, whatever it is,
    // rather than only the origin. Sharing a car should send somebody to that
    // car.
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('confirms on the button itself once the link is copied', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: /copy the link/i }));

    // A tick where the click happened, rather than a message elsewhere on the
    // page that has to be found.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /link copied/i })).toBeInTheDocument();
    });
  });

  it('says so, rather than failing silently, when copying is blocked', async () => {
    const user = userEvent.setup();
    // Browsers refuse the clipboard over an insecure connection, and some
    // settings refuse it outright.
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });

    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: /copy the link/i }));

    await waitFor(() => {
      expect(screen.getByText(/could not copy automatically/i)).toBeInTheDocument();
    });
  });

  it('admits an account is not open yet instead of doing nothing', async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    // Every social address in lib/social.ts is empty until the accounts exist.
    const unopened = SOCIAL_LINKS.find((s) => !s.url);
    if (!unopened) return; // all four are live — nothing left to guard

    await user.click(screen.getByRole('button', { name: unopened.name }));

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(`${unopened.name} is not set up yet`, 'i')),
      ).toBeInTheDocument();
    });
  });

  it('opens a mail program with the link already in the message', async () => {
    const user = userEvent.setup();
    // jsdom refuses to navigate and logs an error; replacing location.href with
    // something recordable keeps the test about the address being built.
    const assigned: string[] = [];
    const original = Object.getOwnPropertyDescriptor(window, 'location');
    delete (window as unknown as Record<string, unknown>).location;
    (window as unknown as Record<string, unknown>).location = {
      ...(original?.value ?? {}),
      href: 'http://localhost:3000/vehicles/v1',
      set _href(value: string) {
        assigned.push(value);
      },
    };
    Object.defineProperty(window.location, 'href', {
      get: () => 'http://localhost:3000/vehicles/v1',
      set: (value: string) => assigned.push(value),
      configurable: true,
    });

    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: /share by email/i }));

    expect(assigned[0]).toMatch(/^mailto:\?subject=/);
    expect(assigned[0]).toContain('SXM%20Rentals');
    // The link is encoded, so a search address full of "&" cannot cut the
    // message in half.
    expect(assigned[0]).toContain(encodeURIComponent('http://localhost:3000/vehicles/v1'));

    if (original) Object.defineProperty(window, 'location', original);
  });
});
