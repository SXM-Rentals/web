'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The page the password-reset email links to. It asks for
// the new password twice and sets it.
//
// The backend writes the link as <site>/reset-password?token=…, using its
// APP_URL setting, so this address has to stay exactly as it is. The link is
// asked for on app/(auth)/forgot-password.
//
// ---- WHAT HAPPENS WHEN IT WORKS ----
//
// The backend changes the password AND signs the person out on every device,
// this one included. That is the right call: somebody resetting a password
// may be doing it because someone else got in. So the page ends on "sign in
// with your new password", and the session on this page is re-checked, so the
// site stops treating them as signed in straight away rather than on the next
// click.
//
// ---- WHY THE PASSWORD IS TYPED TWICE ----
//
// Here, and nowhere else, there is no old password to fall back on and nobody
// to ask — a typo in the only copy locks the account until the next reset
// email. Sign-up does not ask twice, because a typo there is caught the moment
// they sign in and is fixed by exactly this page.

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { cx } from '@/lib/utils';
import { Button, Icon, PasswordInput, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';
import { authErrorMessage } from '../authErrors';

// The backend's rule — see app/(auth)/signup/page.tsx.
const MIN_PASSWORD = 12;

type Outcome = 'form' | 'done' | 'expired';

function ResetPassword() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const { retry: recheckSession } = useSession();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [working, setWorking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>('form');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  // No token at all: nothing to send, so straight to asking for a new link.
  if (!token || outcome === 'expired') {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <span className={cx(styles.statusIcon, styles.statusPending)}>
            <Icon name="alert-circle-outline" size={38} />
          </span>
        </div>
        <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
          <Text variant="h1" as="h1" align="center" raw>
            {t(token ? 'authp.verify.expiredTitle' : 'authp.verify.incompleteTitle')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {t(token ? 'authp.newpw.expiredBody' : 'authp.verify.incompleteBody')}
          </Text>
        </div>
        <Button label={t('authp.newpw.askAgain')} href="/forgot-password" fullWidth size="lg" />
      </>
    );
  }

  if (outcome === 'done') {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <span className={cx(styles.statusIcon, styles.statusApproved)}>
            <Icon name="checkmark-circle-outline" size={38} />
          </span>
        </div>
        <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
          <Text variant="h1" as="h1" align="center" raw>
            {t('authp.newpw.doneTitle')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {t('authp.newpw.doneBody')}
          </Text>
        </div>
        <Button label={t('auth.signIn')} href="/login" fullWidth size="lg" />
      </>
    );
  }

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD;
  const mismatch = again.length > 0 && again !== password;
  const ready = password.length >= MIN_PASSWORD && again === password;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;

    setWorking(true);
    setProblem(null);
    setPasswordError(null);

    try {
      await apiClient.resetPassword(token, password);
      recheckSession();
      setOutcome('done');
    } catch (caught) {
      if (isApiError(caught) && caught.code === 'invalid_or_expired_link') {
        setOutcome('expired');
      } else if (isApiError(caught) && caught.code === 'password_breached') {
        setPasswordError(t('authp.signup.passwordBreached'));
      } else if (isApiError(caught) && caught.fieldErrors?.length) {
        // The backend calls the field newPassword.
        setPasswordError(caught.fieldErrors[0]?.message ?? caught.message);
      } else {
        setProblem(authErrorMessage(caught, t));
      }
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.newpw.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.newpw.subtitle')}
        </Text>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <PasswordInput
          label={t('authp.newpw.newLabel')}
          autoComplete="new-password"
          iconLeft="lock-closed-outline"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError(null);
          }}
          hint={t('authp.signup.passwordHint')}
          error={passwordError ?? (tooShort ? t('authp.signup.passwordTooShort') : undefined)}
          required
        />

        <PasswordInput
          label={t('authp.newpw.confirmLabel')}
          autoComplete="new-password"
          iconLeft="lock-closed-outline"
          value={again}
          onChange={(event) => setAgain(event.target.value)}
          error={mismatch ? t('authp.newpw.mismatch') : undefined}
          required
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
          label={t('authp.newpw.save')}
          type="submit"
          fullWidth
          size="lg"
          loading={working}
          disabled={!ready}
        />
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  // The token arrives in the address, which only the browser can read.
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
