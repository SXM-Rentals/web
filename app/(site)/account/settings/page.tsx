'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The settings for someone's account — how the site looks,
// what they want to be told about, and the two things that end an account.
//
// THE SWITCHES ARE HONEST ABOUT WHAT WORKS. Theme and language genuinely take
// effect. The notification switches have nothing behind them yet, so they say so
// rather than quietly remembering a preference nobody will ever act on — a
// setting that appears to work and does not is worse than one marked unfinished.

import React, { useState } from 'react';
import { useTheme, type ThemePreference } from '@/lib/theme/ThemeProvider';
import { useTranslation, languageOptions } from '@/lib/i18n';
import { useSession } from '@/lib/auth';
import {
  Button,
  Card,
  ComingSoonBadge,
  Dialog,
  Icon,
  SegmentedControl,
  Text,
  Toggle,
} from '@/components/ui';
import styles from '../account.module.css';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { language } = useTranslation();
  const { signOut } = useSession();

  // These are remembered only for this visit, and the page says so.
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);
  const [offers, setOffers] = useState(false);

  const [signOutOpen, setSignOutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const currentLanguage = languageOptions.find((option) => option.code === language);

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('profile.settings')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.settings.subtitle')}
        </Text>
      </div>

      {/* ---- APPEARANCE ---- */}
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

      {/* ---- LANGUAGE ---- */}
      <Card padded>
        <div className={styles.settingRow} data-last>
          <div className={styles.settingText}>
            <Text variant="label" as="h2" raw>
              {t('profile.language')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {`${currentLanguage?.label ?? 'English'} — English, Dutch, French and Spanish are available.`}
            </Text>
          </div>

          <Button label={t('acct.settings.change')} href="/account/language" variant="outline" size="sm" />
        </div>
      </Card>

      {/* ---- WHAT WE GET IN TOUCH ABOUT ---- */}
      <Card padded>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <Text variant="label" as="h2" raw>
            {t('notifications.title')}
          </Text>
          <ComingSoonBadge label={t('acct.pay.notConnected')} />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingText}>
            <Text variant="label" as="span" raw>
              {t('acct.settings.bookingEmails')}
            </Text>
            <Text variant="small" tone="ink3" raw>
              {t('acct.settings.bookingEmailsBody')}
            </Text>
          </div>
          <Toggle label={t('acct.settings.bookingEmails')} value={emailAlerts} onChange={setEmailAlerts} />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingText}>
            <Text variant="label" as="span" raw>
              {t('acct.settings.tripReminders')}
            </Text>
            <Text variant="small" tone="ink3" raw>
              {t('acct.settings.tripRemindersBody')}
            </Text>
          </div>
          <Toggle label={t('acct.settings.tripReminders')} value={tripReminders} onChange={setTripReminders} />
        </div>

        {/* The last row in the group, so no dividing line under it — the note
            that follows would otherwise sit directly on top of it. */}
        <div className={styles.settingRow} data-last>
          <div className={styles.settingText}>
            <Text variant="label" as="span" raw>
              {t('acct.settings.offers')}
            </Text>
            <Text variant="small" tone="ink3" raw>
              {t('acct.settings.offersBody')}
            </Text>
          </div>
          <Toggle label={t('acct.settings.offers')} value={offers} onChange={setOffers} />
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('acct.settings.switchesNote')}
          </Text>
        </div>
      </Card>

      {/* ---- ENDING THINGS ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('web.nav.account')}
        </Text>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button
            label={t('web.menu.signOut')}
            variant="outline"
            size="md"
            onClick={() => setSignOutOpen(true)}
          />
          {/* Red, and an actual button. It was a "ghost" before, which draws no
              background and no border at all — so the single most destructive
              action on the site rendered as plain text sitting next to a real
              button, looking like something that had failed to style. The
              confirmation step behind it is what stops an accidental click. */}
          <Button
            label={t('acct.settings.deleteAccount')}
            variant="danger"
            size="md"
            onClick={() => setDeleteOpen(true)}
          />
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('acct.settings.deleteNote')}
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

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('acct.settings.deleteTitle')}
        body={t('acct.settings.deleteBody')}
        confirmLabel="I understand"
        destructive
        onConfirm={() => setDeleteOpen(false)}
      />
    </div>
  );
}
