'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Signing in with an email address and password, against
// the real backend.
//
// ---- THE BUG THIS FIXES ----
//
// The pretend version sent everybody straight on to their account, whatever
// they typed. Wired to a real backend unchanged, a wrong password would have
// done the same: the sign-in fails, nothing catches it, and the page moves on
// to /account as if it had worked. Now a failure stays on this page and says
// what went wrong.
//
// ---- THREE REFUSALS, THREE DIFFERENT ANSWERS ----
//
//   Wrong email or password — say so, and let them try again. Deliberately it
//   does not say WHICH was wrong: that would tell a stranger which addresses
//   have accounts here.
//
//   Never confirmed their email — say so, and offer a fresh link right here,
//   because the old one may have expired or be buried in spam.
//
//   Too many attempts — the backend locks an account for a while after a run
//   of wrong passwords. Say to wait, rather than invite more guesses.
//
// IT REMEMBERS WHERE SOMEONE WAS GOING. Arriving here from a booking carries a
// "next" note in the address, and signing in returns them to that booking.
// Only a page on this site is accepted as "next" — see safeNextPath in
// lib/utils.ts for why that check is not optional.

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { safeNextPath } from '@/lib/utils';
import { Button, Icon, Input, PasswordInput, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';
import { SocialSignIn } from '../SocialSignIn';
import { authErrorMessage, withEmail } from '../authErrors';

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Set when the account exists but its email address was never confirmed.
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const next = safeNextPath(params.get('next'));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    setProblem(null);
    setUnconfirmed(false);
    setResent(false);

    try {
      await signIn(email, password);
      // `working` stays on: the page is about to change, and switching the
      // button back for a moment first would read as a second chance to click.
      router.push(next);
    } catch (caught) {
      setProblem(authErrorMessage(caught, t));
      setUnconfirmed(isApiError(caught) && caught.code === 'email_not_verified');
      setWorking(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await apiClient.resendVerification(email);
      setResent(true);
      setProblem(null);
    } catch (caught) {
      setProblem(authErrorMessage(caught, t));
    } finally {
      setResending(false);
    }
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

      <SocialSignIn />

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

        {/* role="alert", so a screen reader says it out loud the moment it
            appears, instead of leaving somebody wondering why nothing
            happened. */}
        {problem ? (
          <div className={styles.reasonBox} role="alert">
            <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <Text variant="small" tone="ink2" raw>
                {problem}
              </Text>
              {unconfirmed ? (
                <Button
                  label={t('authp.login.sendNewLink')}
                  variant="outline"
                  size="sm"
                  loading={resending}
                  onClick={resend}
                />
              ) : null}
            </div>
          </div>
        ) : null}

        {resent ? (
          <div className={styles.note} role="status">
            <Icon name="checkmark-circle-outline" size={15} color="var(--success)" />
            <Text variant="small" tone="ink2" raw>
              {withEmail(t('authp.login.newLinkSent'), email)}
            </Text>
          </div>
        ) : null}

        <Button label={t('auth.signIn')} type="submit" fullWidth size="lg" loading={working} />
      </form>

      <div className={styles.footNote}>
        <Link href="/forgot-password" className={styles.link}>
          <Text variant="small" as="span" tone="brand" raw>
            {t('authp.login.forgotten')}
          </Text>
        </Link>
      </div>

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
