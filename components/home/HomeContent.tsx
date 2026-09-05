'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Everything visible on the homepage — the hero, the two
// how-it-works sequences, the browse preview, the three reasons, the rewards
// panel and the closing.
//
// WHY IT IS SPLIT OUT OF THE PAGE ITSELF, and this is the important part:
//
// The homepage has to be built on the server. That is most of why this website
// exists alongside the phone app — a search engine reads finished HTML, and an
// app cannot appear in a search result at all. But reading the chosen language
// means reading the browser's stored setting, and the server has no browser to
// ask. The two requirements pull in opposite directions.
//
// The split resolves it. app/(site)/page.tsx stays a server component and keeps
// the things a search engine needs: the title, the description, the structured
// description of the business. This file is marked "use client" and holds the
// words. Next.js still renders it to HTML on the server, so the crawler gets a
// complete page; the browser then hydrates it and swaps the words to whichever
// language the reader has chosen.
//
// WHAT THAT MEANS IN PRACTICE: the HTML a search engine sees is English, which
// matches the canonical address, which is correct. A Dutch-speaking visitor sees
// Dutch. What it does NOT give you is a Dutch page in Dutch search results —
// that needs separate addresses per language (/nl/, /fr/) and is a larger piece
// of work. See the README.

import React from 'react';
import { Button, Icon, Text } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { VehicleTypeCards } from '@/components/vehicle/VehicleTypes';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import type { Vehicle } from '@/types';
import styles from '@/app/(site)/home.module.css';

// ---- THE TWO SEQUENCES ----
// Keys rather than words, but written out here rather than inline below so the
// two still read as the deliberate mirror image of each other that they are.
const CUSTOMER_STEPS = [1, 2, 3, 4].map((n) => ({
  title: `home.renting.step${n}.title` as TranslationKey,
  body: `home.renting.step${n}.body` as TranslationKey,
}));

const BUSINESS_STEPS = [1, 2, 3, 4].map((n) => ({
  title: `home.listing.step${n}.title` as TranslationKey,
  body: `home.listing.step${n}.body` as TranslationKey,
}));

const PILLARS = [
  { icon: 'shield-checkmark-outline', key: 'one' },
  { icon: 'flash-outline', key: 'two' },
  { icon: 'people-outline', key: 'three' },
] as const;

