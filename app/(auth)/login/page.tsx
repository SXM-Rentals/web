'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Signing in — by email and password, or with Apple or
// Google.
//
// IT REMEMBERS WHERE SOMEONE WAS GOING. Arriving here from a booking carries a
// "next" note in the address, and signing in sends them straight back to that
// booking rather than dropping them on the homepage to find their way again.
//
// APPLE SITS ALONGSIDE GOOGLE, NOT BELOW IT. Apple's App Store rules require
// that any app offering a third-party sign-in also offers Sign in with Apple as
// an equally prominent option. The website does not have to follow App Store
// rules, but the two products should behave the same way, and it costs nothing.
//
// THIS IS A PRETEND SIGN-IN. No password is checked and any email works. Real
// sign-in is a backend job.

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { Button, Card, Icon, Input, PasswordInput, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, signInWithApple, signInWithGoogle } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);

  // Where to go afterwards. Defaults to the account if they came here directly.
  const next = params.get('next') ?? '/account';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    await signIn(email);
    router.push(next);
  };

  const withProvider = async (provider: 'apple' | 'google') => {
    setWorking(true);
    if (provider === 'apple') await signInWithApple();
    else await signInWithGoogle();
    router.push(next);
  };

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.login.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.login.subtitle')}
        </Text>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.socialButton}
          onClick={() => withProvider('apple')}
        >
          <Icon name="logo-apple" size={20} />
          {t('authp.login.withApple')}
        </button>

        <button
          type="button"
          className={styles.socialButton}
          onClick={() => withProvider('google')}
        >
          <Icon name="logo-google" size={19} />
          {t('authp.login.withGoogle')}
        </button>
      </div>

      <div className={styles.divider}>
        <Text variant="small" tone="ink3" as="span" raw>
          {t('auth.orDivider')}
        </Text>
      </div>

      {/* A real form, so pressing Enter submits it and password managers
          recognise it for what it is. */}
      <form className={styles.form} onSubmit={submit}>
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

        <PasswordInput
          label={t('auth.password')}
          autoComplete="current-password"
          iconLeft="lock-closed-outline"
          placeholder={t('authp.login.passwordPlaceholder')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button label={t('auth.signIn')} type="submit" fullWidth size="lg" loading={working} />
      </form>

      <div className={styles.footNote}>
        <Link href="/forgot-password" className={styles.link}>
          <Text variant="small" as="span" tone="brand" raw>
            {t('authp.login.forgotten')}
          </Text>
        </Link>
      </div>

      <Card>
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.login.demoNote')}
          </Text>
        </div>
      </Card>

      <div className={styles.footNote}>
        <Text variant="small" tone="ink2" as="span">
          New to SXM Rentals?{' '}
        </Text>
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className={styles.link}>
          <Text variant="small" as="span" tone="brand" raw>
            {t('footer.createAccount')}
          </Text>
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  // Reading the "next" note out of the address is something only the browser can
  // do, so Next.js needs it marked as arriving later.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
