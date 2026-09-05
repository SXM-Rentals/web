'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The general settings for a rental business — how the
// dashboard looks, what language it is in, and what SXM Rentals emails them
// about.
//
// WHY THIS IS SEPARATE FROM THE BUSINESS PROFILE. The profile at
// /provider/profile is about the BUSINESS: its name, its description, what
// customers see. This page is about the PERSON looking at the screen: light or
// dark, which language, which emails. Those are different things owned by
// different people — a business with three staff has one profile and three sets
// of preferences — and putting them on one page makes it unclear which half a
// change affects.
//
// UNTIL NOW A BUSINESS OWNER HAD NOWHERE TO CHANGE EITHER. Theme and language
// lived only in the customer account area, which a business owner may never
// visit and which is a strange place to send somebody who is trying to read
// their own payout figures in French.
//
// THE SWITCHES ARE HONEST ABOUT WHAT WORKS. Theme and language genuinely take
// effect and are remembered. The email switches have nothing behind them yet, so
// they say so — a setting that appears to work and does not is worse than one
// marked unfinished.

import React, { useState } from 'react';
import { useTheme, type ThemePreference } from '@/lib/theme/ThemeProvider';
import { useTranslation, languageOptions, type Language } from '@/lib/i18n';
import { useSession } from '@/lib/auth';
import {
  Button,
  Card,
  ComingSoonBadge,
  Dialog,
  Icon,
  ListRow,
  SegmentedControl,
  Text,
  Toggle,
} from '@/components/ui';
import styles from '@/app/provider/provider.module.css';

export default function ProviderSettingsPage() {
  const { t, language, setLanguage } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { signOut } = useSession();

  // Remembered only for this visit, and the page says so.
  const [newBooking, setNewBooking] = useState(true);
  const [cancellation, setCancellation] = useState(true);
  const [payoutSent, setPayoutSent] = useState(true);
  const [newMessage, setNewMessage] = useState(true);

  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('pp.settings.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('pp.settings.subtitle')}
        </Text>
      </div>

      {/* ==================== HOW IT LOOKS ==================== */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('settings.appearance')}
        </Text>

        {/* Not full width. Three short choices stretched across a wide card put
            enormous gaps between them and made the control read as three
            separate things rather than one set of options. */}
        <SegmentedControl
          label={t('acct.settings.lightOrDark')}
          value={preference}
          onChange={(value) => setPreference(value as ThemePreference)}
          options={[
            { value: 'system', label: t('acct.settings.matchComputer') },
            { value: 'light', label: t('settings.light') },
            { value: 'dark', label: t('settings.dark') },
          ]}
        />

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.settings.themeNote')}
          </Text>
        </div>
      </Card>

      {/* ==================== WHICH LANGUAGE ====================
          The four are listed here rather than behind a button. A business owner
          who cannot read the dashboard cannot be asked to find a settings page
          in order to fix that — and having landed here, the choice should be one
          tap away rather than two. */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('profile.language')}
        </Text>

        {languageOptions.map((option) => (
          <ListRow
            key={option.code}
            // The name is written in the language itself — a Dutch speaker looks
            // for "Nederlands", not "Dutch" — with the English underneath so it
            // can still be found by somebody who does not read it.
            title={option.label}
            subtitle={option.english}
            onClick={() => setLanguage(option.code as Language)}
            trailing={
              option.code === language ? (
                <Icon name="checkmark" size={19} color="var(--brand)" />
              ) : null
            }
          />
        ))}

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.settings.languageNote')}
          </Text>
        </div>
      </Card>

      {/* ==================== WHAT WE EMAIL ABOUT ==================== */}
      <Card padded>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <Text variant="label" as="h2" raw>
            {t('pp.settings.emailsTitle')}
          </Text>
          <ComingSoonBadge label={t('acct.pay.notConnected')} />
        </div>

        {[
          {
            title: 'pp.settings.newBooking',
            body: 'pp.settings.newBookingBody',
            value: newBooking,
            onChange: setNewBooking,
          },
          {
            title: 'pp.settings.cancellation',
            body: 'pp.settings.cancellationBody',
            value: cancellation,
            onChange: setCancellation,
          },
          {
            title: 'pp.settings.payoutSent',
            body: 'pp.settings.payoutSentBody',
            value: payoutSent,
            onChange: setPayoutSent,
          },
          {
            title: 'pp.settings.newMessage',
            body: 'pp.settings.newMessageBody',
            value: newMessage,
            onChange: setNewMessage,
          },
        ].map((row, index, all) => (
          <div
            key={row.title}
            className={styles.settingRow}
            // No dividing line under the last one, or the note below would sit
            // directly on top of it.
            data-last={index === all.length - 1 ? true : undefined}
          >
            <div className={styles.settingText}>
              <Text variant="label" as="span" raw>
                {t(row.title as 'pp.settings.newBooking')}
              </Text>
              <Text variant="small" tone="ink3" raw>
                {t(row.body as 'pp.settings.newBookingBody')}
              </Text>
            </div>
            <Toggle
              label={t(row.title as 'pp.settings.newBooking')}
              value={row.value}
              onChange={row.onChange}
            />
          </div>
        ))}

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('acct.settings.switchesNote')}
          </Text>
        </div>
      </Card>

      {/* ==================== THIS ACCOUNT ====================
          There is no "delete my business" button here, and that is not an
          oversight — see the note. */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('pp.settings.accountTitle')}
        </Text>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button
            label={t('web.menu.signOut')}
            variant="outline"
            size="md"
            onClick={() => setSignOutOpen(true)}
          />
          <Button
            label={t('pp.settings.contactUs')}
            href="/account/support"
            variant="secondary"
            size="md"
          />
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.settings.closeNote')}
          </Text>
        </div>
      </Card>

      <Dialog
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title={t('acct.settings.signOutTitle')}
        body={t('acct.settings.signOutBody')}
        confirmLabel={t('web.menu.signOut')}
        onConfirm={() => {
          setSignOutOpen(false);
          signOut();
        }}
      />
    </div>
  );
}
