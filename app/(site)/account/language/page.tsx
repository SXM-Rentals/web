'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Choosing which of the four languages the site is shown in
// — English, Dutch, French or Spanish.
//
// WHY THESE FOUR: Dutch and French are the two official languages of the two
// halves of the island, so a resident of either side can use the site in their
// own. Spanish covers a large part of both the resident population and the
// visitors arriving from elsewhere in the Caribbean.
//
// ENGLISH IS COMPLETE; THE OTHER THREE ARE PARTLY DONE. Anything not yet
// translated falls back to English rather than showing a blank space, which is
// why switching language never leaves an empty screen.

import React from 'react';
import { useTranslation, languageOptions } from '@/lib/i18n';
import { Card, Icon, ListRow, Text } from '@/components/ui';
import styles from '../account.module.css';

export default function LanguagePage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('profile.language')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.lang.subtitle')}
        </Text>
      </div>

      <Card padded={false}>
        {languageOptions.map((option) => (
          <ListRow
            key={option.code}
            // The name is written in the language itself — a Dutch speaker looks
            // for "Nederlands", not "Dutch" — with the English name underneath
            // so it can still be found by someone who does not read it.
            title={option.label}
            subtitle={option.english}
            onClick={() => setLanguage(option.code)}
            trailing={
              option.code === language ? (
                <Icon name="checkmark" size={20} color="var(--brand)" label={t('acct.lang.selected')} />
              ) : null
            }
          />
        ))}
      </Card>

      <div className={styles.note}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3">
          English is complete. Dutch, French and Spanish are still being translated —
          anything not yet done falls back to English, so nothing ever appears blank.
        </Text>
      </div>

      <div className={styles.note}>
        <Icon name="globe-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3" raw>
          {t('acct.lang.rememberedNote')}
        </Text>
      </div>
    </div>
  );
}
