'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The sidebar down the left of the provider portal — the
// six main sections, plus the way back out to the customer side of the site.
//
// THE WAY BACK MATTERS. Somebody running a rental business is also a person who
// might want to rent a car, and a dashboard with no visible exit feels like a
// trap. It sits at the bottom of the sidebar, permanently, rather than being
// hidden in a menu.

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';
import { useBusiness } from '@/lib/business';
import { Icon, Logo, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import styles from '@/app/provider/provider.module.css';

// The label is a key rather than a word, looked up in the chosen language when
// the row is drawn. The dictionary stores each phrase already in the case it
// should appear in, which is why titleCase() is not applied to the result — its
// capitalisation rules are English ones and would mis-case the other three
// languages.
type NavItem = { href: string; label: TranslationKey; icon: IconName };

const GROUPS: { title: TranslationKey; items: NavItem[] }[] = [
  {
    title: 'web.provider.groupRunning',
    items: [
      { href: '/provider', label: 'web.provider.overview', icon: 'business-outline' },
      { href: '/provider/bookings', label: 'web.provider.bookings', icon: 'calendar-outline' },
      { href: '/provider/fleet', label: 'web.provider.fleet', icon: 'car-outline' },
      { href: '/provider/messages', label: 'web.provider.messages', icon: 'chatbubble-outline' },
    ],
  },
  {
    title: 'web.provider.groupMoney',
    items: [
      { href: '/provider/payouts', label: 'web.provider.payouts', icon: 'card-outline' },
      { href: '/provider/performance', label: 'web.provider.performance', icon: 'flash-outline' },
      { href: '/provider/promotions', label: 'web.provider.promotions', icon: 'gift-outline' },
    ],
  },
  {
    title: 'web.provider.groupYours',
    items: [
      {
        // What CUSTOMERS see: the name, the description, what it offers.
        href: '/provider/profile',
        label: 'web.provider.businessProfile',
        icon: 'storefront-outline',
      },
      {
        // How the DASHBOARD behaves for whoever is looking at it: light or
        // dark, which language, which emails. A different thing, owned by a
        // different person — see the note at the top of the page itself.
        href: '/provider/settings',
        label: 'web.nav.settings',
        icon: 'settings-outline',
      },
    ],
  },
];

export function ProviderNav() {
  const pathname = usePathname();
  const { provider } = useBusiness();
  const { t } = useTranslation();

  // "/provider" is the overview itself, so it only counts as current on an exact
  // match — otherwise it would light up on every page in the portal.
  const isActive = (href: string): boolean =>
    href === '/provider' ? pathname === '/provider' : pathname.startsWith(href);

  return (
    <aside className={cx(styles.sidebar, 'thinScroll')}>
      <div className={styles.brandRow}>
        <Link href="/provider" aria-label="SXM Rentals business dashboard">
          <Logo size={24} decorative />
        </Link>
      </div>

      {provider ? (
        <div className={styles.brandRow} style={{ paddingTop: 0 }}>
          <div style={{ minWidth: 0 }}>
            <Text variant="label" as="p" raw>
              {provider.businessName}
            </Text>
            <Text variant="caption" tone="ink3" as="p" raw>
              {t('web.nav.businessDashboard')}
            </Text>
          </div>
        </div>
      ) : null}

      <nav className={styles.nav} aria-label={t('web.a11y.sections')}>
        {GROUPS.map((group) => (
          <React.Fragment key={group.title}>
            {/* "raw" stops Text applying English Title Case rules on top of a
                phrase that is already correctly cased in its own language. */}
            <Text
              variant="caption"
              tone="ink3"
              as="p"
              className={styles.navGroup}
              raw
            >
              {t(group.title)}
            </Text>

            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(styles.navLink, isActive(item.href) && styles.navLinkActive)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <Icon name={item.icon} size={18} />
                {t(item.label)}
              </Link>
            ))}
          </React.Fragment>
        ))}
      </nav>

      {/* Always visible, so the business side never feels like a room with no
          door back out. */}
      <div className={styles.sidebarFoot}>
        <Link href="/" className={styles.navLink}>
          <Icon name="arrow-back" size={18} />
          {t('web.nav.backToRenting')}
        </Link>
      </div>
    </aside>
  );
}

export default ProviderNav;
