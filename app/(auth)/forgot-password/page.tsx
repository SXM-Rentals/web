'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Asking for a password reset link.
//
// IT GIVES THE SAME ANSWER WHETHER OR NOT THE ADDRESS IS REGISTERED. Saying "no
// account with that email" is helpful to the person who mistyped it, and equally
// helpful to somebody working through a list of addresses to find out which ones
// have accounts here. The wording below tells the honest user everything they
// need — check your inbox — without confirming anything to anyone else.

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Icon, Input, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [working, setWorking] = useState(false);

  if (sent) {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <span className={`${styles.statusIcon} ${styles.statusApproved}`}>
            <Icon name="mail-open-outline" size={34} />
          </span>
        </div>

        <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
          <Text variant="h1" as="h1" align="center" raw>
            {t('authp.reset.checkInbox')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {`If there is an account for ${email}, a link to set a new password is on its way. It is only valid for an hour.`}
          </Text>
        </div>

        <Card>
          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('authp.reset.spamNote')}
            </Text>
          </div>
        </Card>

        <div className={styles.actions}>
          <Button label={t('authp.reset.backToSignIn')} href="/login" fullWidth size="lg" />
          <Button
            label={t('authp.reset.differentAddress')}
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => setSent(false)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.reset.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.reset.subtitle')}
        </Text>
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          setWorking(true);
          window.setTimeout(() => {
            setWorking(false);
            setSent(true);
          }, 500);
        }}
      >
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          iconLeft="mail-outline"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Button
          label={t('authp.reset.send')}
          type="submit"
          fullWidth
          size="lg"
          loading={working}
          disabled={!email.trim()}
        />
      </form>

      <div className={styles.footNote}>
        <Link href="/login" className={styles.link}>
          <Text variant="small" as="span" tone="brand" raw>
            {t('authp.reset.backToSignIn')}
          </Text>
        </Link>
      </div>
    </>
  );
}
