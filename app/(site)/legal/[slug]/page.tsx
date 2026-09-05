// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One policy document — its sections, a contents list down
// the side, and a note saying the wording is still a draft.
//
// EVERY DOCUMENT IS BUILT ON THE SERVER AND HAS ITS OWN ADDRESS. That means a
// search engine can index it, it can be linked to directly from the point in the
// site where it matters, and it prints properly. A policy that only exists
// inside a pop-up is a policy nobody can cite.
//
// generateStaticParams below tells Next.js to build all nineteen pages ahead of
// time rather than on request, since the wording does not change between
// visitors.

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { legalDocuments, findLegalDocument, legalTierLabels } from '@/lib/mock/legal';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Icon, StatusPill, Text } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { canonical, jsonLdLegalDocument, jsonLdBreadcrumbs } from '@/lib/seo';
import styles from '../legal.module.css';
import { T } from '@/components/i18n/T';

type PageProps = { params: Promise<{ slug: string }> };

// Builds all nineteen pages at once, ahead of any visitor asking for one.
export function generateStaticParams() {
  return legalDocuments.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) return { title: 'Policy not found' };

  return {
    alternates: canonical(`/legal/${document.slug}`),
    title: document.title,
    description: `The SXM Rentals ${document.title}, covering ${document.sections
      .slice(0, 3)
      .map((section) => section.heading.toLowerCase())
      .join(', ')} and more.`,
  };
}

// Turns a heading into something usable as an address anchor, so the contents
// links on the right can jump to a section.
function anchorFor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) notFound();

  return (
    <div className="container">
      {/* Read by search engines only. People search for these documents by name
          — "SXM Rentals deposit policy" — before they book, so each one is
          described with its title and the date it was last changed. */}
      <JsonLd
        data={[
          jsonLdLegalDocument(document),
          jsonLdBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Legal', href: '/legal' },
            { label: document.title },
          ]),
        ]}
      />

      <PageHeader
        title={document.title}
        crumbs={[
          { labelKey: 'web.nav.home', href: '/' },
          { labelKey: 'legal.title', href: '/legal' },
          { label: document.title },
        ]}
        actions={
          <Button
            label="All policies"
            href="/legal"
            variant="outline"
            size="sm"
            iconLeft={<Icon name="chevron-back" size={16} />}
          />
        }
      />

      <div className={styles.documentLayout}>
        <article className={styles.document}>
          <div className={styles.meta}>
            <StatusPill label={legalTierLabels[document.tier].toUpperCase()} tone="neutral" />
            <Text variant="small" tone="ink3" as="span" raw>
              {`Last updated: ${document.updated}`}
            </Text>
          </div>

          <div className={styles.draftNotice} style={{ marginBottom: 0 }}>
            <Icon name="information-circle-outline" size={19} color="var(--warning)" />
            <div>
              <Text variant="label" as="h2">
                <T k="legal.draftTitle" />
              </Text>
              <Text variant="small" tone="ink2">
                The headings below are settled — they are what this document has to cover.
                The text under each one has not been written yet, and will be drafted and
                reviewed by a local attorney before launch.
              </Text>
            </div>
          </div>

          {document.sections.map((section, index) => (
            <section
              key={section.heading}
              id={anchorFor(section.heading)}
              className={styles.section}
            >
              <Text variant="h3" as="h2" raw>
                {`${index + 1}. ${section.heading}`}
              </Text>
              <Text variant="body" tone="ink2">
                {section.body}
              </Text>
            </section>
          ))}
        </article>

        {/* ---- CONTENTS ----
            A document with a dozen sections is hard to use without one. Real
            links to real anchors, so a specific clause can be sent to someone. */}
        <nav className={styles.contents} aria-label="Sections of this document">
          <Text variant="caption" tone="ink3" as="p">
            <T k="legal.onThisPage" />
          </Text>

          {document.sections.map((section, index) => (
            <a
              key={section.heading}
              href={`#${anchorFor(section.heading)}`}
              className={styles.contentsLink}
            >
              {`${index + 1}. ${section.heading}`}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
