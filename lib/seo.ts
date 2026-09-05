// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Everything to do with being found by a search engine and
// with looking right when a link is pasted into a message.
//
// WHY THIS MATTERS MORE THAN USUAL HERE: a phone app cannot appear in search
// results at all. Somebody searching "rent a jeep in Simpson Bay" has no way of
// reaching the app; they reach this website or they reach a competitor. Being
// findable is most of the reason the website exists alongside the app, which is
// why this is a proper piece of the build rather than a tag added at the end.
//
// THE THREE THINGS IN HERE:
//
//   SITE_URL          — where the site lives. Everything else is built from it.
//   canonical()       — the one true address of a page, so the same car listed
//                       under two addresses is not read as two competing pages.
//   the jsonLd*()     — a description of a page written for machines rather
//     builders           than people, which is what produces the price, the star
//                        rating and the business name directly in a search
//                        result rather than a plain blue link.
//
// NOTHING HERE IS RENDERED AS VISIBLE TEXT. It all ends up in the page's head or
// in a script tag that only a search engine reads.

import type { Vehicle, Provider, LegalDocument } from '@/types';

// ---- WHERE THE SITE LIVES ----
//
// Search engines need absolute addresses — "/vehicles/v1" means nothing without
// knowing which site it is on. During development that is localhost; once there
// is a real domain, set NEXT_PUBLIC_SITE_URL and nothing else needs changing.
//
// The domain below is a placeholder and is deliberately the only place it is
// written down. It is used, and reachable, only through this constant.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, ''); // a trailing slash here would double up in every link

export const SITE_NAME = 'SXM Rentals';

export const SITE_DESCRIPTION =
  'Book a rental car on both sides of Sint Maarten / Saint-Martin. Verified rental businesses, transparent pricing, and security deposits that are held rather than charged.';

// ---- CANONICAL ADDRESSES ----
//
// The same car can be reached at several addresses once search filters, tracking
// parameters and trailing slashes are involved. Left alone, a search engine
// treats those as separate pages competing with each other, and each one ranks
// worse than the single page would have. A canonical tag says "whatever address
// you arrived by, this is the real one".
export function canonical(path: string): { canonical: string } {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return { canonical: `${SITE_URL}${clean === '/' ? '' : clean}` };
}

// ---- STRUCTURED DESCRIPTIONS ----
//
// These produce a JSON block that search engines read to understand what a page
// is about. It is what turns a result from a blue link into a result showing the
// price, the rating and the number of reviews.
//
// EVERY VALUE BELOW COMES FROM THE SAME DATA THE PAGE DISPLAYS. That is not an
// accident: describing a car to a search engine differently from how it is shown
// to a person is both dishonest and, if noticed, penalised. If the price on the
// page changes, the price here changes with it.

type JsonLd = Record<string, unknown>;

// The business itself. Used on the homepage.
export function jsonLdOrganisation(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: [
      { '@type': 'Country', name: 'Sint Maarten' },
      { '@type': 'Place', name: 'Saint-Martin' },
    ],
  };
}

// Tells a search engine that the site has a search of its own, which is what
// produces a search box underneath the result.
export function jsonLdWebsite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// One car. This is the page that most needs to be findable.
//
// A car for hire is described as a Product with an Offer rather than as a
// Vehicle, because "Vehicle" describes a car being sold. What is on offer here
// is the use of it for a day, and the price only makes sense with that unit
// attached — otherwise a $65 daily rate reads as a $65 car.
export function jsonLdVehicle(vehicle: Vehicle, provider?: Provider): JsonLd {
  const name = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: vehicle.description,
    category: 'Car rental',
    brand: { '@type': 'Brand', name: vehicle.make },
    offers: {
      '@type': 'Offer',
      price: vehicle.dailyRate,
      priceCurrency: 'USD',
      // "per day" — without this the price is meaningless.
      unitCode: 'DAY',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/vehicles/${vehicle.id}`,
      areaServed: vehicle.pickupTown,
      ...(provider
        ? { seller: { '@type': 'Organization', name: provider.businessName } }
        : {}),
    },
    // Only included when reviews actually exist. A rating built from nothing is
    // the kind of thing search engines strip the whole block for.
    ...(vehicle.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: vehicle.rating,
            reviewCount: vehicle.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// A rental business's own page.
export function jsonLdProvider(provider: Provider): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: provider.businessName,
    url: `${SITE_URL}/providers/${provider.id}`,
    description: provider.description,
    address: { '@type': 'PostalAddress', addressLocality: provider.town },
    ...(provider.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: provider.rating,
            reviewCount: provider.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// Turns a document's "last updated" note into a real date, or nothing.
//
// WHY THIS IS NEEDED: LegalDocument.updated is free text, not a date. Several of
// these documents currently say "Not yet published" rather than naming a day,
// which is honest and right for a product that has not launched. Handing that
// sentence to a date function produces an invalid date, and an invalid date in a
// page description is worse than no date at all — a search engine reads the
// whole block as malformed and discards it, losing the title and description
// along with it.
function asDate(value: string): string | undefined {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

// A policy or terms document.
export function jsonLdLegalDocument(document: LegalDocument): JsonLd {
  const modified = asDate(document.updated);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: document.title,
    url: `${SITE_URL}/legal/${document.slug}`,
    // The first section's opening sentence stands in for a summary, since these
    // documents do not carry one of their own.
    ...(document.sections[0]
      ? { description: document.sections[0].body.split('. ')[0] }
      : {}),
    // Left out entirely when the document has no published date yet.
    ...(modified ? { dateModified: modified } : {}),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  };
}

// The trail of links back to the homepage, as a search engine reads it. This is
// what produces "sxmrentals.com › Find a car › Jeep Wrangler" in a result
// instead of the bare address.
export function jsonLdBreadcrumbs(trail: { label: string; href?: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.label,
      ...(step.href ? { item: `${SITE_URL}${step.href === '/' ? '' : step.href}` } : {}),
    })),
  };
}
