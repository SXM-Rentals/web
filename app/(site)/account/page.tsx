'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The front page of someone's account — who they are, how
// far through the identity check they have got, and a summary of their rentals.
//
// THE VERIFICATION PANEL IS THE POINT OF THIS PAGE. Identity checks are the step
// people most often start and never finish, and an unfinished one is only
// discovered at the moment they try to book. Showing the state here, with what
// is still outstanding and a way to carry on, is what stops that.
//
// A REJECTED CHECK ALWAYS SHOWS THE REASON. Being told "no" without being told
// why is the single most frustrating thing an identity check can do, and it
// generates a support message every time.

import React from 'react';
import { useSession } from '@/lib/auth';
import { useBusiness } from '@/lib/business';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { longDate } from '@/lib/format';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  ListRow,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { VerificationStatus } from '@/types';
import styles from './account.module.css';
import { useTranslation, type TranslationKey } from '@/lib/i18n';

// How each stage of the identity check is described and coloured.
//
// The wording is held as keys rather than words. This sits above the component,
// where t() cannot be called, so each one is looked up at the point it is drawn.
const VERIFICATION: Record<
  VerificationStatus,
  {
    label: TranslationKey;
    tone: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
    body: TranslationKey;
    action?: TranslationKey;
    href?: string;
  }
> = {
  unstarted: {
    label: 'acct.verify.notStarted',
    tone: 'neutral',
    body: 'acct.verify.notStartedBody',
    action: 'acct.verify.startCheck',
    href: '/verify-status',
  },
  pending: {
    label: 'acct.verify.checking',
    tone: 'warning',
    body: 'acct.verify.checkingBody',
  },
  approved: {
    label: 'acct.verify.verified',
    tone: 'success',
    body: 'acct.verify.verifiedBody',
  },
  rejected: {
    label: 'acct.verify.rejected',
    tone: 'danger',
    body: 'acct.verify.rejectedBody',
    action: 'acct.verify.tryAgain',
    href: '/verify-status',
  },
  resubmit: {
    label: 'acct.verify.resubmit',
    tone: 'warning',
    body: 'acct.verify.resubmitBody',
    action: 'acct.verify.finishCheck',
    href: '/verify-status',
  },
};

export default function AccountPage() {
  const { t } = useTranslation();
  const { user, signOut } = useSession();
  const { hasBusiness } = useBusiness();

  const { data: bookings, loading } = useAsyncData(() => apiClient.listBookings(), []);

  if (!user) {
    return <Skeleton height={300} radius="var(--radius-lg)" />;
  }

  const state = VERIFICATION[user.verification.status];

  const counts = {
    upcoming: (bookings ?? []).filter((b) => b.status === 'upcoming').length,
    active: (bookings ?? []).filter((b) => b.status === 'active').length,
    completed: (bookings ?? []).filter((b) => b.status === 'completed').length,
  };

  // The three parts of the check, so someone half way through can see exactly
  // what is left rather than a single unhelpful "incomplete".
  const steps = [
    { label: 'Photo of you', done: user.verification.selfieDone },
    { label: "Driver's licence", done: user.verification.licenseDone },
    {
      label: user.accountType === 'local' ? 'Local ID or residency' : 'Passport',
      done: user.verification.identityDocDone,
    },
  ];

  return (
    <div className={styles.page}>
      {/* ---- WHO YOU ARE ---- */}
      <Card padded>
        <div className={styles.profileHead}>
          <Avatar firstName={user.firstName} lastName={user.lastName} size={64} />

          <div className={styles.profileText}>
            <Text variant="h2" as="h1" raw>
              {`${user.firstName} ${user.lastName}`}
            </Text>
            <Text variant="body" tone="ink2" raw>
              {user.email}
            </Text>
            <Text variant="small" tone="ink3" raw>
              {`${user.accountType === 'local' ? 'Local' : 'Tourist'} account · member since ${longDate(
                user.memberSince,
              )}`}
            </Text>
          </div>

          {user.isIslander ? <StatusPill label={t('rewards.islander')} tone="brand" /> : null}
        </div>

        <Divider style={{ marginBlock: 'var(--space-lg)' }} />

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <Text variant="h3" as="p" raw>
              {loading ? '—' : String(counts.upcoming)}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('rentals.upcoming')}
            </Text>
          </div>
          <div className={styles.stat}>
            <Text variant="h3" as="p" raw>
              {loading ? '—' : String(counts.active)}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('acct.outNow')}
            </Text>
          </div>
          <div className={styles.stat}>
            <Text variant="h3" as="p" raw>
              {loading ? '—' : String(counts.completed)}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('acct.status.completed')}
            </Text>
          </div>
          <div className={styles.stat}>
            <Text variant="h3" as="p" raw>
              {user.accountType === 'local' ? 'Local' : 'Tourist'}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('acct.accountType')}
            </Text>
          </div>
        </div>
      </Card>

      {/* ---- THE IDENTITY CHECK ---- */}
      <Card padded>
        <div className={styles.pageHead} style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Icon name="shield-checkmark-outline" size={20} />
            <Text variant="label" as="h2" raw>
              {t('acct.identityCheck')}
            </Text>
          </div>
          <StatusPill label={t(state.label)} tone={state.tone} />
        </div>

        <Text variant="body" tone="ink2">
          {t(state.body)}
        </Text>

        {/* A rejection always carries its reason. */}
        {user.verification.status === 'rejected' && user.verification.reason ? (
          <div
            style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-soft)',
            }}
          >
            <Text variant="small" tone="danger" raw>
              {user.verification.reason}
            </Text>
          </div>
        ) : null}

        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {steps.map((step) => (
            <span key={step.label} className={styles.benefit}>
              <Icon
                name={step.done ? 'checkmark-circle' : 'ellipse'}
                size={16}
                color={step.done ? 'var(--success)' : 'var(--ink3)'}
              />
              <Text variant="small" tone={step.done ? 'ink2' : 'ink3'} as="span">
                {step.label}
              </Text>
            </span>
          ))}
        </div>

        {state.action && state.href ? (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <Button label={t(state.action)} href={state.href} variant="secondary" size="sm" />
          </div>
        ) : null}
      </Card>

      {/* ---- EVERYTHING ELSE ---- */}
      <Card padded={false}>
        <ListRow title={t('web.nav.documents')} subtitle={t('acct.row.documents')} icon="documents-outline" href="/account/documents" />
        <ListRow title={t('acct.pay.title')} subtitle={t('acct.row.payment')} icon="card-outline" href="/account/payment-methods" />
        <ListRow title={t('profile.language')} subtitle={t('acct.row.language')} icon="globe-outline" href="/account/language" />
        <ListRow title={t('profile.settings')} subtitle={t('acct.row.settings')} icon="settings-outline" href="/account/settings" />
        <ListRow title={t('acct.support.title')} subtitle={t('acct.row.support')} icon="help-circle-outline" href="/account/support" />

        {hasBusiness ? (
          <ListRow
            title={t('web.nav.businessDashboard')}
            subtitle={t('acct.row.dashboard')}
            icon="storefront-outline"
            href="/provider"
          />
        ) : (
          <ListRow
            title={t('pp.apply.title')}
            subtitle={t('acct.row.listVehicles')}
            icon="storefront-outline"
            href="/provider/apply"
          />
        )}

        <ListRow title="Sign out" icon="log-out-outline" danger onClick={() => signOut()} />
      </Card>
    </div>
  );
}
