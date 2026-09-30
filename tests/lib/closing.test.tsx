// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests closing an account and closing a business.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - something closed for good on a single click, or without the password;
//   - a wrong password, a rental still coming up, or a backend that has not
//     got the address yet, all reported as one vague failure;
//   - somebody left looking at an account or a dashboard that no longer exists;
//   - the page explaining how to close an account needing a sign-in to read,
//     or naming buttons that are not there.

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../render';
import { SessionProvider } from '@/lib/auth';
import { BusinessProvider } from '@/lib/business';
import { apiClient } from '@/lib/api-client';
import type { BusinessProfile, Provider, User } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
import { CloseForGood } from '@/components/account/CloseForGood';
import AccountSettingsPage from '@/app/(site)/account/settings/page';
import ProviderSettingsPage from '@/app/provider/settings/page';
import { AccountGate } from '@/components/account/AccountGate';
import { CloseAccountGuide } from '@/components/account/CloseAccountGuide';

const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), pathname: '/account/settings' }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push, replace: nav.replace, back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => nav.pathname,
}));

afterEach(() => {
  vi.unstubAllGlobals();
  nav.push.mockReset();
  nav.pathname = '/account/settings';
});

const USER = {
  id: 'c1',
  firstName: 'Tessa',
  lastName: 'Customer',
  email: 'tessa@example.com',
  phone: '',
  accountType: 'tourist',
  verification: { status: 'unstarted', selfieDone: false, licenseDone: false, identityDocDone: false },
  isIslander: false,
  memberSince: '2026-09-21T00:00:00.000Z',
} as User;

function openSheet(onDone = vi.fn()) {
  render(
    <CloseForGood
      open
      onClose={vi.fn()}
      title="Close your account?"
      body="Closing your account signs you out on every device."
      understandLabel="I understand my account is closed for good and cannot be reopened."
      confirmLabel="Close My Account"
      action={(password) => apiClient.closeAccount(password)}
      onDone={onDone}
    />,
  );
  return onDone;
}

const confirmButton = () => screen.getByRole('button', { name: /Close My Account/i });
const typePassword = (value: string) =>
  fireEvent.change(screen.getByLabelText(/Your Password/i), { target: { value } });
const tick = () => fireEvent.click(screen.getByRole('checkbox'));

