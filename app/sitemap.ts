// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Produces /sitemap.xml — the list a search engine reads to
// find every page worth indexing, rather than discovering them by following
// links and hoping.
//
// WHY IT IS WRITTEN IN CODE RATHER THAN BY HAND: the cars change. A hand-written
// list would be out of date the day a business adds a vehicle, and would keep
// advertising cars that have been taken down. Building it from the same data the
// pages are built from means it cannot drift.
//
// WHAT IS DELIBERATELY LEFT OUT — and this is the more important half:
//
//   the booking flow      pages that only make sense partway through a booking
//   the account area      somebody else's rentals, messages and settings
//   the provider portal   a business's own dashboard
//   sign-in and ID checks  nothing there is for the public
//
// None of those should ever appear in a search result. Listing them would at
// best waste the crawl on pages that redirect to a sign-in, and at worst put a
// page nobody should reach in front of somebody.
//
// TO SEE IT: with the site running, open http://localhost:3000/sitemap.xml

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { apiClient } from '@/lib/api-client';
import { legalDocuments } from '@/lib/content/legal';

// Rebuilt at most once an hour. A car being added is not urgent enough to ask
// the backend on every crawl, and a crawler does not read this often anyway.
//
// This one is real, unlike the ones removed from the car and business pages:
// sitemap.xml has no [id] in its address, so Next.js can and does cache it.
//
// Written out as a number rather than as a named constant because Next.js
// reads this line without running it, and rejects anything it cannot read as
// a plain value. The 3600 below has to match it by hand for that reason.
export const revalidate = 3600;
const SITEMAP_MAX_AGE_SECONDS = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Everything shares one timestamp because the backend does not yet report
  // when a given car was last edited. Once it does, each entry should carry
  // its own — a crawler uses it to decide what to re-read.
  const now = new Date();

  // ---- WHAT HAPPENS WHEN THE BACKEND DOES NOT ANSWER ----
  //
  // This is the one place in the app where failing loudly is the right
  // behaviour, and it is worth saying why.
  //
  // A sitemap that lists four fixed pages, replacing one that listed forty
  // cars, does not read to a search engine as "the server was briefly down".
  // It reads as "those forty pages have been deleted", and they start dropping
  // out of the index. The damage takes weeks to undo and nothing in the app
  // looks wrong while it happens.
  //
  // So in production a failed request fails the build. A deploy that does not
  // happen is a nuisance; a deploy that quietly un-publishes the catalogue is
  // not. Locally and in previews it carries on with a loud log, because
  // blocking somebody's work over a sitemap would be absurd.
  //
  // An EMPTY list is different from a FAILED one, and is fine. An empty answer
  // is the backend telling the truth — today there genuinely are no cars.
  const [vehicleResult, providerResult] = await Promise.allSettled([
    // An hour, matching this file's own revalidate. A sitemap is read by
    // crawlers, not people, and pulling the whole catalogue twice for one
    // file would be the most expensive request on the site.
    apiClient.listVehicles({}, { revalidate: SITEMAP_MAX_AGE_SECONDS }),
    apiClient.listProviders({ revalidate: SITEMAP_MAX_AGE_SECONDS }),
  ]);

  const failed = [vehicleResult, providerResult].filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    const reasons = failed.map((r) => (r as PromiseRejectedResult).reason);
    if (process.env.VERCEL_ENV === 'production') {
      throw new Error(
        'Refusing to publish a sitemap without the catalogue: the backend did not answer. ' +
          'Publishing four pages in place of the full list would read as a mass deletion. ' +
          String(reasons[0]),
      );
    }
    console.warn('[sitemap] the backend did not answer; listing the fixed pages only', reasons[0]);
  }

  const allVehicles = vehicleResult.status === 'fulfilled' ? vehicleResult.value : [];
  const allProviders = providerResult.status === 'fulfilled' ? providerResult.value : [];

  // ---- THE PAGES THAT EXIST WHATEVER THE DATA SAYS ----
  //
  // "priority" is a hint about which pages matter most to us, not a ranking.
  // The homepage and the search page are the two front doors; the legal index is
  // useful but nobody arrives at the site looking for it.
  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/legal`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    // The page a rental business lands on. Public, and the one route into the
    // provider side that should be findable.
    {
      url: `${SITE_URL}/provider/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // ---- ONE ENTRY PER CAR ----
  // The pages that most need to be found, and the reason this file is generated.
  const vehicles: MetadataRoute.Sitemap = allVehicles.map((vehicle) => ({
    url: `${SITE_URL}/vehicles/${vehicle.id}`,
    lastModified: now,
    // A car's price and availability move often enough to be worth re-checking
    // weekly; the car itself does not change.
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // A car's reviews are their own page, and a page of genuine written reviews is
  // worth finding on its own.
  const vehicleReviews: MetadataRoute.Sitemap = allVehicles
    .filter((vehicle) => vehicle.reviewCount > 0)
    .map((vehicle) => ({
      url: `${SITE_URL}/vehicles/${vehicle.id}/reviews`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    }));

  // ---- ONE ENTRY PER RENTAL BUSINESS ----
  // Somebody who has heard a business's name and is checking whether it is real
  // should find this page.
  const providers: MetadataRoute.Sitemap = allProviders.map((provider) => ({
    url: `${SITE_URL}/providers/${provider.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // ---- ONE ENTRY PER POLICY DOCUMENT ----
  // Low priority, but they belong in the index: the deposit policy in particular
  // is something people search for by name before they book.
  // NOTE ON THE DATE: a document's "updated" field is a sentence written for a
  // reader — several of them currently say "Not yet published" — rather than a
  // date a computer can parse. So the build timestamp is used here instead. Once
  // these documents carry a real date, use it.
  const legal: MetadataRoute.Sitemap = legalDocuments.map((document) => ({
    url: `${SITE_URL}/legal/${document.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...fixed, ...vehicles, ...vehicleReviews, ...providers, ...legal];
}
