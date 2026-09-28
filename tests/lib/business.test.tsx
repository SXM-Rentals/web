// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests how the site finds out whether somebody runs a
// rental business, and the gate in front of the business dashboard.
//
// WHY. "Has a business" used to be a fixed yes, so everybody who signed in was
// shown a made-up business and its made-up payouts. These tests pin down the
// real answers — yes, no, closed, and "could not tell" — and that the
// dashboard shows nothing of a business to somebody who does not have one.

import React, { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '../render';
import { SessionProvider } from '@/lib/auth';
import { BusinessProvider, useBusiness } from '@/lib/business';
import { ProviderShell } from '@/components/business/ProviderShell';
import type { BusinessProfile, Provider, User } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/provider',
}));

const OWNER = {
  id: 'c2',
  firstName: 'Omar',
  lastName: 'Owner',
  email: 'owner@example.com',
  phone: '',
  accountType: 'local',
  verification: { status: 'unstarted', selfieDone: false, licenseDone: false, identityDocDone: false },
  isIslander: true,
  memberSince: '2026-09-21T00:00:00.000Z',
} as User;

const PROFILE = {
  providerId: 'p9',
  legalName: 'Harbour View Rentals N.V.',
  registrationStatus: 'registered',
  fleetSizeBand: '3–5',
  locations: ['Simpson Bay'],
  operatingSide: 'both',
  deliversVehicles: true,
  airportPickup: true,
  apiConnected: false,
} as BusinessProfile;

const PUBLIC_RECORD = { id: 'p9', businessName: 'Harbour View Rentals' } as Provider;

function withBusiness() {
  const latest: { current: ReturnType<typeof useBusiness> | null } = { current: null };
  function Probe() {
    const business = useBusiness();
    useEffect(() => {
      latest.current = business;
    });
    return null;
  }
  render(
    <SessionProvider>
      <BusinessProvider>
        <Probe />
      </BusinessProvider>
    </SessionProvider>,
  );
  return latest;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('whether somebody runs a business', () => {
  it('does not ask at all when nobody is signed in', async () => {
    const calls = fakeBackend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.hasBusiness).toBe(false);
    expect(calls).not.toContain('GET /providers/me');
  });

  it('knows about the business the backend returns', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': { status: 200, body: PROFILE },
      'GET /providers/p9': { status: 200, body: PUBLIC_RECORD },
    });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.hasBusiness).toBe(true);
    expect(business.current?.provider?.businessName).toBe('Harbour View Rentals');
  });

  it('takes "not_a_provider" as the answer "no business"', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': refusal(403, 'not_a_provider'),
    });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.hasBusiness).toBe(false);
    expect(business.current?.error).toBeNull();
  });

  it('takes a business whose public page is gone as closed, not open', async () => {
    // What the backend does after a business is closed: the private record
    // still comes back, the public page does not.
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': { status: 200, body: PROFILE },
      'GET /providers/p9': refusal(404, 'not_found', 'We could not find that rental business.'),
    });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.hasBusiness).toBe(false);
    expect(business.current?.closed).toBe(true);
    expect(business.current?.error).toBeNull();
  });

  it('does not take a public page that failed to load as a closed business', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': { status: 200, body: PROFILE },
      'GET /providers/p9': refusal(429, 'rate_limited', 'Too many requests.'),
    });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.hasBusiness).toBe(true);
    expect(business.current?.closed).toBe(false);
  });

  it('does not take a failing server as "no business"', async () => {
    // Otherwise an owner is invited to register a business they already run,
    // because a server was waking up.
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': refusal(500, 'unknown', 'Something went wrong.'),
    });
    const business = withBusiness();
    await waitFor(() => expect(business.current?.loading).toBe(false));
    expect(business.current?.error).toBe('Something went wrong.');
  });
});

describe('the gate in front of the dashboard', () => {
  function openDashboard() {
    render(
      <SessionProvider>
        <BusinessProvider>
          <ProviderShell>
            <p>THE DASHBOARD ITSELF</p>
          </ProviderShell>
        </BusinessProvider>
      </SessionProvider>,
    );
  }

  it('asks somebody who is signed out to sign in, and shows none of the dashboard', async () => {
    fakeBackend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    openDashboard();
    expect(await screen.findByText(/sign in to your business dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText('THE DASHBOARD ITSELF')).not.toBeInTheDocument();
  });

  it('offers to register a business to somebody who has none', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': refusal(403, 'not_a_provider'),
    });
    openDashboard();
    expect(await screen.findByText(/no rental business yet/i)).toBeInTheDocument();
    expect(screen.queryByText('THE DASHBOARD ITSELF')).not.toBeInTheDocument();
  });

  it('says a closed business is closed, rather than opening its dashboard', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': { status: 200, body: PROFILE },
      'GET /providers/p9': refusal(404, 'not_found'),
    });
    openDashboard();
    expect(await screen.findByText('Your Business Is Closed')).toBeInTheDocument();
    expect(screen.getByText(/hello@sxmrentals\.app/)).toBeInTheDocument();
    expect(screen.queryByText('THE DASHBOARD ITSELF')).not.toBeInTheDocument();
  });

  it('opens for somebody who runs a business', async () => {
    fakeBackend({
      'GET /customers/me': { status: 200, body: OWNER },
      'GET /providers/me': { status: 200, body: PROFILE },
      'GET /providers/p9': { status: 200, body: PUBLIC_RECORD },
    });
    openDashboard();
    expect(await screen.findByText('THE DASHBOARD ITSELF')).toBeInTheDocument();
  });
});
