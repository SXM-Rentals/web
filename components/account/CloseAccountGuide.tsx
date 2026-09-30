'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The words on /account/close — the steps to close an
// account, what is removed and what is kept, what can stop it, and what to do
// without being able to sign in.
//
// ---- EVERY SENTENCE HERE IS WHAT THE BACKEND DOES ----
//
// Checked against its code on 2026-09-30 (backend c16671b): closing erases the
// phone number, replaces the email address (which frees it for a new account),
// cuts the surname down to an initial, ends every session, and keeps the first
// name and the rentals, because bookings, receipts and payouts to businesses
// point at them. If that changes, this page changes with it — it is what a
// person, and Google Play, will hold us to.
//
// The steps name the buttons by the same words the buttons use, looked up
// rather than retyped, so a renamed button cannot leave the steps pointing at
// something that is not there.

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth';
import { CONTACT_EMAIL } from '@/lib/social';
import { Button, Card, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import accountStyles from '@/app/(site)/account/account.module.css';
import styles from './CloseAccountGuide.module.css';

const SETTINGS = '/account/settings';

export function CloseAccountGuide() {
  const { t } = useTranslation();
  const { isSignedIn } = useSession();

  const steps = [
    t('acct.closeGuide.step1'),
    t('acct.closeGuide.step2')
      .replace('{account}', t('web.nav.account'))
      .replace('{settings}', t('web.nav.settings')),
    t('acct.closeGuide.step3')
      .replace('{section}', t('acct.close.title'))
      .replace('{button}', t('acct.close.button')),
    t('acct.closeGuide.step4').replace('{button}', t('acct.close.button')),
  ];

  // The address is a link inside the sentence, wherever each language puts it.
  const [writeBefore, writeAfter = ''] = t('acct.closeGuide.cantSignIn').split('{email}');

  const blockers = [
    t('acct.closeGuide.blockerRental'),
    t('acct.closeGuide.blockerDeposit'),
    t('acct.closeGuide.blockerBusiness').replace('{settings}', t('pp.settings.title')),
  ];

  return (
    <div className={accountStyles.page}>
      <div className={accountStyles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('acct.closeGuide.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.closeGuide.intro')}
        </Text>
      </div>

      {/* ---- HOW ---- */}
      <Card padded>
        <Text variant="label" as="h2" raw>
          {t('acct.closeGuide.stepsTitle')}
        </Text>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step}>
              <Text variant="body" as="span" raw>
                {step}
              </Text>
            </li>
          ))}
        </ol>
        <Text variant="small" tone="ink2" raw>
          {t('acct.closeGuide.inApp')}
        </Text>
        <div className={styles.actions}>
          {isSignedIn ? (
            <Button label={t('acct.closeGuide.toSettings')} href={SETTINGS} size="md" />
          ) : (
            <Button
              label={t('acct.closeGuide.signIn')}
              href={`/login?next=${encodeURIComponent(SETTINGS)}`}
              size="md"
            />
          )}
        </div>
      </Card>

      {/* ---- WHAT GOES, WHAT STAYS ---- */}
      <div className={styles.pair}>
        <Card padded>
          <Text variant="label" as="h2" raw>
            {t('acct.closeGuide.removedTitle')}
          </Text>
          <Text variant="body" tone="ink2" raw className={styles.gap}>
            {t('acct.closeGuide.removed')}
          </Text>
        </Card>
        <Card padded>
          <Text variant="label" as="h2" raw>
            {t('acct.closeGuide.keptTitle')}
          </Text>
          <Text variant="body" tone="ink2" raw className={styles.gap}>
            {t('acct.closeGuide.kept')}
          </Text>
        </Card>
      </div>
      <div className={accountStyles.note}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink2" raw>
          {t('acct.closeGuide.again')}
        </Text>
      </div>

      {/* ---- WHAT CAN STOP IT ---- */}
      <Card padded>
        <Text variant="label" as="h2" raw>
          {t('acct.closeGuide.blockersTitle')}
        </Text>
        <Text variant="body" tone="ink2" raw className={styles.gap}>
          {t('acct.closeGuide.blockersIntro')}
        </Text>
        <ul className={styles.blockers}>
          {blockers.map((blocker) => (
            <li key={blocker}>
              <Text variant="body" as="span" raw>
                {blocker}
              </Text>
            </li>
          ))}
        </ul>
      </Card>

      {/* ---- WITHOUT SIGNING IN ---- */}
      <Card padded>
        <Text variant="label" as="h2" raw>
          {t('acct.closeGuide.cantSignInTitle')}
        </Text>
        <Text variant="body" tone="ink2" raw className={styles.gap}>
          {writeBefore}
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
            {CONTACT_EMAIL}
          </a>
          {writeAfter}
        </Text>
        <div className={styles.actions}>
          <Button label={t('acct.closeGuide.resetPassword')} href="/forgot-password" variant="outline" size="md" />
        </div>
      </Card>

      <Text variant="small" tone="ink3" raw>
        {t('acct.closeGuide.privacy')}{' '}
        <Link href="/legal/privacy-policy" className={styles.link}>
          {t('acct.closeGuide.privacyLink')}
        </Link>
      </Text>
    </div>
  );
}

export default CloseAccountGuide;
