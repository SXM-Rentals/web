'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Creating an account.
//
// IT ASKS FOR AS LITTLE AS IT CAN — a name, an email and a password. Everything
// else the platform eventually needs (which documents apply, the licence, the
// identity check) is asked for later, at the point it actually matters. A long
// form at the door is how people are lost before they have seen anything.
//
// After this comes the Local or Tourist question, because that decides which
// documents get asked for, and asking it before there is an account to attach it
// to would mean asking it twice.

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { Button, Card, Checkbox, Icon, Input, PasswordInput, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { signUp, signInWithApple, signInWithGoogle } = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [working, setWorking] = useState(false);

  const next = params.get('next') ?? '/account';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    await signUp({ firstName, lastName, email });
    // Straight into choosing Local or Tourist, carrying where they were headed.
    router.push(`/account-type?next=${encodeURIComponent(next)}`);
  };

  const ready =
    firstName.trim() && lastName.trim() && email.trim() && password.length >= 8 && agreed;

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.signup.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.signup.subtitle')}
        </Text>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.socialButton}
          onClick={async () => {
            setWorking(true);
            await signInWithApple();
            router.push(`/account-type?next=${encodeURIComponent(next)}`);
          }}
        >
          <Icon name="logo-apple" size={20} />
          {t('authp.login.withApple')}
        </button>

        <button
          type="button"
          className={styles.socialButton}
          onClick={async () => {
            setWorking(true);
            await signInWithGoogle();
            router.push(`/account-type?next=${encodeURIComponent(next)}`);
          }}
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

      <form className={styles.form} onSubmit={submit}>
        <Input
          label={t('auth.firstName')}
          autoComplete="given-name"
          placeholder={t('authp.signup.firstNamePlaceholder')}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />

        <Input
          label={t('auth.lastName')}
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          iconLeft="mail-outline"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          hint="Confirmations, receipts and your signed agreements are sent here."
          required
        />

        <PasswordInput
          label={t('auth.password')}
          autoComplete="new-password"
          iconLeft="lock-closed-outline"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hint="At least eight characters."
          // The rule is stated up front rather than only after it is broken.
          error={
            password.length > 0 && password.length < 8
              ? 'Passwords need to be at least eight characters.'
              : undefined
          }
          required
        />

        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label={t('authp.signup.consent')}
          hint="Both are readable in full without an account."
        />

        <Button
          label={t('authp.signup.cta')}
          type="submit"
          fullWidth
          size="lg"
          loading={working}
          disabled={!ready}
        />
      </form>

      <div className={styles.footNote}>
        <Link href="/legal/terms-of-service" className={styles.link}>
          <Text variant="small" as="span" tone="brand">
            Terms of Service
          </Text>
        </Link>
        <Text variant="small" tone="ink3" as="span">
          {'  ·  '}
        </Text>
        <Link href="/legal/privacy-policy" className={styles.link}>
          <Text variant="small" as="span" tone="brand">
            Privacy Policy
          </Text>
        </Link>
      </div>

      <Card>
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.signup.demoNote')}
          </Text>
        </div>
      </Card>

      <div className={styles.footNote}>
        <Text variant="small" tone="ink2" as="span">
          Already have an account?{' '}
        </Text>
        <Link href={`/login?next=${encodeURIComponent(next)}`} className={styles.link}>
          <Text variant="small" as="span" tone="brand" raw>
            {t('auth.signIn')}
          </Text>
        </Link>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
