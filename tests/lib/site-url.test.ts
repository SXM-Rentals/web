// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests how the site's own web address is read from its
// setting, NEXT_PUBLIC_SITE_URL — including the ways that setting can be
// filled in wrong.
//
// WHY THIS DESERVES ITS OWN TESTS. Every canonical link, every sitemap entry
// and every link preview is built from this one value, and the ways it goes
// wrong are silent. A missing value used to publish localhost addresses on the
// live site. A value with two addresses in it — which really was entered, in
// good faith, because the site does answer at two — crashed the deploy with
// nothing more helpful than "Invalid URL".
//
// Each case below is one of those, pinned down so it cannot quietly come back.
//
// The address is worked out once, when lib/seo.ts first loads, so every test
// sets the value and then loads that file afresh.

import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

/** Loads lib/seo.ts fresh with the setting as given, and hands back SITE_URL. */
async function siteUrlWhenSetTo(value: string | undefined): Promise<string> {
  if (value === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = value;

  vi.resetModules();
  const { SITE_URL } = await import('@/lib/seo');
  return SITE_URL;
}

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('the site address setting', () => {
  it('uses a correct address as given', async () => {
    await expect(siteUrlWhenSetTo('https://sxmrentals.app')).resolves.toBe('https://sxmrentals.app');
  });

  it('drops a trailing slash, which would otherwise double up in every link', async () => {
    await expect(siteUrlWhenSetTo('https://sxmrentals.app/')).resolves.toBe('https://sxmrentals.app');
  });

  it('tidies capitals and stray spaces rather than refusing them', async () => {
    // Harmless slips. Refusing these would be pedantic; the address they
    // mean is not in doubt.
    await expect(siteUrlWhenSetTo('  HTTPS://SxmRentals.app  ')).resolves.toBe('https://sxmrentals.app');
  });

  // ---- THE ONE THAT ACTUALLY HAPPENED ----
  it('refuses two addresses, and says why in plain words', async () => {
    // Entered in good faith: the site really does answer at both. But only
    // one can be "the real one" to a search engine, and the setting says
    // which. Both keep working regardless — that is Vercel's domains list.
    const both = 'https://sxm-rentals.vercel.app, https://sxmrentals.app';

    const failure = await siteUrlWhenSetTo(both).then(
      () => {
        throw new Error('Expected two addresses to be refused, but they were accepted.');
      },
      (caught: unknown) => caught as Error,
    );

    // The message has to be useful to somebody looking at a settings page,
    // not only to somebody reading a stack trace.
    expect(failure.message).toContain('NEXT_PUBLIC_SITE_URL must be one web address');
    expect(failure.message).toContain(both);
    expect(failure.message).toContain('Environment Variables');
  });

  it('refuses a bare domain with no https:// in front', async () => {
    // Probably the most natural thing to type. Without the scheme it is not a
    // web address, and every link built from it would be relative nonsense.
    await expect(siteUrlWhenSetTo('sxmrentals.app')).rejects.toThrow(/must be one web address/);
  });

  it('refuses an address with a page on the end', async () => {
    // "/search" here would be glued onto the front of every link on the site.
    await expect(siteUrlWhenSetTo('https://sxmrentals.app/search')).rejects.toThrow(
      /must be one web address/,
    );
  });
});

describe('when the setting is missing', () => {
  it('treats blank as missing, not as an address', async () => {
    // A value saved empty is a string, not an absence — and an empty site
    // address would build every link on the site out of nothing.
    await expect(siteUrlWhenSetTo('   ')).resolves.toBe('http://localhost:3000');
  });

  it('falls back to localhost while developing', async () => {
    await expect(siteUrlWhenSetTo(undefined)).resolves.toBe('http://localhost:3000');
  });

  it('falls back to the real domain on the live site, never to localhost', async () => {
    // The safety net. A forgotten setting on the deployed site must not
    // publish fifty-two localhost links and a canonical on every page
    // pointing at a machine nobody can reach.
    vi.stubEnv('NODE_ENV', 'production');
    await expect(siteUrlWhenSetTo(undefined)).resolves.toBe('https://www.sxmrentals.app');
  });
});
