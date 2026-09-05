// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The index of all nineteen policy documents, grouped the
// way the Overview document groups them — rules about the platform, rules about
// a rental, and rules for the businesses listing cars.
//
// THIS IS BUILT ON THE SERVER so that every policy can be found by a search
// engine and read without an account. That matters more than it sounds: this
// platform takes payments, holds deposits, handles identity documents and
// operates across two legal jurisdictions, and rules nobody can find are rules
// nobody agreed to.

import React from 'react';
import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Link from 'next/link';
import { legalDocuments, legalTierLabels } from '@/lib/mock/legal';
import type { LegalDocument } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon, Text } from '@/components/ui';
import styles from './legal.module.css';

export const metadata: Metadata = {
  alternates: canonical('/legal'),
  title: 'Legal and Policies',
  description:
    'Every SXM Rentals policy — terms of service, privacy, cancellations and refunds, security deposits, rental agreements, and the terms rental businesses sign up to.',
};

const TIERS: LegalDocument['tier'][] = ['platform', 'rental', 'provider'];

// A line under each group heading saying who it actually applies to.
const TIER_BLURB: Record<LegalDocument['tier'], string> = {
  platform: 'The rules of using SXM Rentals at all, whichever side of it you are on.',
  rental: 'What applies once a car is actually booked — the money, the damage, the driving.',
  provider: 'What a rental business agrees to when it lists vehicles here.',
};

export default function LegalIndexPage() {
  return (
    <div className="container">
      <PageHeader
        titleKey="legal.title"
        subtitleKey="legal.subtitle"
        crumbs={[
          { labelKey: 'web.nav.home', href: '/' },
          { labelKey: 'legal.title' },
        ]}
      />

      {/* Said before anything else, because a draft that reads like a finished
          policy is worse than no policy at all. */}
      <div className={styles.draftNotice}>
        <Icon name="information-circle-outline" size={20} color="var(--warning)" />
        <div>
          <Text variant="label" as="h2">
            These are drafts
          </Text>
          <Text variant="small" tone="ink2">
            The headings below are real — they are what each document has to cover. The
            wording underneath is placeholder text. A local attorney still has to write and
            approve the final versions, because this platform handles payments, identity
            documents and operates across two legal jurisdictions.
          </Text>
        </div>
      </div>

      <div className={styles.groups}>
        {TIERS.map((tier) => {
          const documents = legalDocuments.filter((document) => document.tier === tier);

          return (
            <section key={tier} className={styles.group}>
              <div className={styles.groupHead}>
                <Text variant="h3" as="h2">
                  {legalTierLabels[tier]}
                </Text>
                <Text variant="small" tone="ink2">
                  {TIER_BLURB[tier]}
                </Text>
              </div>

              <div className={styles.docGrid}>
                {documents.map((document) => (
                  <Link
                    key={document.slug}
                    href={`/legal/${document.slug}`}
                    className={styles.docCard}
                  >
                    <Icon name="document-outline" size={19} />
                    <span className={styles.docBody}>
                      <Text variant="label" as="h3">
                        {document.title}
                      </Text>
                      <Text variant="caption" tone="ink3" raw>
                        {`${document.sections.length} sections · ${document.updated}`}
                      </Text>
                    </span>
                    <Icon name="chevron-forward" size={17} />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