export function HomeContent({ previewVehicles }: { previewVehicles: Vehicle[] }) {
  const { t } = useTranslation();

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            {/* The one h1 on the page. It says what this is and where, because
                somebody arriving from a search result has no other context. */}
            <Text variant="display" as="h1" raw>
              {t('home.hero.title')}
            </Text>

            <Text variant="bodyLg" tone="ink2" className={styles.heroLede} raw>
              {t('home.hero.lede')}
            </Text>

            <div className={styles.heroActions}>
              <Button
                label={t('home.hero.rentCta')}
                href="/search"
                size="lg"
                iconRight={<Icon name="arrow-forward" size={18} />}
              />
              <Button
                label={t('home.hero.listCta')}
                href="/provider/apply"
                variant="outline"
                size="lg"
              />
            </div>

            {/* The three things somebody wants to know before clicking. */}
            <div className={styles.heroNotes}>
              {(['Browse', 'Deposit', 'Sides'] as const).map((note, index) => (
                <span key={note} className={styles.heroNote}>
                  <Icon
                    name={
                      ['checkmark-circle-outline', 'shield-outline', 'location-outline'][
                        index
                      ] as 'shield-outline'
                    }
                    size={16}
                  />
                  <Text variant="small" tone="ink2" as="span" raw>
                    {t(`home.hero.note${note}` as TranslationKey)}
                  </Text>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS — RENTING ==================== */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <Text variant="h1" as="h2" raw>
            {t('home.renting.title')}
          </Text>
          <Text variant="bodyLg" tone="ink2" raw>
            {t('home.renting.lede')}
          </Text>
        </div>

        <ol className={styles.steps}>
          {CUSTOMER_STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <Text variant="h3" as="h3" raw>
                {t(step.title)}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {t(step.body)}
              </Text>
            </li>
          ))}
        </ol>
      </section>

      {/* ==================== BROWSE PREVIEW ==================== */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <Text variant="h1" as="h2" raw>
            {t('home.browse.title')}
          </Text>
          <Text variant="bodyLg" tone="ink2" raw>
            {t('home.browse.lede')}
          </Text>
        </div>

        <VehicleTypeCards className={styles.types} />

        <div className={styles.previewHead}>
          <Text variant="h2" as="h3" raw>
            {t('home.browse.available')}
          </Text>
          <Button
            label={t('home.browse.seeAll')}
            href="/search"
            variant="outline"
            size="sm"
          />
        </div>

        <div className={styles.cars}>
          {previewVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* ==================== WHY SXM RENTALS ==================== */}
      <section className={`container ${styles.section}`}>
        <div className={`${styles.sectionHead} ${styles.centered}`}>
          <Text variant="h1" as="h2" align="center" raw>
            {t('home.why.title')}
          </Text>
          <Text variant="bodyLg" tone="ink2" align="center" raw>
            {t('home.why.lede')}
          </Text>
        </div>

        <div className={styles.pillars}>
          {PILLARS.map((pillar) => (
            <div key={pillar.key} className={styles.pillar}>
              <span className={styles.pillarIcon}>
                <Icon name={pillar.icon} size={22} />
              </span>
              <Text variant="h3" as="h3" raw>
                {t(`home.why.${pillar.key}.title` as TranslationKey)}
              </Text>
              <Text variant="small" tone="ink2" raw>
                {t(`home.why.${pillar.key}.body` as TranslationKey)}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== HOW IT WORKS — LISTING ==================== */}
      <section className={styles.tintedBand}>
        <div className={`container ${styles.section}`}>
          <div className={styles.sectionHead}>
            <Text variant="h1" as="h2" raw>
              {t('home.listing.title')}
            </Text>
            <Text variant="bodyLg" tone="ink2" raw>
              {t('home.listing.lede')}
            </Text>
          </div>

          <ol className={styles.steps}>
            {BUSINESS_STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <Text variant="h3" as="h3" raw>
                  {t(step.title)}
                </Text>
                <Text variant="small" tone="ink2" raw>
                  {t(step.body)}
                </Text>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== REWARDS TEASER ==================== */}
      <section className={`container ${styles.section}`}>
        {/* Deliberately a plain panel rather than a Card — see the note in
            home.module.css. A Card would fight this block for the background
            colour and win, leaving the text the same colour as the panel. */}
        <div className={styles.rewards}>
          <div className={styles.rewardsCopy}>
            <Text variant="h2" as="h2" className={styles.rewardsTitle} raw>
              {t('home.rewards.title')}
            </Text>
            <Text variant="body" className={styles.rewardsBody} raw>
              {t('home.rewards.body')}
            </Text>

            {/* The tier names are not translated: they are the names of the
                tiers, the same way a brand name is. */}
            <div className={styles.tierLadder} aria-hidden="true">
              {['Explorer', 'Traveler', 'VIP', 'Elite'].map((tier) => (
                <span key={tier} className={styles.tier}>
                  {tier}
                </span>
              ))}
            </div>
          </div>

          <Button
            label={t('home.rewards.cta')}
            href="/account/rewards"
            variant="secondary"
            size="md"
          />
        </div>
      </section>

      {/* ==================== THE CLOSING CALL TO ACTION ==================== */}
      <section className={`container ${styles.closing}`}>
        <Text variant="h1" as="h2" align="center" raw>
          {t('home.closing.title')}
        </Text>
        <Text variant="bodyLg" tone="ink2" align="center" raw>
          {t('home.closing.body')}
        </Text>

        <div className={styles.closingActions}>
          <Button label={t('web.nav.findCar')} href="/search" size="lg" />
          <Button
            label={t('home.hero.listCta')}
            href="/provider/apply"
            variant="outline"
            size="lg"
          />
        </div>
      </section>
    </>
  );
}

export default HomeContent;
