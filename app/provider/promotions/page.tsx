// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Where a rental business would run its own discount codes,
// on top of any the platform runs.
//
// IT IS NOT BUILT YET, and this page says so rather than showing an empty table
// that looks broken. It also explains the one thing that has to be settled
// before it can be: whose margin a discount comes out of. A code that quietly
// reduces the platform's commission as well as the business's own share is a
// different product from one that only reduces the business's take, and the two
// need different arithmetic on every payout. Building the screen before that is
// decided would mean building it twice.

import React from 'react';
import type { Metadata } from 'next';
import { Card, ComingSoon, Icon, Text } from '@/components/ui';
import styles from '../provider.module.css';
import { T } from '@/components/i18n/T';
import type { TranslationKey } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Promotions',
};

const OPEN_QUESTIONS = [
  {
    title: 'pp.promo.marginTitle',
    body: 'If you offer 20% off, does SXM Rentals take its commission on the original price or the discounted one? The answer changes what a promotion actually costs you, and it has to be the same on every payout line.',
  },
  {
    title: 'pp.promo.stackTitle',
    body: 'Two codes on one booking can easily add up to more than the margin on it. Either they cannot combine, or there is a floor below which a booking is refused.',
  },
  {
    title: 'pp.promo.pointsTitle',
    body: 'Points are earned on what a customer spends. A heavily discounted rental that still earns full points makes the rewards scheme cost more than it returns.',
  },
];

export default function ProviderPromotionsPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1">
            Promotions
          </Text>
          <Text variant="body" tone="ink2">
            Your own discount codes, alongside any SXM Rentals runs.
          </Text>
        </div>
      </div>

      <ComingSoon
        title="Promotions are not built yet"
        body="When they are, you will be able to create codes for your own vehicles — a percentage or a fixed amount off, limited by date, by vehicle, or by how many times they can be used."
        icon="gift-outline"
      />

      {/* ---- WHY IT IS NOT BUILT ----
          Being specific about what is unresolved is more useful than "coming
          soon" on its own, and it is a genuine question for the business too. */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }}>
          What has to be decided first
        </Text>

        <Text variant="small" tone="ink2" style={{ marginBottom: 'var(--space-lg)' }}>
          Discounts are easy to display and difficult to account for. These three questions
          change how every payout line is calculated, so they are being settled before the
          screen is built rather than after.
        </Text>

        <div className={styles.stack}>
          {OPEN_QUESTIONS.map((question) => (
            <div key={question.title} className={styles.note} style={{ marginTop: 0 }}>
              <Icon name="help-circle-outline" size={17} color="var(--ink2)" />
              <div>
                <Text variant="label" as="h3">
                  <T k={question.title as TranslationKey} />
                </Text>
                <Text variant="small" tone="ink2">
                  {question.body}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padded>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="bulb-outline" size={17} color="var(--warning)" />
          <div>
            <Text variant="label" as="h2">
              In the meantime
            </Text>
            <Text variant="small" tone="ink2">
              A lower daily rate on a vehicle that is sitting unused does the same job as a
              discount code and takes effect immediately. The performance page shows which
              of your vehicles are out least often.
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}
