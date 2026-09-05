'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Asking whether somebody lives on the island or is
// visiting.
//
// WHY THE PLATFORM ASKS AT ALL: the two need different documents. A visitor
// proves who they are with a passport; a resident does it with a local ID or a
// residency document, and asking a resident for a passport they may not carry —
// or a tourist for a residency document they cannot possibly have — is how an
// identity check fails for no good reason.
//
// IT ALSO DECIDES ISLANDER STATUS, which is a residency flag and not a reward.
// It cannot be earned by renting, and the page says so, because a choice that
// quietly unlocks a perk is a choice people will make dishonestly.

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { cx } from '@/lib/utils';
import { Button, Card, Icon, Text } from '@/components/ui';
import type { AccountType } from '@/types';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

const CHOICES: {
  type: AccountType;
  title: string;
  blurb: string;
  icon: 'location' | 'boat-outline';
  documents: string[];
}[] = [
  {
    type: 'local',
    title: 'I live here',
    blurb: 'A resident of Sint Maarten or Saint-Martin, either side of the island.',
    icon: 'location',
    documents: [
      "Your driver's licence",
      'A local ID or residency document',
      'A photo of you, to match against it',
    ],
  },
  {
    type: 'tourist',
    title: 'I am visiting',
    blurb: 'Here on holiday or for work, and driving while you are on the island.',
    icon: 'boat-outline',
    documents: [
      "Your driver's licence",
      'Your passport',
      'A photo of you, to match against it',
    ],
  },
];

function AccountTypeChooser() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { setAccountType } = useSession();

  const [chosen, setChosen] = useState<AccountType | null>(null);
  const next = params.get('next') ?? '/account';

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.type.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.type.subtitle')}
        </Text>
      </div>

      <div className={styles.choiceGrid}>
        {CHOICES.map((choice) => {
          const selected = chosen === choice.type;

          return (
            <button
              key={choice.type}
              type="button"
              className={cx(styles.choice, selected && styles.choiceSelected)}
              onClick={() => setChosen(choice.type)}
              aria-pressed={selected}
            >
              <span className={styles.choiceIcon}>
                <Icon name={choice.icon} size={22} />
              </span>

              <Text variant="h3" as="h2">
                {choice.title}
              </Text>
              <Text variant="small" tone="ink2" as="span">
                {choice.blurb}
              </Text>

              <span className={styles.choiceList}>
                <Text variant="caption" tone="ink3" as="span" raw>
                  {t('authp.type.whatWeAsk')}
                </Text>
                {choice.documents.map((document) => (
                  <span key={document} className={styles.choiceListItem}>
                    <Icon name="checkmark" size={14} color="var(--ink3)" />
                    <Text variant="small" tone="ink2" as="span">
                      {document}
                    </Text>
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        label={t('common.continue')}
        fullWidth
        size="lg"
        disabled={!chosen}
        onClick={() => {
          if (!chosen) return;
          setAccountType(chosen);
          router.push(`/verify-status?next=${encodeURIComponent(next)}`);
        }}
      />

      <Card>
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.type.islanderNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}

export default function AccountTypePage() {
  return (
    <Suspense fallback={null}>
      <AccountTypeChooser />
    </Suspense>
  );
}
