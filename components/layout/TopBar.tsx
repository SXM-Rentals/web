'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The bar across the top of every customer page — the logo
// on the left, the main links in the middle, and the account, theme and language
// controls on the right.
//
// WHAT IT SHOWS DEPENDS ON WHETHER SOMEONE IS SIGNED IN, and the signed-out
// version is the important one. Most people arriving here have come from a
// search engine, have no account, and will leave if the site demands one before
// showing them anything. So a signed-out visitor gets the full run of the site
// plus a quiet "Sign In" — never a wall.
//
// The menu behind the account button closes on Escape, on a click anywhere
// outside it, and whenever the page changes. All three matter: a menu that stays
// stuck open over the next page is a common and very obvious bug.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';
import { useSession } from '@/lib/auth';
import { useBusiness } from '@/lib/business';
import { useFavourites } from '@/lib/favourites';
import { useSidebar } from '@/lib/sidebar';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { usesSidebar } from './SiteShell';
import {
  Avatar,
  Button,
  Icon,
  IconButton,
  ListRow,
  Logo,
  Text,
  ThemeToggleButton,
  LanguageButton,
} from '@/components/ui';
import styles from './TopBar.module.css';

// The main links. Kept short on purpose — a top bar with ten links in it is a
// menu, and people stop reading menus.
//
// THE LABELS ARE KEYS, NOT WORDS. Each one is looked up in the chosen language
// at the moment it is drawn; see lib/i18n. The phrases are stored already in the
// case they should appear in, which is why titleCase() is NOT applied to the
// result — those capitalisation rules are English ones, and running them over
// French would turn "Trouver une voiture" into "Trouver Une Voiture".
const NAV_LINKS: { href: string; label: TranslationKey }[] = [
  { href: '/search', label: 'web.nav.findCar' },
  { href: '/account/rentals', label: 'web.nav.myRentals' },
  { href: '/account/messages', label: 'web.nav.messages' },
  { href: '/account/rewards', label: 'web.nav.rewards' },
];

