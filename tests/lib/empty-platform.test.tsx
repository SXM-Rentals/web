// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests how the site looks with nothing in it — which is
// exactly how it opens. The live database starts empty; the first cars arrive
// when businesses apply and staff approve them.
//
// WHAT IT GUARDS AGAINST: an empty catalogue described as a search that
// matched nothing. "No cars match those filters", with no filter on, sends
// somebody hunting for a setting that is not there, and tells a business
// arriving to list its cars nothing at all.

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../render';
import { TripProvider } from '@/lib/trip';
import { FavouritesProvider } from '@/lib/favourites';
import { fakeBackend } from '../fakeBackend';
import { vehicles } from '../fixtures/catalogue';
import { SearchView } from '@/components/search/SearchView';

const nav = vi.hoisted(() => ({ params: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => nav.params,
  usePathname: () => '/search',
}));

afterEach(() => {
  vi.unstubAllGlobals();
  nav.params = new URLSearchParams();
});

function renderSearch() {
  return render(
    <TripProvider>
      <FavouritesProvider>
        <SearchView />
      </FavouritesProvider>
    </TripProvider>,
  );
}

describe('the search page on an empty platform', () => {
  it('says no cars are listed yet, and shows a business the way in', async () => {
    fakeBackend({ 'GET /vehicles': { status: 200, body: [] } });
    renderSearch();

    await screen.findByText(/No cars are listed yet/i);
    expect(screen.queryByText(/match those filters/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /List Your Vehicles/i })).toHaveAttribute('href', '/provider/apply');
  });

  it('still says "nothing matches" when a filter is what emptied the list', async () => {
    nav.params = new URLSearchParams('side=french');
    fakeBackend({ 'GET /vehicles': { status: 200, body: [] } });
    renderSearch();

    await screen.findByText(/match those filters/i);
    expect(screen.queryByText(/No cars are listed yet/i)).not.toBeInTheDocument();
  });

  it('lists the cars once there are some', async () => {
    fakeBackend({ 'GET /vehicles': { status: 200, body: vehicles } });
    renderSearch();

    await screen.findByText(/Picanto/);
    expect(screen.queryByText(/No cars are listed yet/i)).not.toBeInTheDocument();
  });
});
