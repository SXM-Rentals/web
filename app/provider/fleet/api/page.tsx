'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Connecting a rental business's own booking software to
// SXM Rentals, so its vehicles and availability stay in one place instead of
// being kept up to date twice.
//
// WHY THIS MATTERS MORE THAN IT LOOKS: it is one of the three things the Overview
// document says sets this platform apart. A rental company that already runs its
// own system will not join something that makes them type every vehicle in
// again and then remember to update two calendars — the first double-booking
// ends the experiment. Being able to connect directly is what makes joining
// worth doing for the established businesses on the island, rather than only the
// ones with nothing to lose.

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useBusiness } from '@/lib/business';
import { longDate } from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import {
  Button,
  Card,
  ErrorState,
  Icon,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import styles from '../../provider.module.css';
import { useTranslation } from '@/lib/i18n';

// One line of connection detail, with a button to copy it. Copying beats
// selecting by hand — these are long strings and a half-copied API key produces
// an error message that explains nothing.
function CopyRow({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!secret);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying can be blocked. Revealing the text means it can still be
      // selected by hand rather than being stuck behind a button that fails.
      setRevealed(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <Text variant="label" tone="ink2" as="p">
        {label}
      </Text>

      <div className={styles.codeRow}>
        <code className={styles.code}>
          {revealed ? value : '•'.repeat(Math.min(value.length, 32))}
        </code>

        {secret ? (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? `Hide the ${label}` : `Show the ${label}`}
            // The icon stays 18px; the button around it is sized for a thumb.
            // An 18px button is comfortable with a mouse and close to
            // unhittable with a finger.
            className={styles.codeButton}
          >
            <Icon name={revealed ? 'eye-off-outline' : 'eye-outline'} size={18} />
          </button>
        ) : null}

        <button
          type="button"
          onClick={copy}
          aria-label={`Copy the ${label}`}
          className={styles.codeButton}
          style={{ color: copied ? 'var(--success)' : undefined }}
        >
          <Icon name={copied ? 'checkmark' : 'documents-outline'} size={18} />
        </button>
      </div>
    </div>
  );
}

export default function FleetApiPage() {
  const { t } = useTranslation();
  const { profile } = useBusiness();
  const { data: connection, loading, error, refresh } = useAsyncData(
    () => apiClient.getApiConnection(),
    [],
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Fleet', href: '/provider/fleet' },
          { label: 'Connect your system' },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('pp.api.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.api.subtitle')}
          </Text>
        </div>

        <StatusPill
          label={profile.apiConnected ? 'CONNECTED' : 'NOT CONNECTED'}
          tone={profile.apiConnected ? 'success' : 'neutral'}
        />
      </div>

      {profile.apiConnected && profile.apiLastSyncedAt ? (
        <Card padded>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="checkmark-circle-outline" size={18} color="var(--success)" />
            <Text variant="small" tone="ink2" raw>
              {`Your system is connected. Last read from it on ${longDate(
                profile.apiLastSyncedAt,
              )}.`}
            </Text>
          </div>
        </Card>
      ) : null}

      {/* ---- HOW IT WORKS ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('pp.api.how')}
        </Text>

        <div className={styles.stack}>
          {[
            {
              icon: 'download-outline' as const,
              title: 'We read your vehicles and availability',
              body: 'Your system stays the place you manage them. We ask it what is available rather than keeping a second copy that can drift out of date.',
            },
            {
              icon: 'send' as const,
              title: 'We send bookings back to you',
              body: 'When a customer books, we post it to a web address of yours so it appears in your own system straight away.',
            },
            {
              icon: 'shield-outline' as const,
              title: 'Payments and deposits stay with us',
              body: 'The money, the deposit hold and the signed agreement are all handled by SXM Rentals. Your system does not need to know anything about cards.',
            },
          ].map((step) => (
            <div key={step.title} className={styles.note} style={{ marginTop: 0 }}>
              <Icon name={step.icon} size={18} color="var(--ink2)" />
              <div>
                <Text variant="label" as="h3">
                  {step.title}
                </Text>
                <Text variant="small" tone="ink2">
                  {step.body}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ---- THE CONNECTION DETAILS ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('pp.api.details')}
        </Text>

        {loading ? (
          <Skeleton height={220} radius="var(--radius-md)" />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} inline />
        ) : connection ? (
          <div className={styles.stack}>
            <CopyRow label={t('pp.api.key')} value={connection.apiKey} secret />
            <CopyRow label={t('pp.api.inventoryUrl')} value={connection.pushEndpoint} />
            <CopyRow label={t('pp.api.bookingsUrl')} value={connection.bookingsWebhook} />

            <div className={styles.note}>
              <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('pp.api.keyWarning')}
              </Text>
            </div>

            <div className={styles.headActions} style={{ marginTop: 'var(--space-md)' }}>
              <Button
                label={t('pp.api.readDocs')}
                href={connection.docsUrl}
                external
                variant="outline"
                size="sm"
                iconRight={<Icon name="arrow-forward" size={15} />}
              />
            </div>
          </div>
        ) : null}
      </Card>

      <Card padded>
        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="information-circle-outline" size={16} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.api.demoNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
