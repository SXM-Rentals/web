'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The heading block at the top of an inner page, and the
// trail of links above it showing where in the site you are.
//
// WHY THE TRAIL IS WORTH THE ROOM IT TAKES: a phone has a back button, and a
// browser has history, but neither answers "where am I?". Someone who arrived on
// a car page straight from a Google result has no history at all and no way to
// discover that the page sits underneath "Cars" — the trail is the only thing
// that tells them, and the only way up a level rather than backwards.

import React from 'react';
import Link from 'next/link';
import { cx } from '@/lib/utils';
import { titleCase } from '@/lib/format';
import { Icon, Text } from '@/components/ui';
import styles from './PageHeader.module.css';
import { useTranslation, type TranslationKey } from '@/lib/i18n';

export type Crumb = {
  // Either finished words, or a key to look one up with. A page built on the
  // server has no way to call t(), so it passes labelKey and lets this
  // component — which runs in the browser — do the lookup instead.
  label?: string;
  labelKey?: TranslationKey;
  // Left out on the last item, which is the page being looked at.
  href?: string;
};

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useTranslation();

  // A translated label is already in the right case for its language, so it is
  // not put through titleCase — those rules are English ones and would
  // capitalise the wrong words in French. A plain string still is, which keeps
  // the old behaviour for anything not yet translated.
  const wordsFor = (item: Crumb) => (item.labelKey ? t(item.labelKey) : titleCase(item.label ?? ''));

  return (
    // Marked up as real navigation and as an ordered list, which is what lets a
    // screen reader announce "breadcrumb, 2 of 3" instead of reading three
    // unrelated links.
    <nav aria-label={t('shared.breadcrumb')} className={cx(styles.crumbs, className)}>
      <ol className={styles.crumbs}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.labelKey ?? item.label}-${index}`} className={styles.crumbs}>
              {item.href && !isLast ? (
                <Link href={item.href} className={cx(styles.crumb, styles.crumbLink)}>
                  {wordsFor(item)}
                </Link>
              ) : (
                <span className={styles.crumbCurrent} aria-current="page">
                  {wordsFor(item)}
                </span>
              )}

              {!isLast ? (
                <span className={styles.separator} aria-hidden="true">
                  <Icon name="chevron-forward" size={13} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  titleKey,
  subtitle,
  subtitleKey,
  crumbs,
  // Buttons on the right-hand side of the heading.
  actions,
  // Which heading level this is. Almost always h1, since this is the page's
  // main heading — but a panel inside a page may need a lower one.
  as = 'h1',
  className,
}: {
  // Same arrangement as a breadcrumb above: finished words, or a key for this
  // component to look up. A server page passes the key.
  title?: string;
  titleKey?: TranslationKey;
  subtitle?: string;
  subtitleKey?: TranslationKey;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const { t } = useTranslation();

  const heading = titleKey ? t(titleKey) : title ?? '';
  const lede = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <div className={cx(styles.header, className)}>
      {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}

      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          {/* "raw" when the words came from the dictionary: they are already
              in the right case for their language. */}
          <Text variant="h1" as={as} raw={Boolean(titleKey)}>
            {heading}
          </Text>
          {lede ? (
            <Text variant="bodyLg" tone="ink2" raw>
              {lede}
            </Text>
          ) : null}
        </div>

        {actions ? (
          <div className={styles.headerActions} data-print="hide">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PageHeader;
