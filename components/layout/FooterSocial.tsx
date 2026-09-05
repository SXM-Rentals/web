'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The row of social logos in the footer, so somebody who
// has read to the bottom of the page has an obvious way to follow.
//
// IT READS THE SAME LIST AS THE FLOATING BUTTON on the homepage (lib/social.ts),
// so the two can never end up showing different accounts.
//
// A real link when the account exists, so it can be middle-clicked and opened in
// a new tab like any other. Until then it is a button that says the account is
// not open yet — never a link that goes nowhere.

import React from 'react';
import { SOCIAL_LINKS } from '@/lib/social';
import { BrandIcon, useToast } from '@/components/ui';
import styles from './Footer.module.css';

export function FooterSocial() {
  const { showToast } = useToast();

  return (
    <div className={styles.social}>
      {SOCIAL_LINKS.map((social) =>
        social.url ? (
          <a
            key={social.name}
            href={social.url}
            className={styles.socialLink}
            // Leaving our site, so the page being opened gets no handle back on
            // ours.
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`SXM Rentals on ${social.name}`}
            title={social.name}
          >
            <BrandIcon name={social.brand} size={18} />
          </a>
        ) : (
          <button
            key={social.name}
            type="button"
            className={styles.socialLink}
            aria-label={`SXM Rentals on ${social.name} — not set up yet`}
            title={social.name}
            onClick={() =>
              showToast(
                `${social.name} is not set up yet`,
                `The SXM Rentals ${social.name} account has not been created. This will link to it once it has.`,
              )
            }
          >
            <BrandIcon name={social.brand} size={18} />
          </button>
        ),
      )}
    </div>
  );
}

export default FooterSocial;
