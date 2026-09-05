'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Shows what a rental costs, broken into its parts — the
// rental itself, any delivery charge, the service fee, and what is payable
// today.
//
// THE ONE RULE THAT MATTERS HERE: the security deposit is shown on its own line,
// BELOW the total, clearly separated and labelled as held rather than charged.
// It is never added into the total. Mixing it in would make every rental look
// far more expensive than it is, and would misrepresent money that is only being
// set aside and given back.
//
// The total below is computed from the price lines and nothing else. If you are
// changing this file, that sum is the line to leave alone: adding the deposit to
// it is not a styling change, it is a product bug, and it would also quietly
// misstate what the customer is agreeing to pay.

import React from 'react';
import { Card, Divider, Icon, Text } from '@/components/ui';
import { money } from '@/lib/format';
import type { PriceLine } from '@/types';
import styles from './PriceBreakdown.module.css';
import { useTranslation } from '@/lib/i18n';

export function PriceBreakdown({
  lines,
  depositAmount,
  // Shown when the deposit has already been placed on the customer's card.
  depositHeld = false,
  title = 'Price breakdown',
}: {
  lines: PriceLine[];
  depositAmount: number;
  depositHeld?: boolean;
  title?: string;
}) {
  const { t } = useTranslation();

  // The total is the sum of the lines above — deliberately NOT including the
  // deposit.
  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return (
    <Card data-print="keep">
      <Text variant="label" as="h3" style={{ marginBottom: 'var(--space-lg)' }}>
        {title}
      </Text>

      {/* ---- THE PRICE BREAKDOWN ROWS ---- */}
      {lines.map((line) => (
        <div key={line.label} className={styles.line}>
          <span className={styles.lineBody}>
            <Text variant="body" tone="ink2" as="span" raw>
              {line.label}
            </Text>
            {line.note ? (
              <Text variant="small" tone="ink3" as="span" raw>
                {line.note}
              </Text>
            ) : null}
          </span>

          <Text variant="body" as="span" raw>
            {money(line.amount)}
          </Text>
        </div>
      ))}

      <Divider className={styles.divider} />

      {/* ---- THE AMOUNT ACTUALLY BEING CHARGED ---- */}
      <div className={styles.total}>
        <Text variant="h3" as="span" raw>
          {t('booking.dueToday')}
        </Text>
        <Text variant="h3" as="span" raw>
          {money(total)}
        </Text>
      </div>

      {/* ---- THE SECURITY DEPOSIT, KEPT SEPARATE ----
          Below the total, in its own tinted box, so it can never be read as part
          of what is being charged. */}
      {depositAmount > 0 ? (
        <div className={styles.deposit}>
          <div className={styles.depositHead}>
            <span className={styles.depositLabel}>
              <Icon name="shield-outline" size={16} color="var(--ink2)" />
              <Text variant="body" tone="ink2" as="span">
                {t('vehicle.depositLabel')}
              </Text>
            </span>

            <Text variant="body" tone="ink2" as="span" raw>
              {money(depositAmount)}
            </Text>
          </div>

          <Text variant="small" tone="ink3" className={styles.depositNote}>
            {depositHeld
              ? 'Currently held on your card. Released after the car is returned.'
              : 'Held on your card just before pickup and released when you return the car. Not included in the total above.'}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}

export default PriceBreakdown;
