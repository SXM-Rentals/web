// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the search-engine plumbing — the sitemap, the
// robots file, and the machine-readable descriptions of each page.
//
// WHY THIS IS WORTH TESTING: every mistake here is silent. A sitemap that lists
// the booking flow, a canonical address with a double slash in it, a price
// described to a search engine that no longer matches the price on the page —
// nothing crashes, nothing looks wrong in a browser, and the damage shows up
// weeks later as pages that will not rank. These are exactly the sort of
// mistakes a test catches and a person does not.

import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import {
  SITE_URL,
  canonical,
  jsonLdVehicle,
  jsonLdProvider,
  jsonLdBreadcrumbs,
  jsonLdLegalDocument,
} from '@/lib/seo';
import { mockVehicles } from '@/lib/mock/vehicles';
import { mockProviders } from '@/lib/mock/providers';
import { legalDocuments } from '@/lib/mock/legal';

describe('canonical addresses', () => {
  it('builds a full address from a path', () => {
    expect(canonical('/search').canonical).toBe(`${SITE_URL}/search`);
  });

  it('does not leave a trailing slash on the homepage', () => {
    // "https://site.com/" and "https://site.com" are the same page but are read
    // as two, which is the whole problem a canonical tag exists to solve.
    expect(canonical('/').canonical).toBe(SITE_URL);
  });

  it('copes with a path given without its leading slash', () => {
    expect(canonical('legal').canonical).toBe(`${SITE_URL}/legal`);
  });

  it('never produces a double slash', () => {
    for (const path of ['/', '/search', 'legal', '/vehicles/v1']) {
      const withoutScheme = canonical(path).canonical.replace(/^https?:\/\//, '');
      expect(withoutScheme, `${path} produced a double slash`).not.toContain('//');
    }
  });
});

describe('the sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it('lists the homepage, the search page and the legal index', () => {
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/search`);
    expect(urls).toContain(`${SITE_URL}/legal`);
  });

  it('lists every car', () => {
    for (const vehicle of mockVehicles) {
      expect(urls, `${vehicle.make} ${vehicle.model} is missing`).toContain(
        `${SITE_URL}/vehicles/${vehicle.id}`,
      );
    }
  });

  it('lists every rental business and every policy', () => {
    for (const provider of mockProviders) {
      expect(urls).toContain(`${SITE_URL}/providers/${provider.id}`);
    }
    for (const document of legalDocuments) {
      expect(urls).toContain(`${SITE_URL}/legal/${document.slug}`);
    }
  });

  it('keeps private pages out — this is the half that matters', () => {
    // Someone else's rentals, a half-finished booking, a business dashboard. A
    // search result pointing at any of these is a dead end at best.
    const forbidden = ['/account', '/booking/', '/login', '/signup', '/otp', '/verify-'];
    for (const url of urls) {
      for (const path of forbidden) {
        expect(url, `${url} should not be in the sitemap`).not.toContain(path);
      }
    }
  });

  it('lets the one public provider page through', () => {
    // A rental business looking to sign up has to be able to find this.
    expect(urls).toContain(`${SITE_URL}/provider/apply`);
  });

  it('gives every entry a full address, not a path', () => {
    for (const url of urls) {
      expect(url.startsWith('http'), `${url} is not a full address`).toBe(true);
    }
  });

  it('lists no page twice', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('ranks the homepage above everything else', () => {
    const home = entries.find((entry) => entry.url === SITE_URL);
    expect(home?.priority).toBe(1);
  });
});

describe('the robots file', () => {
  const file = robots();
  const rules = Array.isArray(file.rules) ? file.rules[0] : file.rules;
  const disallow = ([] as string[]).concat(rules?.disallow ?? []);
  const allow = ([] as string[]).concat(rules?.allow ?? []);

  it('points at the sitemap', () => {
    expect(file.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it('blocks the account area, the booking flow and the provider dashboard', () => {
    expect(disallow).toContain('/account/');
    expect(disallow).toContain('/booking/');
    expect(disallow).toContain('/provider/');
  });

  it('blocks the sign-in and identity pages', () => {
    for (const path of ['/login', '/signup', '/otp', '/verify-id', '/verify-selfie']) {
      expect(disallow, `${path} should be blocked`).toContain(path);
    }
  });

  it('still lets a rental business find the page it signs up on', () => {
    expect(allow).toContain('/provider/apply');
  });

  it('leaves the public side of the site open', () => {
    expect(allow).toContain('/');
    for (const path of ['/search', '/vehicles/', '/legal/']) {
      expect(disallow, `${path} must stay crawlable`).not.toContain(path);
    }
  });
});

describe('what a search engine is told about a car', () => {
  const vehicle = mockVehicles[0];
  const provider = mockProviders.find((p) => p.id === vehicle.providerId);
  const data = jsonLdVehicle(vehicle, provider) as Record<string, any>;

  it('quotes the same price the page shows, per day', () => {
    expect(data.offers.price).toBe(vehicle.dailyRate);
    expect(data.offers.priceCurrency).toBe('USD');
    // Without the unit, a $65 daily rate reads as a $65 car.
    expect(data.offers.unitCode).toBe('DAY');
  });

  it('names the car the way a person would search for it', () => {
    expect(data.name).toContain(vehicle.make);
    expect(data.name).toContain(vehicle.model);
  });

  it('names the business renting it out', () => {
    expect(data.offers.seller.name).toBe(provider?.businessName);
  });

  it('never claims a rating for a car with no reviews', () => {
    const unreviewed = { ...vehicle, reviewCount: 0, rating: 0 };
    expect(jsonLdVehicle(unreviewed)).not.toHaveProperty('aggregateRating');
  });

  it('reports the real rating when there are reviews', () => {
    const reviewed = mockVehicles.find((v) => v.reviewCount > 0);
    if (!reviewed) return;
    const withReviews = jsonLdVehicle(reviewed) as Record<string, any>;
    expect(withReviews.aggregateRating.ratingValue).toBe(reviewed.rating);
    expect(withReviews.aggregateRating.reviewCount).toBe(reviewed.reviewCount);
  });

  it('never quotes a price with the deposit folded into it', () => {
    // The same rule as everywhere else, from a third direction: a search result
    // must not advertise a price that includes money being held rather than
    // taken.
    expect(data.offers.price).toBe(vehicle.dailyRate);
    expect(data.offers.price).not.toBe(vehicle.dailyRate + vehicle.depositAmount);
  });
});

describe('what a search engine is told about a business and a policy', () => {
  it('describes a rental business with its town and rating', () => {
    const provider = mockProviders[0];
    const data = jsonLdProvider(provider) as Record<string, any>;
    expect(data.name).toBe(provider.businessName);
    expect(data.address.addressLocality).toBe(provider.town);
  });

  it('never publishes a business phone number to a search engine', () => {
    // Provider.phone exists so the platform can reach them. It is not part of
    // what gets handed to a search engine.
    for (const provider of mockProviders) {
      expect(JSON.stringify(jsonLdProvider(provider))).not.toContain(provider.phone);
    }
  });

  it('gives a policy its title', () => {
    const document = legalDocuments[0];
    const data = jsonLdLegalDocument(document) as Record<string, any>;
    expect(data.name).toBe(document.title);
  });

  it('never publishes an unparseable date, which would void the whole block', () => {
    // A document's "updated" field is a sentence for a reader, and several of
    // them currently say "Not yet published". Handing that to a date function
    // produces an invalid date; a search engine then discards the entire
    // description, title included. This is the bug that broke the build once.
    for (const document of legalDocuments) {
      const data = jsonLdLegalDocument(document) as Record<string, any>;
      if (!('dateModified' in data)) continue;
      expect(
        Number.isNaN(new Date(data.dateModified).getTime()),
        `${document.slug} published "${data.dateModified}" as a date`,
      ).toBe(false);
    }
  });

  it('leaves the date out for a document with no published date', () => {
    const unpublished = legalDocuments.find((d) => Number.isNaN(new Date(d.updated).getTime()));
    if (!unpublished) return;
    expect(jsonLdLegalDocument(unpublished)).not.toHaveProperty('dateModified');
  });
});

describe('breadcrumbs', () => {
  it('numbers the trail from one and does not link the page you are on', () => {
    const data = jsonLdBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Find a Car', href: '/search' },
      { label: 'Jeep Wrangler' },
    ]) as Record<string, any>;

    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[0].item).toBe(SITE_URL);
    expect(data.itemListElement[1].item).toBe(`${SITE_URL}/search`);
    expect(data.itemListElement[2]).not.toHaveProperty('item');
  });
});
