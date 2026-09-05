// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The numbers and charts on the business side — the
// headline tiles, the ranked bars showing which car earns most, percentage bars
// for occupancy, and the split showing what a customer paid against what the
// business actually receives.
//
// THE CHARTS ARE PLAIN BLOCKS SIZED BY PERCENTAGE. No charting library, on
// purpose — see the note at the top of Stats.module.css.
//
// THE RULE THE EARNINGS SPLIT HOLDS: every money figure shown to a business is
// their own share, after commission, with the deduction visible rather than
// hidden. All three numbers are always shown together — what customers paid,
// what SXM Rentals took, and what the business receives — because a business
// that cannot see the deduction has no way to check it.

import React from 'react';
import { cx, clamp } from '@/lib/utils';
import { money } from '@/lib/format';
import { Icon, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import styles from './Stats.module.css';

// ---- A HEADLINE NUMBER ----
export function StatTile({
  label,
  value,
  icon,
  // A short line underneath saying what the number means.
  note,
  // Colours that line, for something that is going up or going wrong.
  noteTone = 'ink3',
}: {
  label: string;
  value: string;
  icon?: IconName;
  note?: string;
  noteTone?: 'ink3' | 'success' | 'warning' | 'danger';
}) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileHead}>
        {icon ? <Icon name={icon} size={16} /> : null}
        <Text variant="caption" tone="ink3" as="span">
          {label}
        </Text>
      </div>

      <Text variant="h2" as="p" className={styles.tileValue} raw>
        {value}
      </Text>

      {note ? (
        <span className={styles.tileNote}>
          <Text variant="small" tone={noteTone} as="span">
            {note}
          </Text>
        </span>
      ) : null}
    </div>
  );
}

// ---- RANKED BARS ----
// Which vehicle earns most, in order. Each bar is sized against the biggest
// value rather than against a fixed maximum, so the differences stay readable
// whatever the actual amounts are.
export function RankedBar({
  items,
  // How to write each value out — money by default, but occupancy and booking
  // counts use their own wording.
  format = (value: number) => money(value),
}: {
  items: { label: string; value: number; sublabel?: string }[];
  format?: (value: number) => string;
}) {
  const highest = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className={styles.ranked}>
      {items.map((item) => (
        <div key={item.label} className={styles.rankedRow}>
          <div className={styles.rankedHead}>
            <Text variant="small" as="span" className={styles.rankedLabel} raw>
              {item.label}
            </Text>
            <Text variant="label" as="span" className={styles.rankedValue} raw>
              {format(item.value)}
            </Text>
          </div>

          <span className={styles.track} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ width: `${clamp((item.value / highest) * 100, 0, 100)}%` }}
            />
          </span>

          {item.sublabel ? (
            <Text variant="caption" tone="ink3" raw>
              {item.sublabel}
            </Text>
          ) : null}
        </div>
      ))}
    </div>
  );
}

// ---- A PERCENTAGE BAR ----
// Used for occupancy and for how many enquiries turned into bookings.
export function PercentBar({
  label,
  // Between 0 and 1.
  value,
  tone = 'primary',
  note,
}: {
  label: string;
  value: number;
  tone?: 'primary' | 'brand' | 'success' | 'warning';
  note?: string;
}) {
  const percent = clamp(value * 100, 0, 100);

  return (
    <div className={styles.percent}>
      <div className={styles.percentHead}>
        <Text variant="small" tone="ink2" as="span">
          {label}
        </Text>
        <Text variant="label" as="span" raw>
          {`${Math.round(percent)}%`}
        </Text>
      </div>

      <span className={styles.track} aria-hidden="true">
        <span
          className={cx(
            styles.fill,
            tone === 'brand' && styles.fillBrand,
            tone === 'success' && styles.fillSuccess,
            tone === 'warning' && styles.fillWarning,
          )}
          style={{ width: `${percent}%` }}
        />
      </span>

      {note ? (
        <Text variant="caption" tone="ink3" raw>
          {note}
        </Text>
      ) : null}
    </div>
  );
}

// ---- THE EARNINGS SPLIT ----
// All three numbers, always together. This is the component that makes the
// commission visible rather than something a business has to work out.
export function EarningsSplit({
  gross,
  commission,
  net,
  title = 'How this breaks down',
}: {
  // What customers paid in total, before anything was taken.
  gross: number;
  // What SXM Rentals took.
  commission: number;
  // What the business actually receives.
  net: number;
  title?: string;
}) {
  const yoursShare = gross > 0 ? clamp((net / gross) * 100, 0, 100) : 0;
  const commissionShare = gross > 0 ? clamp((commission / gross) * 100, 0, 100) : 0;

  return (
    <div className={styles.split}>
      <Text variant="label" as="h3">
        {title}
      </Text>

      {/* One bar in two parts, so the size of the deduction is visible at a
          glance rather than only readable as a number. */}
      <span className={styles.splitBar} aria-hidden="true">
        <span className={styles.splitYours} style={{ width: `${yoursShare}%` }} />
        <span className={styles.splitCommission} style={{ width: `${commissionShare}%` }} />
      </span>

      <div className={styles.splitRows}>
        <div className={styles.splitRow}>
          <span className={styles.splitLabel}>
            <span className={styles.swatch} style={{ background: 'var(--tile)' }} />
            <Text variant="small" tone="ink2" as="span">
              Customers paid
            </Text>
          </span>
          <Text variant="small" as="span" className={styles.numeric} raw>
            {money(gross)}
          </Text>
        </div>

        <div className={styles.splitRow}>
          <span className={styles.splitLabel}>
            <span className={styles.swatch} style={{ background: 'var(--ink3)' }} />
            <Text variant="small" tone="ink2" as="span">
              SXM Rentals commission
            </Text>
          </span>
          <Text variant="small" as="span" className={styles.numeric} raw>
            {`− ${money(commission)}`}
          </Text>
        </div>

        <div className={styles.splitTotal}>
          <span className={styles.splitLabel}>
            <span className={styles.swatch} style={{ background: 'var(--success)' }} />
            <Text variant="label" as="span">
              You receive
            </Text>
          </span>
          <Text variant="label" as="span" className={styles.numeric} raw>
            {money(net)}
          </Text>
        </div>
      </div>
    </div>
  );
}
