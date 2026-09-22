'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The identity check — what is still needed, what has been
// received, and what the answer was.
//
// IT HANDLES ALL FOUR ANSWERS: waiting, accepted, refused with a reason, and
// "we need one more thing". The refused one is the one that matters most.
//
// A REFUSAL SHOWS THE REASON THE BACKEND GAVE. Being told no without being told
// why is the single most frustrating thing an identity check can do — the
// person cannot tell whether to try again, try something different, or give
// up. The reason is nearly always small and easy to fix: a blurred photo, a
// document out of date. When the backend recorded one, it is shown word for
// word. When it did not, nothing is invented to fill the gap — this page used
// to show a made-up reason there, which on a real account would have been a
// false statement about somebody's documents.
//
// THE STATUS IS THE REAL ONE, from the signed-in account. What this page cannot
// do is send anything: the identity check has no backend yet, so its "send for
// checking" button is switched off, and the notice at the top says so. The
// row of demo buttons that used to switch between the answers is gone.

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { cx, safeNextPath } from '@/lib/utils';
import { Button, Card, Icon, StatusPill, Text } from '@/components/ui';
import type { VerificationStatus } from '@/types';
import styles from '../auth.module.css';
import { NotConnectedNotice } from '@/components/layout/NotConnectedNotice';
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

function VerifyStatus() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useSession();

  const next = safeNextPath(params.get('next'));
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

      <NotConnectedNotice what="The identity check" />

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
      {status === 'rejected' && user?.verification.reason ? (
        <div className={styles.reasonBox}>
          <Icon name="alert-circle-outline" size={19} color="var(--danger)" />
          <div>
            <Text variant="label" as="h2" tone="danger" raw>
              {t('authp.status.whyNot')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {user.verification.reason}
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
          // Switched off, not hidden: the check is not connected yet, and
          // the notice at the top of the page says so.
          <Button label={t('authp.status.sendForChecking')} fullWidth size="lg" disabled />
        )}

        <Button label={t('authp.status.doLater')} variant="ghost" size="md" fullWidth href="/search" />
      </div>

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
