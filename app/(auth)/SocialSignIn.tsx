'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The "Continue with Apple" and "Continue with Google"
// buttons on the sign-in and sign-up pages — shown, switched off, and marked
// "coming soon".
//
// WHY THEY ARE SHOWN AT ALL. The backend does not offer either yet ("they need
// developer-account keys"). Removing the buttons would be tidier, but they are
// where people look first, and somebody who normally signs in with Google
// deserves to see straight away that it is coming rather than conclude it is
// missing for good. What they must not do is pretend to work: before real
// accounts, both quietly signed everybody in as the same demo person.
//
// APPLE SITS ALONGSIDE GOOGLE, NOT BELOW IT. Apple's App Store rules require
// any app offering a third-party sign-in to offer Sign in with Apple just as
// prominently. The website is not bound by that, but the phone app is, and the
// two should look alike.

import React from 'react';
import { ComingSoonBadge, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import styles from './auth.module.css';

export function SocialSignIn() {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.actions}>
        <button type="button" className={styles.socialButton} disabled>
          <Icon name="logo-apple" size={20} />
          {t('authp.login.withApple')}
          <ComingSoonBadge label={t('common.comingSoon')} />
        </button>

        <button type="button" className={styles.socialButton} disabled>
          <Icon name="logo-google" size={19} />
          {t('authp.login.withGoogle')}
          <ComingSoonBadge label={t('common.comingSoon')} />
        </button>
      </div>

      <div className={styles.divider}>
        <Text variant="small" tone="ink3" as="span" raw>
          {t('auth.orDivider')}
        </Text>
      </div>
    </>
  );
}
