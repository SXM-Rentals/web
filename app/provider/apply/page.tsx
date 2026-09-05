'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Applying to list vehicles on SXM Rentals as a rental
// business.
//
// IT IS THREE SHORT STEPS RATHER THAN ONE LONG FORM. A single page asking for
// twenty things is where applications are abandoned; three pages of six are the
// same work and feel like progress. The step line at the top shows how much is
// left, so nobody is guessing.
//
// IT SAYS WHAT THE COMMISSION IS, ON THE PAGE, BEFORE ANYONE APPLIES. Roughly
// 30% to the platform and 70% to the business. Burying that until after somebody
// has filled in a form and uploaded documents would be a poor way to start a
// commercial relationship, and it is the first thing any rental company will
// want to know.

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  Checkbox,
  Icon,
  Input,
  SegmentedControl,
  StepIndicator,
  Text,
  TextArea,
} from '@/components/ui';
import { COMMISSION_RATE } from '@/lib/mock/business';
import styles from '../provider.module.css';
import authStyles from '@/app/(auth)/auth.module.css';
import { useTranslation } from '@/lib/i18n';

const STEPS = ['Your Business', 'Your Fleet', 'Confirm'];

export default function ProviderApplyPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step one — who the business is.
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [side, setSide] = useState<'dutch' | 'french' | 'both'>('dutch');
  const [registered, setRegistered] = useState<'registered' | 'not_registered'>('registered');

  // Step two — what they have.
  const [fleetSize, setFleetSize] = useState('1-5');
  const [hasSystem, setHasSystem] = useState<'yes' | 'no'>('no');
  const [about, setAbout] = useState('');

  // Step three — the agreements.
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCommission, setAgreedCommission] = useState(false);
  const [agreedDocuments, setAgreedDocuments] = useState(false);
  const [sending, setSending] = useState(false);

  const stepOneReady =
    businessName.trim() && contactName.trim() && email.trim() && phone.trim();
  const stepThreeReady = agreedTerms && agreedCommission && agreedDocuments;

  // ---- SENT ----
  if (done) {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <span className={`${authStyles.statusIcon} ${authStyles.statusApproved}`}>
            <Icon name="checkmark-circle-outline" size={38} />
          </span>
        </div>

        <div className={authStyles.head} style={{ textAlign: 'center', alignItems: 'center' }}>
          <Text variant="h1" as="h1" align="center" raw>
            {t('business.successTitle')}
          </Text>
          <Text variant="body" tone="ink2" align="center" raw>
            {t('pp.apply.inTouch')}
          </Text>
        </div>

        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('flow.done.whatNext')}
          </Text>

          <div className={styles.stack}>
            {[
              {
                icon: 'mail-outline' as const,
                title: 'We check your business registration',
                body: 'Confirming the company is real and trading. Usually a day or two.',
              },
              {
                icon: 'document-outline' as const,
                title: 'You send your vehicle documents',
                body: 'Registration and insurance for each vehicle. This is what the SXM Verified badge actually stands for.',
              },
              {
                icon: 'car-outline' as const,
                title: 'You add your fleet and go live',
                body: 'One at a time, from a spreadsheet, or connected straight to your own booking system.',
              },
            ].map((item) => (
              <div key={item.title} className={styles.note} style={{ marginTop: 0 }}>
                <Icon name={item.icon} size={18} color="var(--ink2)" />
                <div>
                  <Text variant="label" as="h3">
                    {item.title}
                  </Text>
                  <Text variant="small" tone="ink2">
                    {item.body}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Text variant="small" tone="ink3" align="center" raw>
          {t('pp.apply.demoNote')}
        </Text>

        <div className={authStyles.actions}>
          <Button label={t('pp.apply.seeDashboard')} href="/provider" fullWidth size="lg" />
          <Button label={t('pp.apply.backHome')} href="/" variant="ghost" size="md" fullWidth />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={authStyles.head}>
        <Text variant="h1" as="h1" raw>
          {t('pp.apply.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('pp.apply.subtitle')}
        </Text>
      </div>

      <StepIndicator current={step} steps={STEPS} />

      {/* ==================== STEP 1 ==================== */}
      {step === 1 ? (
        <Card padded>
          <div className={styles.formHead}>
            <Text variant="label" as="h2" raw>
              {t('web.provider.groupYours')}
            </Text>
          </div>

          <div className={styles.formSection} style={{ marginTop: 'var(--space-lg)' }}>
            <Input
              label={t('pp.apply.businessName')}
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              iconLeft="storefront-outline"
              required
            />

            <Input
              label={t('pp.apply.yourName')}
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              iconLeft="person-outline"
              hint="Whoever we should speak to about the application."
              required
            />

            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              iconLeft="mail-outline"
              required
            />

            <Input
              label={t('auth.phoneNumber')}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              iconLeft="call-outline"
              required
            />

            <div>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.apply.whereOperate')}
              </Text>
              <SegmentedControl
                label={t('pp.apply.whereOperate')}
                fullWidth
                value={side}
                onChange={setSide}
                options={[
                  { value: 'dutch', label: t('search.side.dutch') },
                  { value: 'french', label: t('search.side.french') },
                  { value: 'both', label: t('pp.apply.both') },
                ]}
              />
            </div>

            <div>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.apply.isRegistered')}
              </Text>
              <SegmentedControl
                label={t('pp.apply.isRegistered')}
                fullWidth
                value={registered}
                onChange={setRegistered}
                options={[
                  { value: 'registered', label: t('common.yes') },
                  { value: 'not_registered', label: t('pp.apply.notYet') },
                ]}
              />

              {registered === 'not_registered' ? (
                <div className={styles.note}>
                  <Icon name="information-circle-outline" size={15} color="var(--warning)" />
                  <Text variant="small" tone="ink2" raw>
                    {t('pp.apply.stillApply')}
                  </Text>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.headActions} style={{ marginTop: 'var(--space-xl)' }}>
            <Button
              label={t('common.continue')}
              size="md"
              disabled={!stepOneReady}
              onClick={() => setStep(2)}
            />
          </div>
        </Card>
      ) : null}

      {/* ==================== STEP 2 ==================== */}
      {step === 2 ? (
        <Card padded>
          <div className={styles.formHead}>
            <Text variant="label" as="h2" raw>
              {t('pp.apply.yourFleet')}
            </Text>
          </div>

          <div className={styles.formSection} style={{ marginTop: 'var(--space-lg)' }}>
            <div>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.apply.howMany')}
              </Text>
              <SegmentedControl
                label={t('pp.apply.howMany')}
                fullWidth
                value={fleetSize}
                onChange={setFleetSize}
                options={[
                  { value: '1-5', label: '1–5' },
                  { value: '6-20', label: '6–20' },
                  { value: '21+', label: '21+' },
                ]}
              />
            </div>

            <div>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.apply.alreadySoftware')}
              </Text>
              <SegmentedControl
                label={t('pp.apply.alreadySoftware')}
                fullWidth
                value={hasSystem}
                onChange={setHasSystem}
                options={[
                  { value: 'no', label: t('common.no') },
                  { value: 'yes', label: t('common.yes') },
                ]}
              />

              {hasSystem === 'yes' ? (
                <div className={styles.note}>
                  <Icon name="flash-outline" size={15} color="var(--success)" />
                  <Text variant="small" tone="ink2" raw>
                    {t('pp.apply.goodConnect')}
                  </Text>
                </div>
              ) : (
                <div className={styles.note}>
                  <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
                  <Text variant="small" tone="ink2">
                    That is fine. The dashboard covers everything — fleet, bookings,
                    availability and payouts — at no cost.
                  </Text>
                </div>
              )}
            </div>

            <TextArea
              label={t('pp.apply.anythingElse')}
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              rows={4}
              maxLength={500}
              showCount
              hint="Optional. How long you have been going, what you specialise in, anything unusual about how you operate."
            />
          </div>

          <div className={styles.headActions} style={{ marginTop: 'var(--space-xl)' }}>
            <Button label={t('common.back')} variant="outline" size="md" onClick={() => setStep(1)} />
            <Button label={t('common.continue')} size="md" onClick={() => setStep(3)} />
          </div>
        </Card>
      ) : null}

      {/* ==================== STEP 3 ==================== */}
      {step === 3 ? (
        <>
          {/* ---- THE COMMISSION, SAID PLAINLY ---- */}
          <Card padded>
            <div className={styles.formHead}>
              <Text variant="label" as="h2" raw>
                {t('pp.apply.howMoneyWorks')}
              </Text>
            </div>

            <div className={styles.infoRows} style={{ marginTop: 'var(--space-lg)' }}>
              <div className={styles.infoRow}>
                <Text variant="body" tone="ink2" as="span" raw>
                  {t('pp.apply.customerPays')}
                </Text>
                <Text variant="body" as="span" raw>
                  $100
                </Text>
              </div>
              <div className={styles.infoRow}>
                <Text variant="body" tone="ink2" as="span" raw>
                  {`SXM Rentals commission (${Math.round(COMMISSION_RATE * 100)}%)`}
                </Text>
                <Text variant="body" as="span" raw>
                  − $30
                </Text>
              </div>
              <div
                className={styles.infoRow}
                style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--hairline)' }}
              >
                <Text variant="label" as="span" raw>
                  {t('pp.apply.youReceive')}
                </Text>
                <Text variant="label" as="span" tone="success" raw>
                  $70
                </Text>
              </div>
            </div>

            <div className={styles.note}>
              <Icon name="checkmark-circle-outline" size={15} color="var(--success)" />
              <Text variant="small" tone="ink2" raw>
                {t('pp.apply.deductionShown')}
              </Text>
            </div>

            <div className={styles.note}>
              <Icon name="shield-outline" size={15} color="var(--ink2)" />
              <Text variant="small" tone="ink2">
                Security deposits are separate. They are held against the customer&rsquo;s
                card, no commission is taken from them, and they are never part of a
                payout.
              </Text>
            </div>

            <div className={styles.note}>
              <Icon name="lock-closed-outline" size={15} color="var(--ink2)" />
              <Text variant="small" tone="ink2" raw>
                {t('pp.apply.contactNotShared')}
              </Text>
            </div>
          </Card>

          <Card padded>
            <div className={styles.formSection}>
              <Checkbox
                checked={agreedCommission}
                onChange={setAgreedCommission}
                label={`I understand SXM Rentals takes approximately ${Math.round(
                  COMMISSION_RATE * 100,
                )}% commission on each booking.`}
              />

              <Checkbox
                checked={agreedDocuments}
                onChange={setAgreedDocuments}
                label={t('pp.apply.willProvideDocs')}
                hint="Nothing goes live until these have been checked."
              />

              <Checkbox
                checked={agreedTerms}
                onChange={setAgreedTerms}
                label={t('pp.apply.agreeTerms')}
              />
            </div>

            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <Link href="/legal/provider-terms" className={authStyles.link}>
                <Text variant="small" as="span" tone="brand" raw>
                  {t('footer.providerTerms')}
                </Text>
              </Link>
              <Link href="/legal/provider-commission" className={authStyles.link}>
                <Text variant="small" as="span" tone="brand">
                  Commission and Payout Agreement
                </Text>
              </Link>
            </div>

            <div className={styles.headActions} style={{ marginTop: 'var(--space-xl)' }}>
              <Button label={t('common.back')} variant="outline" size="md" onClick={() => setStep(2)} />
              <Button
                label={t('pp.apply.send')}
                size="md"
                loading={sending}
                disabled={!stepThreeReady}
                onClick={() => {
                  setSending(true);
                  window.setTimeout(() => {
                    setSending(false);
                    setDone(true);
                  }, 700);
                }}
              />
            </div>
          </Card>
        </>
      ) : null}
    </>
  );
}
