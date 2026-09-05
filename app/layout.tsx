// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The outermost wrapper around every single page on the
// site. It loads the stylesheet, sets what search engines and social sites show
// when a link is shared, and switches on the handful of things every page needs
// to know about — the light/dark theme, the chosen language, who is signed in,
// the trip being planned, and whether the connection has dropped.
//
// WHY THE PROVIDERS ARE NESTED IN THIS ORDER: each one can only be used by
// things inside it. The theme goes outermost because everything visible needs
// colours; the network warning goes innermost because it is the only one that
// needs all the rest in order to draw itself.

import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Hammersmith_One } from 'next/font/google';
import './globals.css';

// ---- THE HEADING FACE ----
// Hammersmith One, loaded through Next's font handling, which downloads it at
// BUILD time and serves it from our own domain. Nothing is fetched from Google
// when somebody visits, so there is no third-party request, no extra DNS lookup,
// and no font-tracking cookie.
//
// IT IS USED ON HEADINGS ONLY, and that is deliberate: the family ships a single
// weight (400). Body text needs a real bold for emphasis, and a browser asked
// for one it does not have will smear the letters into a fake bold instead. So
// headings get the face, and everything else keeps the system stack — which also
// means body text still appears instantly with no font swap.
//
// "swap" means the system font shows immediately and the heading face replaces
// it once loaded, rather than leaving headings invisible while it downloads.
const headingFont = Hammersmith_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-heading',
});

import { ThemeProvider, THEME_INIT_SCRIPT } from '@/lib/theme/ThemeProvider';
import { I18nProvider } from '@/lib/i18n';
import { SessionProvider } from '@/lib/auth';
import { BusinessProvider } from '@/lib/business';
import { TripProvider } from '@/lib/trip';
import { FavouritesProvider } from '@/lib/favourites';
import { NetworkProvider } from '@/lib/network';
import { NavigationProvider } from '@/lib/navigation';
import { SidebarProvider } from '@/lib/sidebar';
import { ToastProvider } from '@/components/ui';
import { SkipLink } from '@/components/layout/SkipLink';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

// ---- WHAT SEARCH ENGINES AND SHARED LINKS SHOW ----
// This matters more here than it would for most projects. A phone app cannot
// appear in search results at all, which is most of the reason this website
// exists alongside it.
export const metadata: Metadata = {
  // WITHOUT THIS EVERY SHARED LINK BREAKS. Next.js needs to know where the site
  // lives before it can turn "/vehicles/v1" into a full web address, and a
  // preview card in a message can only use full addresses. Set
  // NEXT_PUBLIC_SITE_URL once there is a real domain; see lib/seo.ts.
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'SXM Rentals — Rent a car anywhere on Sint Maarten',
    // Every other page fills in the first part and gets the name appended.
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.png' },

  // The words somebody would actually type. Not a long list — a page stuffed
  // with keywords is ignored, and these are read as a hint at most.
  keywords: [
    'car rental Sint Maarten',
    'car rental St Martin',
    'rent a car SXM',
    'Philipsburg car hire',
    'Simpson Bay car rental',
    'Marigot car rental',
  ],

  openGraph: {
    title: SITE_NAME,
    description:
      'Book a rental car on both sides of Sint Maarten / Saint-Martin. One account, one booking, either side of the island.',
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: 'en_US',
    // The island's other three languages, so a search engine knows the site
    // speaks them rather than guessing from the page it happens to land on.
    alternateLocale: ['nl_NL', 'fr_FR', 'es_ES'],
    type: 'website',
  },

  // How the site looks pasted into X, and the same tags several other apps read.
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Rent a car on either side of Sint Maarten. One account, one booking.',
  },

  // What a search engine is allowed to do with the pages it is allowed to see.
  // The account area, the booking flow and the provider portal each say
  // otherwise in their own layout — this is only the default.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let a result show a full-size photo and a proper description rather than
      // a truncated one.
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Stops a browser turning every price and date into a phone number on iOS,
  // which it otherwise does and which looks broken.
  formatDetection: { telephone: false, date: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Tells the browser to colour its own chrome to match, and to offer both
  // themes rather than assuming light.
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "suppressHydrationWarning" is needed because the small script below
    // changes this tag before React starts. Without it React would complain that
    // the page it built on the server no longer matches what is in the browser.
    <html lang="en" className={headingFont.variable} suppressHydrationWarning>
      <head>
        {/* Sets the light or dark theme BEFORE the browser draws anything.
            Without this, someone who chose dark sees a flash of white on every
            single page load. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>

      <body>
        <ThemeProvider>
          <I18nProvider>
            {/* THE FIRST THING THE KEYBOARD REACHES on any page: a link straight
                past the navigation to the content. Invisible until focused.

                It sits INSIDE the language provider, not above it. It used to be
                three lines of English written directly into this file, which
                worked but never translated. Making it a browser component so it
                could look up its own words meant it also had to move inside the
                provider that holds them — placed here, first, so it is still the
                first thing Tab reaches. */}
            <SkipLink />

            <SessionProvider>
              <BusinessProvider>
                <TripProvider>
                  <FavouritesProvider>
                    <NetworkProvider>
                      <NavigationProvider>
                        <SidebarProvider>
                          <ToastProvider>{children}</ToastProvider>
                        </SidebarProvider>
                      </NavigationProvider>
                    </NetworkProvider>
                  </FavouritesProvider>
                </TripProvider>
              </BusinessProvider>
            </SessionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