describe('the last step before closing', () => {
  it('will not close anything until the password is given and the box ticked', () => {
    const calls = fakeBackend({});
    openSheet();

    expect(confirmButton()).toBeDisabled();
    typePassword('correct horse battery');
    expect(confirmButton()).toBeDisabled();
    tick();
    expect(confirmButton()).toBeEnabled();
    expect(calls).toHaveLength(0);
  });

  it('sends the password and reports back once it has closed', async () => {
    const calls = fakeBackend({ 'POST /customers/me/close': { status: 204 } });
    const onDone = openSheet();

    typePassword('correct horse battery');
    tick();
    fireEvent.click(confirmButton());

    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(calls.sent.find((entry) => entry.call === 'POST /customers/me/close')?.body).toEqual({
      password: 'correct horse battery',
    });
  });

  it('says a wrong password is a wrong password', async () => {
    fakeBackend({
      'POST /customers/me/close': refusal(400, 'wrong_password', 'Your password is not correct.'),
    });
    const onDone = openSheet();

    typePassword('not it');
    tick();
    fireEvent.click(confirmButton());

    await screen.findByText('That password isn’t right.');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('gives the backend’s own reason when something is still going on', async () => {
    fakeBackend({
      'POST /customers/me/close': refusal(
        409,
        'has_live_rental',
        'You have a rental that is upcoming (SXM-4821). Your account can be closed once it is finished.',
      ),
    });
    const onDone = openSheet();

    typePassword('correct horse battery');
    tick();
    fireEvent.click(confirmButton());

    await screen.findByText(/SXM-4821/);
    expect(onDone).not.toHaveBeenCalled();
  });

  it('says plainly when the backend cannot close accounts yet, and where to write instead', async () => {
    fakeBackend({
      'POST /customers/me/close': refusal(404, 'route_not_found', 'There is nothing at this address.'),
    });
    openSheet();

    typePassword('correct horse battery');
    tick();
    fireEvent.click(confirmButton());

    await screen.findByText(/isn’t switched on yet/);
    expect(screen.getByText(/hello@sxmrentals\.app/)).toBeInTheDocument();
  });
});

describe('closing, from the settings pages', () => {
  it('closes the account, signs out and goes home', async () => {
    const calls = fakeBackend({
      'GET /customers/me': { status: 200, body: USER },
      'POST /customers/me/close': { status: 204 },
      // The backend has already ended the session, so this answers "not
      // signed in" — which signing out treats as done.
      'POST /auth/logout': refusal(401, 'unauthorized'),
    });
    render(
      <SessionProvider>
        <AccountSettingsPage />
      </SessionProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Close My Account/i }));
    typePassword('correct horse battery');
    tick();
    const buttons = screen.getAllByRole('button', { name: /Close My Account/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => expect(nav.push).toHaveBeenCalledWith('/'));
    expect(calls).toContain('POST /customers/me/close');
    expect(calls).toContain('POST /auth/logout');
  });

  it('closes the business with the password, leaves the dashboard, and looks the business up again', async () => {
    let closed = false;
    const calls = fakeBackend({
      'GET /customers/me': { status: 200, body: USER },
      'GET /providers/me': () =>
        closed
          ? refusal(403, 'business_closed', 'This business is closed, so it can no longer be changed.')
          : { status: 200, body: { providerId: 'p9', legalName: 'Harbour View Rentals N.V.' } as BusinessProfile },
      'GET /providers/p9': { status: 200, body: { id: 'p9', businessName: 'Harbour View Rentals' } as Provider },
      'POST /providers/me/close': () => {
        closed = true;
        return { status: 200, body: { businessName: 'Harbour View Rentals', closedAt: '2026-09-27T10:00:00.000Z', vehiclesDelisted: 3 } };
      },
    });
    render(
      <SessionProvider>
        <BusinessProvider>
          <ProviderSettingsPage />
        </BusinessProvider>
      </SessionProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Close My Business/i }));
    const buttons = () => screen.getAllByRole('button', { name: /Close My Business/i });
    const confirm = () => buttons()[buttons().length - 1];

    // The backend checks the password for this too.
    tick();
    expect(confirm()).toBeDisabled();
    typePassword('correct horse battery');
    expect(confirm()).toBeEnabled();
    fireEvent.click(confirm());

    await waitFor(() => expect(nav.push).toHaveBeenCalledWith('/account'));
    expect(calls.sent.find((entry) => entry.call === 'POST /providers/me/close')?.body).toEqual({
      password: 'correct horse battery',
    });
    // Looked up again after closing: now there is no business.
    await waitFor(() =>
      expect(calls.filter((call) => call === 'GET /providers/me').length).toBeGreaterThan(1),
    );
  });
});

describe('the page explaining how to close an account', () => {
  it('opens without signing in, inside the account area', async () => {
    fakeBackend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    nav.pathname = '/account/close';
    render(
      <SessionProvider>
        <AccountGate>
          <CloseAccountGuide />
        </AccountGate>
      </SessionProvider>,
    );

    expect(await screen.findByRole('heading', { name: 'Closing Your SXM Rentals Account' })).toBeInTheDocument();
    // What goes and what stays — what Google Play looks for on this page.
    expect(screen.getByText(/phone number and email address are removed/)).toBeInTheDocument();
    expect(screen.getByText(/past rentals with their receipts/)).toBeInTheDocument();
    // Signing in from here comes back to the settings, where the button is.
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Sign In to Close Your Account/i })).toHaveAttribute(
        'href',
        '/login?next=%2Faccount%2Fsettings',
      ),
    );
  });

  it('names the buttons by the words they really use', async () => {
    fakeBackend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    render(
      <SessionProvider>
        <CloseAccountGuide />
      </SessionProvider>,
    );

    expect(await screen.findByText('Open Account, then Settings.')).toBeInTheDocument();
    expect(
      screen.getByText('At the bottom of the page, under “Close Your Account”, choose Close My Account.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hello@sxmrentals.app' })).toHaveAttribute(
      'href',
      'mailto:hello@sxmrentals.app',
    );
  });

  it('keeps every other account page behind the sign-in', async () => {
    fakeBackend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    nav.pathname = '/account/settings';
    render(
      <SessionProvider>
        <AccountGate>
          <p>SOMEBODY&apos;S SETTINGS</p>
        </AccountGate>
      </SessionProvider>,
    );

    await waitFor(() => expect(screen.queryByText('SOMEBODY\'S SETTINGS')).not.toBeInTheDocument());
    expect(await screen.findByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });
});
