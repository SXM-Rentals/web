'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The rewards scheme — points, the tier ladder, and
// Islander status.
//
// THIS IS SHOWN AS A LOCKED PREVIEW, not as something working. The scheme is not
// live, so the page says so at the top and nothing here can be spent. Showing a
// points balance that cannot be used, without saying it is coming, is how people
// end up feeling cheated by a feature that was never launched.
//
// THE ONE THING THIS PAGE MUST KEEP SEPARATE: Islander status and loyalty tiers
// are different ideas and are drawn as different things. Islander means somebody
// is a verified resident of Sint Maarten or Saint-Martin. It is a residency flag
// — it cannot be earned by spending, and no amount of renting will produce it.
// Tiers are the opposite: earned entirely through points. Blurring the two would
// make residency look purchasable, which is exactly the wrong message on an
// island where residents are the year-round market.

import React from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { tierLadder, earningRules, exampleBenefits } from '@/lib/mock/rewards';
import { longDate } from '@/lib/format';
import { cx, clamp } from '@/lib/utils';
import {
  Card,
  ComingSoonBadge,
  ErrorState,
  Icon,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function RewardsPage() {
  const { t } = useTranslation();
  const { data: rewards, loading, error, refresh } = useAsyncData(
    () => apiClient.getRewards(),
    [],
  );

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="35%" />
        <Skeleton height={200} radius="var(--radius-lg)" />
        <Skeleton height={160} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!rewards) return <ErrorState onRetry={refresh} />;

  // How far through the current tier, as a percentage for the bar.
  const currentIndex = tierLadder.findIndex((tier) => tier.tier === rewards.tier);
  const nextTier = tierLadder[currentIndex + 1];
  const progress = nextTier
    ? clamp(
        ((rewards.points - tierLadder[currentIndex].pointsRequired) /
          (nextTier.pointsRequired - tierLadder[currentIndex].pointsRequired)) *
          100,
        0,
        100,
      )
    : 100;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('rewards.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('acct.rewards.subtitle')}
          </Text>
        </div>
        <ComingSoonBadge />
      </div>

      {/* ---- SAID PLAINLY, AT THE TOP ---- */}
      <Card>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="information-circle-outline" size={16} color="var(--warning)" />
          <Text variant="small" tone="ink2" raw>
            {t('acct.rewards.notLive')}
          </Text>
        </div>
      </Card>

      {/* ---- POINTS AND TIER ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.rewards.yourPoints')}
        </Text>

        <Text variant="display" as="p" raw>
          {rewards.points.toLocaleString()}
        </Text>

        <Text variant="small" tone="ink2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {nextTier
            ? `${rewards.pointsToNextTier.toLocaleString()} more to reach ${
                tierLadder[currentIndex + 1].label
              }`
            : 'You are at the top tier'}
        </Text>

        {/* A plain block sized by percentage. No charting library anywhere. */}
        <div className={styles.progressTrack}>
          <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </Card>

      {/* ---- THE TIER LADDER ---- */}
      <div>
        <Text variant="h3" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.rewards.theTiers')}
        </Text>

        <div className={styles.tierLadder}>
          {tierLadder.map((tier) => {
            const isCurrent = tier.tier === rewards.tier;

            return (
              <div
                key={tier.tier}
                className={cx(styles.tierCard, isCurrent && styles.tierCurrent)}
              >
                <Text variant="label" as="h3">
                  {tier.label}
                </Text>
                <Text variant="small" tone="ink2" raw>
                  {tier.pointsRequired === 0
                    ? 'Where everyone starts'
                    : `${tier.pointsRequired.toLocaleString()} points`}
                </Text>
                {isCurrent ? <StatusPill label={t('acct.rewards.youAreHere')} tone="brand" /> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- ISLANDER, KEPT VISIBLY SEPARATE ---- */}
      <Card padded>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <Icon name="location" size={20} color="var(--brand)" />
          <Text variant="label" as="h2" raw>
            {t('acct.rewards.islanderTitle')}
          </Text>
          {rewards.isIslander ? (
            <StatusPill label={t('rewards.islander')} tone="brand" />
          ) : null}
        </div>

        <Text variant="body" tone="ink2" raw>
          {t('acct.rewards.islanderNote')}
          <strong> not a tier and cannot be earned by renting</strong> — it recognises
          living here, and it sits alongside the ladder above rather than on it.
        </Text>

        {!rewards.isIslander ? (
          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('acct.rewards.touristNote')}
            </Text>
          </div>
        ) : null}
      </Card>

      {/* ---- HOW POINTS ARE EARNED ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-sm)' }} raw>
          {t('acct.rewards.howEarned')}
        </Text>

        <div className={styles.rulesTable}>
          {earningRules.map((rule) => (
            <div key={rule.label} className={styles.ruleRow}>
              <Text variant="body" tone="ink2" as="span">
                {rule.label}
              </Text>
              <Text variant="label" as="span" raw>
                {rule.points}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      {/* ---- WHAT POINTS MIGHT BUY ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.rewards.couldInclude')}
        </Text>

        <div className={styles.benefits}>
          {exampleBenefits.map((benefit) => (
            <span key={benefit} className={styles.benefit}>
              <Icon name="checkmark" size={16} color="var(--ink3)" />
              <Text variant="small" tone="ink2" as="span">
                {benefit}
              </Text>
            </span>
          ))}
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('acct.rewards.examplesNote')}
          </Text>
        </div>
      </Card>

      {/* ---- WHERE THE POINTS CAME FROM ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-sm)' }} raw>
          {t('acct.rewards.soFar')}
        </Text>

        <div className={styles.rulesTable}>
          {rewards.history.map((entry) => (
            <div key={entry.id} className={styles.ruleRow}>
              <div>
                <Text variant="body" tone="ink2" as="span" raw>
                  {entry.label}
                </Text>
                <Text variant="caption" tone="ink3" raw>
                  {longDate(entry.date)}
                </Text>
              </div>
              <Text variant="label" as="span" tone="success" raw>
                {`+${entry.points}`}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
