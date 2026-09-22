'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The page the confirmation email links to. It confirms
// the address the moment it opens, then offers to sign in.
//
// The backend writes the link as <site>/verify-email?token=…, using its
// APP_URL setting, so this address has to stay exactly as it is.
//
// ---- THE TOKEN IS SENT ONCE, AND ONLY ONCE ----
//
// Each link works a single time. While developing, React deliberately runs a
// page's start-up code twice to flush out mistakes — and a page that simply
// confirmed on start-up would send the token twice. The first would succeed,
// the second would be refused as already used, and the page would announce
// "this link no longer works" to somebody whose address had just been
// confirmed. So the token is sent once per visit, however many times the
// start-up code runs.
//
// ---- EVERY WAY IT CAN END ----
//
//   Confirmed — say so, and offer to sign in.
//   Used up or out of date — each link works once, for 24 hours, and a newer
//     link cancels older ones. Offer a fresh one.
//   Incomplete — part of the address lost in copying. Offer a fresh one.
//   Anything else — the server asleep, the connection down. Nothing is wrong
//     with the link, so offer to try it again rather than a new one.

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { cx } from '@/lib/utils';
import { Button, ErrorState, Icon, Input, Skeleton, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { authErrorMessage, withEmail } from '../authErrors';

type Outcome = 'working' | 'done' | 'expired' | 'incomplete' | 'failed';

function VerifyEmail() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const token = params.get('token');

  const [outcome, setOutcome] = useState<Outcome>(token ? 'working' : 'incomplete');
  const [problem, setProblem] = useState<string | null>(null);
  // Bumped by "try again", which is the only thing allowed to send it twice.
  const [attempt, setAttempt] = useState(0);
  const sentFor = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const thisAttempt = `${token}#${attempt}`;
    if (sentFor.current === thisAttempt) return; // see the note at the top
    sentFor.current = thisAttempt;

    setOutcome('working');
    setProblem(null);

    apiClient.verifyEmail(token).then(
      () => setOutcome('done'),
      (caught: unknown) => {
        if (isApiError(caught) && caught.code === 'invalid_or_expired_link') {
          setOutcome('expired');
        } else if (isApiError(caught) && caught.code === 'invalid_input') {
          // A token the backend could not even read: mangled in copying.
          setOutcome('incomplete');
        } else {
          setProblem(authErrorMessage(caught, t));
          setOutcome('failed');
        }
      },
    );
  }, [token, attempt, t]);

  if (outcome === 'working') {
    return (
      <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }} role="status">
        <Skeleton height={76} width={76} radius="50%" />
        <Text variant="body" tone="ink2" align="center" raw>
          {t('authp.verify.working')}
        </Text>
      </div>
    );
  }

  if (outcome === 'failed') {
    return <ErrorState message={problem ?? undefined} onRetry={() => setAttempt((n) => n + 1)} />;
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
            {t('authp.verify.doneTitle')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {t('authp.verify.doneBody')}
          </Text>
        </div>
        <Button label={t('auth.signIn')} href="/login" fullWidth size="lg" />
      </>
    );
  }

  // Expired or incomplete: either way, the way forward is a fresh link.
  return (
    <SendFreshLink
      title={outcome === 'expired' ? 'authp.verify.expiredTitle' : 'authp.verify.incompleteTitle'}
      body={outcome === 'expired' ? 'authp.verify.expiredBody' : 'authp.verify.incompleteBody'}
    />
  );
}

function SendFreshLink({ title, body }: { title: TranslationKey; body: TranslationKey }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [working, setWorking] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    setProblem(null);
    try {
      await apiClient.resendVerification(email);
      setSentTo(email.trim());
    } catch (caught) {
      setProblem(authErrorMessage(caught, t));
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <span className={cx(styles.statusIcon, styles.statusPending)}>
          <Icon name="alert-circle-outline" size={38} />
        </span>
      </div>

      <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
        <Text variant="h1" as="h1" align="center" raw>
          {t(title)}
        </Text>
        <Text variant="body" tone="ink2" align="center" raw>
          {t(body)}
        </Text>
      </div>

      <form className={styles.form} onSubmit={send}>
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

        {problem ? (
          <div className={styles.reasonBox} role="alert">
            <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

        {sentTo ? (
          <div className={styles.note} role="status">
            <Icon name="checkmark-circle-outline" size={15} color="var(--success)" />
            <Text variant="small" tone="ink2" raw>
              {withEmail(t('authp.login.newLinkSent'), sentTo)}
            </Text>
          </div>
        ) : null}

        <Button
          label={t('authp.login.sendNewLink')}
          type="submit"
          fullWidth
          size="lg"
          loading={working}
          disabled={!email.trim()}
        />
      </form>

      {/* Opening an old link after confirming is common — the first email is
          still in the inbox. For them, signing in is the way forward. */}
      <Button label={t('auth.signIn')} href="/login" variant="ghost" size="md" fullWidth />
    </>
  );
}

export default function VerifyEmailPage() {
  // The token arrives in the address, which only the browser can read.
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
