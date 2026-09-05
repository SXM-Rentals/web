'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The identity check — what is still needed, what has been
// received, and what the answer was.
//
// IT HANDLES ALL FOUR ANSWERS: waiting, accepted, refused with a reason, and
// "we need one more thing". The refused one is the one that matters most.
//
// A REFUSAL ALWAYS SHOWS THE REASON. Being told no without being told why is the
// single most frustrating thing an identity check can do — the person cannot
// tell whether to try again, try something different, or give up, so they write
// to support, and support has to look it up. The reason is nearly always small
// and easy to fix: a blurred photo, a document out of date, a name that does not
// match. Saying which one costs nothing and saves everybody the exchange.
//
// The buttons along the bottom switch between the four answers. They exist so
// every state can be seen while the site is being built, and would not survive
// into a real version.

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { cx } from '@/lib/utils';
import { Button, Card, Icon, StatusPill, Text } from '@/components/ui';
import type { VerificationStatus } from '@/types';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

const STATE: Record<
  VerificationStatus,
  {
    icon: 'shield-outline' | 'time-outline' | 'checkmark-circle-outline' | 'alert-circle-outline';
    tone: string;
    pill: string;
    pillTone: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
    title: string;
    body: string;
  }
> = {
  unstarted: {
    icon: 'shield-outline',
    tone: styles.statusPending,
    pill: 'NOT STARTED',
    pillTone: 'neutral',
    title: 'Prove who you are',
    body: 'Before your first booking we need to check your licence and confirm who you are. It takes a few minutes and only has to be done once — every rental after this one skips it.',
  },
  pending: {
    icon: 'time-outline',
    tone: styles.statusPending,
    pill: 'BEING CHECKED',
    pillTone: 'warning',
    title: 'We are checking your documents',
    body: 'Most checks come back within a few minutes; some take up to a day. You do not have to wait here — carry on browsing and we will let you know.',
  },
  approved: {
    icon: 'checkmark-circle-outline',
    tone: styles.statusApproved,
    pill: 'VERIFIED',
    pillTone: 'success',
    title: 'You are verified',
    body: 'Your licence and identity documents have been accepted. You can book straight away, and you will not be asked again unless something expires.',
  },
  rejected: {
    icon: 'alert-circle-outline',
    tone: styles.statusRejected,
    pill: 'NOT ACCEPTED',
    pillTone: 'danger',
    title: 'We could not accept your documents',
    body: 'The reason is below. It is usually something small, and trying again with a better photo is normally all it takes.',
  },
  resubmit: {
    icon: 'alert-circle-outline',
    tone: styles.statusPending,
    pill: 'ONE MORE THING',
    pillTone: 'warning',
    title: 'We need one more thing',
    body: 'Almost there. One document still needs sending before the check can finish.',
  },
};

// Stand-in wording for a refusal, so the reason box can be seen working. In a
// real version this comes from whichever identity service is used.
const DEMO_REASON =
  'The photograph of your driving licence was too blurred to read the expiry date. Take another in good light, with the whole card flat in the frame and no glare across it.';

function VerifyStatus() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { user, setVerificationStatus } = useSession();

  const next = params.get('next') ?? '/account';
  const status = user?.verification.status ?? 'unstarted';
  const state = STATE[status];

  const steps = [
    {
      label: 'A photo of you',
      description: 'Taken with your webcam, and matched against your document.',
      done: user?.verification.selfieDone ?? false,
      href: '/verify-selfie',
    },
    {
      label: "Your driver's licence",
      description: 'Both sides. Upload a photo or use your webcam.',
      done: user?.verification.licenseDone ?? false,
      href: '/verify-id',
    },
    {
      label: user?.accountType === 'local' ? 'Local ID or residency document' : 'Passport',
      description:
        user?.accountType === 'local'
          ? 'Proves you live on the island.'
          : 'The photo page. Upload a scan or use your webcam.',
      done: user?.verification.identityDocDone ?? false,
      href: '/verify-id',
    },
  ];

  const nextStep = steps.find((step) => !step.done);

  return (
    <div className={styles.columnWide} style={{ display: 'contents' }}>
      <div style={{ textAlign: 'center' }}>
        <span className={cx(styles.statusIcon, state.tone)}>
          <Icon name={state.icon} size={38} />
        </span>
      </div>

      <div className={styles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
        <StatusPill label={state.pill} tone={state.pillTone} />
        <Text variant="h1" as="h1" align="center">
          {state.title}
        </Text>
        <Text variant="body" tone="ink2" align="center">
          {state.body}
        </Text>
      </div>

      {/* ---- THE REASON, WHENEVER IT WAS REFUSED ---- */}
      {status === 'rejected' ? (
        <div className={styles.reasonBox}>
          <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
          <div>
            <Text variant="label" as="h2" tone="danger" raw>
              {t('authp.status.whyNot')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {user?.verification.reason ?? DEMO_REASON}
            </Text>
          </div>
        </div>
      ) : null}

      {/* ---- WHAT IS STILL NEEDED ---- */}
      {status !== 'approved' ? (
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('authp.status.whatWeNeed')}
          </Text>

          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.label} className={styles.step}>
                <Icon
                  name={step.done ? 'checkmark-circle' : 'ellipse'}
                  size={19}
                  color={step.done ? 'var(--success)' : 'var(--ink3)'}
                />
                <div>
                  <Text variant="label" as="h3" tone={step.done ? 'ink2' : 'ink'}>
                    {step.label}
                  </Text>
                  <Text variant="small" tone="ink3">
                    {step.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.note} style={{ marginTop: 'var(--space-lg)' }}>
            <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('authp.status.encryptedNote')}
            </Text>
          </div>
        </Card>
      ) : null}

      <div className={styles.actions}>
        {status === 'approved' ? (
          <Button label={t('common.continue')} fullWidth size="lg" onClick={() => router.push(next)} />
        ) : status === 'pending' ? (
          <Button label={t('authp.status.carryOn')} fullWidth size="lg" href="/search" />
        ) : nextStep ? (
          <Button
            label={status === 'rejected' ? 'Try again' : 'Continue the check'}
            fullWidth
            size="lg"
            href={nextStep.href}
          />
        ) : (
          <Button
            label={t('authp.status.sendForChecking')}
            fullWidth
            size="lg"
            onClick={() => setVerificationStatus('pending')}
          />
        )}

        <Button label={t('authp.status.doLater')} variant="ghost" size="md" fullWidth href="/search" />
      </div>

      {/* ---- DEVELOPMENT ONLY ----
          Switches between the four answers so each can be looked at. This block
          does not belong in a real version. */}
      <Card>
        <Text variant="caption" tone="ink3" as="p" style={{ marginBottom: 'var(--space-sm)' }}>
          DEMO — SWITCH BETWEEN THE FOUR ANSWERS
        </Text>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {(['unstarted', 'pending', 'approved', 'rejected', 'resubmit'] as VerificationStatus[]).map(
            (option) => (
              <Button
                key={option}
                label={option}
                variant={status === option ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setVerificationStatus(option)}
              />
            ),
          )}
        </div>
      </Card>
    </div>
  );
}

export default function VerifyStatusPage() {
  return (
    <Suspense fallback={null}>
      <VerifyStatus />
    </Suspense>
  );
}