export function TopBar() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useSession();
  const { hasBusiness } = useBusiness();
  const { count: savedCount } = useFavourites();
  const { expanded, drawerOpen, toggle } = useSidebar();
  const { t } = useTranslation();
  // Read here rather than inside the menu, so the row below can say which mode
  // is on rather than only offering to change it.
  const { scheme, toggle: toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ---- CLOSE THE MENU WHEN THE PAGE CHANGES ----
  // Without this it stays open on top of whatever was just navigated to.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ---- CLOSE ON ESCAPE, AND ON A CLICK OUTSIDE ----
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [menuOpen]);

  // Marks the link for the page currently being looked at. A nested page such as
  // /account/rentals/123 still counts as being under "My rentals".
  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.bar} data-print="hide">
      <div className={cx('container', styles.inner)}>
        {/* ---- THE HAMBURGER ----
            One button doing the sensible thing for the width it finds itself
            in: on a laptop it shrinks the sidebar to a strip of icons and back,
            and on a narrow window it slides the sidebar in over the page. Two
            separate controls would both need explaining; this needs none. */}
        {/* Hidden on the pages that have no sidebar. A hamburger that collapses
            something which is not on screen is a button that appears broken. */}
        {usesSidebar(pathname) ? (
        <IconButton
          icon="menu"
          label={
            drawerOpen
              ? t('web.a11y.closeMenu')
              : expanded
                ? t('web.a11y.collapseSidebar')
                : t('web.a11y.expandSidebar')
          }
          variant="plain"
          onClick={toggle}
          expanded={drawerOpen || expanded}
        />
        ) : null}

        <Link href="/" className={styles.logoLink} aria-label={t('web.a11y.homeLink')}>
          <Logo size={28} priority decorative />
        </Link>

        {/* The main links. Marked up as real navigation so that screen readers
            can jump straight to it, and skip past it just as easily. */}
        <nav className={styles.nav} aria-label={t('web.a11y.mainNav')}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cx(styles.navLink, isActive(link.href) && styles.navLinkActive)}
              // Tells screen readers which one is the page being looked at.
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {/* Already in Title Case in the dictionary, in every language —
                  see the note above NAV_LINKS for why it is stored that way
                  rather than capitalised here. */}
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <span className={styles.spacer} />

        <div className={styles.actions}>
          {/* ---- ACROSS TO THE BUSINESS SIDE ----
              Only shown to someone who actually runs a rental business.

              It used to disappear below 1100px, which meant a business owner
              checking a booking on their phone — which is most of how a business
              owner uses this — had no way across at all. Now the shopfront icon
              is always there and the word beside it appears when there is room
              for it. */}
          {hasBusiness ? (
            <Link
              href="/provider"
              className={styles.businessLink}
              aria-label={t('web.nav.businessDashboard')}
              title={t('web.nav.businessDashboard')}
            >
              <Icon name="storefront-outline" size={18} />
              <span className={styles.businessLabel}>{t('web.nav.business')}</span>
            </Link>
          ) : null}

          {/* ---- LANGUAGE ----
              Visible at every width, and this is the one control that has to be.
              Somebody who does not read English cannot find their way to a menu
              labelled "Menu" in order to change the language — the globe is the
              only thing on the page that means the same to them as to everyone
              else. Hiding it on phones hid it from exactly the people who need
              it, on the devices most visitors arrive with.

              The light/dark switch is a preference rather than a barrier, so it
              sits in the menu below as a labelled row instead, where there is
              room to say which mode you are actually in. */}
          <LanguageButton />

          <span className={styles.desktopOnly}>
            <ThemeToggleButton />
          </span>

          {isSignedIn ? (
            <IconButton
              icon="notifications-outline"
              label={t('web.nav.notifications')}
              variant="plain"
              href="/account/notifications"
              className={styles.desktopOnly}
            />
          ) : null}

          {/* ---- THE ACCOUNT MENU ---- */}
          <div className={styles.accountWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.accountButton}
              onClick={() => setMenuOpen((open) => !open)}
              // Says this button opens a menu, and whether that menu is open.
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={isSignedIn ? t('web.menu.accountMenu') : t('web.menu.menu')}
            >
              {isSignedIn && user ? (
                <Avatar firstName={user.firstName} lastName={user.lastName} size={32} />
              ) : (
                <Icon name="menu" size={20} />
              )}

              <span className={styles.accountName}>
                {isSignedIn && user ? user.firstName : t('web.menu.menu')}
              </span>

              <Icon name="chevron-down" size={15} />
            </button>

            {menuOpen ? (
              <div className={styles.menu} role="menu">
                {isSignedIn && user ? (
                  <>
                    <div className={styles.menuHeader}>
                      <Text variant="label">{`${user.firstName} ${user.lastName}`}</Text>
                      <Text variant="small" tone="ink2">
                        {user.email}
                      </Text>
                    </div>
                    <hr className={styles.menuDivider} />
                  </>
                ) : null}

                {/* On a narrow window the main links live in here, since there
                    is no room for them across the top. */}
                <span className={styles.mobileOnly}>
                  <span style={{ display: 'block', width: '100%' }}>
                    {NAV_LINKS.map((link) => (
                      <ListRow key={link.href} title={t(link.label)} href={link.href} />
                    ))}
                    <hr className={styles.menuDivider} />
                  </span>
                </span>

                {/* ---- LIGHT OR DARK ----
                    A row rather than an icon, because a row can say which one
                    you are in. A bare moon on its own leaves you to work out
                    whether it means "you are in dark" or "press for dark" —
                    and the honest answer is that nobody is sure. Shown at every
                    width; the icon version above only appears when the bar is
                    wide enough to spare the space. */}
                <ListRow
                  title={t('web.menu.appearance')}
                  icon={scheme === 'dark' ? 'moon-outline' : 'sunny-outline'}
                  onClick={toggleTheme}
                  trailing={
                    <Text variant="small" tone="ink2" as="span" raw>
                      {scheme === 'dark' ? t('settings.dark') : t('settings.light')}
                    </Text>
                  }
                />

                <hr className={styles.menuDivider} />

                {isSignedIn ? (
                  <>
                    <ListRow title={t('web.nav.account')} icon="person-outline" href="/account" />
                    <ListRow
                      title={t('web.nav.savedCars')}
                      icon="heart-outline"
                      href="/account/saved"
                      trailing={
                        savedCount > 0 ? (
                          <Text variant="small" tone="ink2" as="span">
                            {savedCount}
                          </Text>
                        ) : null
                      }
                    />
                    <ListRow
                      title={t('web.nav.notifications')}
                      icon="notifications-outline"
                      href="/account/notifications"
                    />
                    <ListRow
                      title={t('web.nav.settings')}
                      icon="settings-outline"
                      href="/account/settings"
                    />
                    <ListRow
                      title={t('web.nav.support')}
                      icon="help-circle-outline"
                      href="/account/support"
                    />

                    {hasBusiness ? (
                      <>
                        <hr className={styles.menuDivider} />
                        <ListRow
                          title={t('web.nav.businessDashboard')}
                          icon="storefront-outline"
                          href="/provider"
                        />
                      </>
                    ) : (
                      <>
                        <hr className={styles.menuDivider} />
                        <ListRow
                          title={t('web.nav.listVehicles')}
                          icon="storefront-outline"
                          href="/provider/apply"
                        />
                      </>
                    )}

                    <hr className={styles.menuDivider} />
                    <ListRow
                      title={t('web.menu.signOut')}
                      icon="log-out-outline"
                      danger
                      onClick={() => signOut()}
                    />
                  </>
                ) : (
                  <>
                    <ListRow title={t('web.nav.legal')} icon="document-outline" href="/legal" />
                    <ListRow
                      title={t('web.nav.listVehicles')}
                      icon="storefront-outline"
                      href="/provider/apply"
                    />

                    <hr className={styles.menuDivider} />

                    <div className={styles.menuFooter}>
                      <Button
                        label={t('auth.signIn')}
                        href="/login"
                        variant="outline"
                        size="sm"
                      />
                      <Button label={t('auth.signUp')} href="/signup" size="sm" />
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
