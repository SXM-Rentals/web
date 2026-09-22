'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Creating an account, against the real backend.
//
// IT ASKS FOR AS LITTLE AS IT CAN — a name, an email, a password, and whether
// somebody lives on the island. Everything else the platform eventually needs
// (the licence, the identity check) is asked for later, at the point it
// matters. A long form at the door is how people are lost before they have
// seen anything.
//
// ---- WHY "DO YOU LIVE HERE?" MOVED ONTO THIS FORM ----
//
// It used to be a separate page afterwards. The backend needs the answer at
// the moment the account is created, and has no way to change it later, so
// it is asked here, once. It decides which documents are asked for — a
// passport from a visitor, a local ID from a resident — and nothing else; the
// price of a rental is the same either way.
//
// ---- IT DOES NOT SIGN ANYBODY IN ----
//
// The backend emails a confirmation link and will not let the account sign in
// until it has been opened. So this page ends on "check your inbox", with a
// way to send the link again, rather than pretending to drop them into an
// account they cannot yet use.

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { cx, safeNextPath } from '@/lib/utils';
import { Button, Card, Checkbox, Icon, Input, PasswordInput, Text } from '@/components/ui';
import type { AccountType } from '@/types';
import styles from '../auth.module.css';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { SocialSignIn } from '../SocialSignIn';
import { authErrorMessage, withEmail } from '../authErrors';

// The backend's rule (PASSWORD_MIN_LENGTH in its src/lib/passwords.ts), stated
// up front rather than only after it has been broken.
const MIN_PASSWORD = 12;

const CHOICES: {
  type: AccountType;
  title: TranslationKey;
  blurb: TranslationKey;
  icon: 'location' | 'boat-outline';
}[] = [
  { type: 'local', title: 'authp.type.local', blurb: 'authp.type.localBlurb', icon: 'location' },
  { type: 'tourist', title: 'authp.type.visiting', blurb: 'authp.type.visitingBlurb', icon: 'boat-outline' },
];

function SignupForm() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const { signUp } = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [working, setWorking] = useState(false);

  // What went wrong, by field where the backend said which field.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState<string | null>(null);

  // Set once the account exists and the link is on its way.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const next = safeNextPath(params.get('next'));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accountType) return;

    setWorking(true);
    setProblem(null);
    setFieldErrors({});

    try {
      await signUp({ firstName, lastName, email, password, accountType });
      setSentTo(email.trim());
    } catch (caught) {
      if (isApiError(caught) && caught.code === 'password_breached') {
        // Belongs under the password, not in a box at the bottom.
        setFieldErrors({ password: t('authp.signup.passwordBreached') });
      } else if (isApiError(caught) && caught.fieldErrors?.length) {
        setFieldErrors(Object.fromEntries(caught.fieldErrors.map((f) => [f.field, f.message])));
      } else {
        setProblem(authErrorMessage(caught, t));
      }
    } finally {
      setWorking(false);
    }
  };

  const resend = async () => {
    if (!sentTo) return;
    setResending(true);
    setProblem(null);
    try {
      await apiClient.resendVerification(sentTo);
      setResent(true);
    } catch (caught) {
      setProblem(authErrorMessage(caught, t));
    } finally {
      setResending(false);
    }
  };

  // ---- THE ACCOUNT EXISTS: CHECK YOUR INBOX ----
  if (sentTo) {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <span className={cx(styles.statusIcon, styles.statusApproved)}>
            <Icon name="mail-open-outline" size={34} />
          </span>
        </div>

        <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
          <Text variant="h1" as="h1" align="center" raw>
            {t('authp.reset.checkInbox')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {withEmail(t('authp.signup.sentBody'), sentTo)}
          </Text>
        </div>

        <Card>
          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('authp.signup.spamNote')}
            </Text>
          </div>
        </Card>

        {problem ? (
          <div className={styles.reasonBox} role="alert">
            <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

        {resent ? (
          <div className={styles.note} role="status">
            <Icon name="checkmark-circle-outline" size={15} color="var(--success)" />
            <Text variant="small" tone="ink2" raw>
              {withEmail(t('authp.login.newLinkSent'), sentTo)}
            </Text>
          </div>
        ) : null}

        <div className={styles.actions}>
          <Button
            label={t('auth.signIn')}
            href={`/login?next=${encodeURIComponent(next)}`}
            fullWidth
            size="lg"
          />
          <Button
            label={t('authp.login.sendNewLink')}
            variant="ghost"
            size="md"
            fullWidth
            loading={resending}
            onClick={resend}
          />
        </div>
      </>
    );
  }

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD;

  const ready =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.length >= MIN_PASSWORD &&
    accountType &&
    agreed;

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

      <SocialSignIn />

      <form className={styles.form} onSubmit={submit}>
        <Input
          label={t('auth.firstName')}
          autoComplete="given-name"
          placeholder={t('authp.signup.firstNamePlaceholder')}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          error={fieldErrors.firstName}
          required
        />

        <Input
          label={t('auth.lastName')}
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          error={fieldErrors.lastName}
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
          error={fieldErrors.email}
          required
        />

        <PasswordInput
          label={t('auth.password')}
          autoComplete="new-password"
          iconLeft="lock-closed-outline"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            // A new password is a new answer; the old complaint no longer applies.
            if (fieldErrors.password) {
              setFieldErrors((current) =>
                Object.fromEntries(Object.entries(current).filter(([field]) => field !== 'password')),
              );
            }
          }}
          hint={t('authp.signup.passwordHint')}
          error={
            fieldErrors.password ?? (passwordTooShort ? t('authp.signup.passwordTooShort') : undefined)
          }
          required
        />

        {/* ---- DO YOU LIVE HERE? ---- */}
        <div role="radiogroup" aria-labelledby="account-type-label">
          <Text id="account-type-label" variant="label" as="p" raw>
            {t('authp.type.title')}
          </Text>
          <Text variant="small" tone="ink3" style={{ marginBottom: 'var(--space-md)' }} raw>
            {t('authp.type.subtitle')}
          </Text>

          <div className={styles.choiceGrid}>
            {CHOICES.map((choice) => {
              const selected = accountType === choice.type;
              return (
                <button
                  key={choice.type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cx(styles.choice, selected && styles.choiceSelected)}
                  onClick={() => setAccountType(choice.type)}
                >
                  <span className={styles.choiceIcon}>
                    <Icon name={choice.icon} size={22} />
                  </span>
                  <Text variant="h3" as="span" raw>
                    {t(choice.title)}
                  </Text>
                  <Text variant="small" tone="ink2" as="span" raw>
                    {t(choice.blurb)}
                  </Text>
                </button>
              );
            })}
          </div>

          {fieldErrors.accountType ? (
            <Text variant="small" tone="danger" style={{ marginTop: 'var(--space-sm)' }} raw>
              {fieldErrors.accountType}
            </Text>
          ) : null}

          {accountType === 'local' ? (
            <div className={styles.note} style={{ marginTop: 'var(--space-md)' }}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('authp.type.islanderNote')}
              </Text>
            </div>
          ) : null}
        </div>

        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label={t('authp.signup.consent')}
          hint="Both are readable in full without an account."
        />

        {problem ? (
          <div className={styles.reasonBox} role="alert">
            <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

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
