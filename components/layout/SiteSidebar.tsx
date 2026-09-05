'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The sidebar down the left of every customer page — the
// same sections whether you are on the homepage, searching for a car, or deep
// inside your account.
//
// IT USED TO EXIST ONLY INSIDE THE ACCOUNT AREA, which meant the navigation
// changed shape depending on which page you happened to be on: a sidebar on My
// Rentals, none on Find a Car or the homepage. Having it everywhere means one
// consistent place to look, and every section of the site is one click away from
// every other.
//
// THE HAMBURGER IN THE TOP BAR COLLAPSES IT. On a laptop that shrinks it to a
// strip of icons, which keeps the navigation reachable while giving a wide table
// or a four-column grid of cars the room it wants. On a narrow window the same
// button slides it in over the page instead, because there is no width to spare.
//
// COLLAPSED, IT IS ICONS ONLY — so every row keeps a written label for screen
// readers and a tooltip for anyone hovering. An icon rail with no accessible
// names is a navigation bar that is silent to anyone not looking at it.

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';
import { useSidebar } from '@/lib/sidebar';
import { useSession } from '@/lib/auth';
import { useBusiness } from '@/lib/business';
import { useFavourites } from '@/lib/favourites';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { Icon, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import styles from './SiteSidebar.module.css';

type NavItem = {
  href: string;
  // A key, not a word. Looked up in the chosen language when the row is drawn.
  label: TranslationKey;
  icon: IconName;
  // Rows that only make sense once somebody has an account.
  signedInOnly?: boolean;
};

type NavGroup = { title: TranslationKey; items: NavItem[] };

// Grouped the way people think about them: finding a car, the rentals they
// already have, and then the account itself.
//
// EVERY LABEL IS A KEY RATHER THAN A WORD, so the sidebar changes language with
// the rest of the site. The dictionary stores each phrase already in the case it
// should appear in, which is why titleCase() is no longer applied to the result
// below — those rules are English ones, and running them over Dutch or French
// capitalises words that should stay lowercase.
const GROUPS: NavGroup[] = [
  {
    title: 'web.group.browse',
    items: [
      { href: '/', label: 'web.nav.home', icon: 'business-outline' },
      { href: '/search', label: 'web.nav.findCar', icon: 'search' },
    ],
  },
  {
    title: 'web.group.yourRentals',
    items: [
      { href: '/account/rentals', label: 'web.nav.myRentals', icon: 'car-outline' },
      { href: '/account/messages', label: 'web.nav.messages', icon: 'chatbubble-outline' },
      {
        href: '/account/notifications',
        label: 'web.nav.notifications',
        icon: 'notifications-outline',
      },
      { href: '/account/saved', label: 'web.nav.savedCars', icon: 'heart-outline' },
      { href: '/account/rewards', label: 'web.nav.rewards', icon: 'gift-outline' },
    ],
  },
  {
    title: 'web.group.yourAccount',
    items: [
      { href: '/account', label: 'web.nav.profile', icon: 'person-outline', signedInOnly: true },
      {
        href: '/account/documents',
        label: 'web.nav.documents',
        icon: 'documents-outline',
        signedInOnly: true,
      },
      {
        href: '/account/payment-methods',
        label: 'web.nav.paymentMethods',
        icon: 'card-outline',
        signedInOnly: true,
      },
      { href: '/account/language', label: 'web.nav.language', icon: 'globe-outline' },
      { href: '/account/settings', label: 'web.nav.settings', icon: 'settings-outline' },
      { href: '/account/support', label: 'web.nav.support', icon: 'help-circle-outline' },
      { href: '/legal', label: 'web.nav.legal', icon: 'document-outline' },
    ],
  },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const { expanded, drawerOpen, closeDrawer } = useSidebar();
  const { isSignedIn } = useSession();
  const { hasBusiness } = useBusiness();
  const { count: savedCount } = useFavourites();
  const { t } = useTranslation();

  // ---- CLOSE THE DRAWER WHENEVER THE PAGE CHANGES ----
  // Otherwise it stays open on top of whatever was just navigated to, which is
  // the most obvious bug a slide-in menu can have.
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // ---- CLOSE ON ESCAPE ----
  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, closeDrawer]);

  // "/" and "/account" are pages in their own right, so they only count as
  // current on an exact match — otherwise they would light up everywhere.
  const isActive = (href: string): boolean => {
    if (href === '/' || href === '/account') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Read once rather than four times, since each appears as the visible words,
  // the tooltip and the screen-reader label.
  const businessLabel = t('web.nav.businessDashboard');
  const listLabel = t('web.nav.listVehicles');

  return (
    <>
      {/* The dimmed layer behind the drawer on a narrow window. Clicking it
          closes the drawer, which is what people try first. */}
      {drawerOpen ? (
        <div
          className={styles.backdrop}
          onClick={closeDrawer}
          aria-hidden="true"
          data-print="hide"
        />
      ) : null}

      <aside
        className={cx(
          styles.sidebar,
          !expanded && styles.collapsed,
          drawerOpen && styles.drawerOpen,
        )}
        data-print="hide"
      >
        <nav className={cx(styles.inner, 'thinScroll')} aria-label={t('web.a11y.sections')}>
          {GROUPS.map((group, groupIndex) => {
            const items = group.items.filter(
              (item) => !item.signedInOnly || isSignedIn,
            );
            if (items.length === 0) return null;

            return (
              <React.Fragment key={group.title}>
                {/* When the labels are hidden there are no group headings
                    either, so a plain line separates the groups instead. */}
                {groupIndex > 0 ? <hr className={styles.groupRule} /> : null}

                {/* "raw" stops Text applying English Title Case rules on top of
                    a phrase that is already correctly cased in its own
                    language. */}
                <Text
                  variant="caption"
                  tone="ink3"
                  as="p"
                  className={styles.groupTitle}
                  raw
                >
                  {t(group.title)}
                </Text>

                {items.map((item) => {
                  const active = isActive(item.href);
                  const label = t(item.label);
                  const showCount = item.href === '/account/saved' && savedCount > 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(styles.navLink, active && styles.navLinkActive)}
                      aria-current={active ? 'page' : undefined}
                      // Collapsed, the words are gone from the screen but not
                      // from the page, so this stays announced and shows as a
                      // tooltip on hover.
                      title={label}
                      aria-label={label}
                    >
                      <Icon name={item.icon} size={18} />
                      <span className={styles.label}>{label}</span>
                      {showCount ? (
                        <span className={styles.badge}>{savedCount}</span>
                      ) : null}
                    </Link>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* ---- ACROSS TO THE BUSINESS SIDE ----
              Pinned to the bottom, and only shown to somebody who actually runs
              a rental business. */}
          <div className={styles.foot}>
            <Link
              href={hasBusiness ? '/provider' : '/provider/apply'}
              className={styles.navLink}
              title={hasBusiness ? businessLabel : listLabel}
              aria-label={hasBusiness ? businessLabel : listLabel}
            >
              <Icon name="storefront-outline" size={18} />
              <span className={styles.label}>{hasBusiness ? businessLabel : listLabel}</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default SiteSidebar;
