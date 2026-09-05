// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The footer at the bottom of every customer page. It
// carries all nineteen policy documents, the two ways to sign up (as a customer
// or as a rental business), and how to get in touch.
//
// WHY ALL NINETEEN ARE LISTED RATHER THAN A "LEGAL" LINK: this platform takes
// payments, holds deposits, handles identity documents and operates across two
// legal jurisdictions. The rules people are agreeing to should be readable
// without hunting, and every one of them needs to be reachable by a search
// engine, which means each having its own real address on the site.
//
// This is a server component: it has no buttons and nothing changes, so there is
// no reason to send any code to the browser for it.

import React from 'react';
import Link from 'next/link';
import { legalDocuments, legalTierLabels } from '@/lib/mock/legal';
import type { LegalDocument } from '@/types';
import { Logo, Text } from '@/components/ui';
import { FooterSocial } from './FooterSocial';
import styles from './Footer.module.css';
import { T } from '@/components/i18n/T';
import type { TranslationKey } from '@/lib/i18n';

// The three groups the Overview document describes: rules about the platform
// itself, rules about a rental, and rules for the businesses listing cars.
const TIERS: LegalDocument['tier'][] = ['platform', 'rental', 'provider'];

export function Footer() {
  return (
    <footer className={styles.footer} data-print="hide">
      <div className="container">
        <div className={styles.columns}>
          {/* ---- WHO WE ARE ---- */}
          <div className={styles.column}>
            <Logo size={26} decorative />
            <Text variant="small" tone="ink2" className={styles.about}>
              The vehicle rental platform built for both sides of the island. One account,
              one booking, whether you are collecting in Marigot or Philipsburg.
            </Text>

            {/* Somebody who has read to the bottom of the page is exactly who
                would follow, so the accounts are here rather than only behind
                the floating button on the homepage. */}
            <Text variant="caption" tone="ink3" as="p">
              <T k="footer.follow" />
            </Text>
            <FooterSocial />
          </div>

          {/* ---- RENTING ---- */}
          <div className={styles.column}>
            <Text variant="label" className={styles.columnTitle} raw>
              <T k="footer.rentingAVehicle" />
            </Text>
            <div className={styles.links}>
              <Link href="/search" className={styles.link}>
                <T k="web.nav.findCar" />
              </Link>
              <Link href="/account/rentals" className={styles.link}>
                <T k="web.nav.myRentals" />
              </Link>
              <Link href="/account/rewards" className={styles.link}>
                <T k="web.nav.rewards" />
              </Link>
              <Link href="/signup" className={styles.link}>
                <T k="footer.createAccount" />
              </Link>
              <Link href="/account/support" className={styles.link}>
                <T k="web.nav.support" />
              </Link>
            </div>
          </div>

          {/* ---- FOR RENTAL BUSINESSES ---- */}
          <div className={styles.column}>
            <Text variant="label" className={styles.columnTitle} raw>
              <T k="footer.forBusinesses" />
            </Text>
            <div className={styles.links}>
              <Link href="/provider/apply" className={styles.link}>
                <T k="web.nav.listVehicles" />
              </Link>
              <Link href="/provider" className={styles.link}>
                <T k="web.nav.businessDashboard" />
              </Link>
              <Link href="/provider/fleet/api" className={styles.link}>
                <T k="footer.connectSystem" />
              </Link>
              <Link href="/legal/provider-terms" className={styles.link}>
                <T k="footer.providerTerms" />
              </Link>
              <Link href="/legal/provider-commission" className={styles.link}>
                <T k="footer.commission" />
              </Link>
            </div>
          </div>

          {/* ---- ALL NINETEEN POLICY DOCUMENTS ---- */}
          <div className={styles.column}>
            <Text variant="label" className={styles.columnTitle} raw>
              <T k="footer.legalAndPolicies" />
            </Text>

            <div className={styles.legalGroups}>
              {TIERS.map((tier) => (
                <div key={tier} className={styles.legalGroup}>
                  {/* The group names are translated; the document titles
                      below them are not. A policy's title is part of the
                      document, and the documents are deliberately English —
                      the reasoning is at the top of lib/i18n/copy/legal.ts. */}
                  <Text variant="caption" tone="ink3" raw>
                    <T k={`legal.tier.${tier}` as TranslationKey} />
                  </Text>

                  <div className={styles.legalLinks}>
                    {legalDocuments
                      .filter((document) => document.tier === tier)
                      .map((document) => (
                        <Link
                          key={document.slug}
                          href={`/legal/${document.slug}`}
                          className={styles.link}
                        >
                          {document.title}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- THE BOTTOM LINE ---- */}
        <div className={styles.base}>
          <Text variant="small" tone="ink3" as="span">
            {`© ${new Date().getFullYear()} SXM Rentals. Sint Maarten / Saint-Martin.`}
          </Text>

          <span className={styles.baseSpacer} />

          <Text variant="small" tone="ink3" as="span">
            <T k="footer.demoNotice" />
          </Text>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
