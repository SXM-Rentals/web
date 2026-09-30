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
//
// ---- IT IS SENT FOR REAL, AND NEEDS AN ACCOUNT ----
//
// The application goes to the backend (POST /providers/apply), which links the
// new business to whoever is signed in — so the page asks somebody to sign in
// first, and comes back here afterwards. Somebody whose account already has a
// business is sent to its dashboard instead of being asked to register again.
//
// The backend needs three things the form did not use to ask: the registered
// (legal) name, the town the business is based in, and its side of the island,
// which comes with the town. It no longer asks whether the business already
// uses booking software, because nothing kept the answer.

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { isApiError, type FieldError } from '@/lib/api/errors';
import { useSession } from '@/lib/auth';
import { useBusiness } from '@/lib/business';
import { findTown } from '@/lib/content/towns';
import { RequireSignIn } from '@/components/layout/RequireSignIn';
import { TownPicker } from '@/components/business/TownPicker';
import {
  Button,
  Card,
  Checkbox,
  ErrorState,
  Icon,
  Input,
  SegmentedControl,
  Skeleton,
  StepIndicator,
  Text,
  TextArea,
} from '@/components/ui';
import { COMMISSION_RATE } from '@/lib/constants';
import styles from '../provider.module.css';
import authStyles from '@/app/(auth)/auth.module.css';
import { useTranslation } from '@/lib/i18n';

const STEPS = ['Your Business', 'Your Fleet', 'Confirm'];

// Enough of an email address to catch a slip. The backend has the last word.
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function ProviderApplyPage() {
  const { t } = useTranslation();
  return (
    <RequireSignIn title={t('pp.apply.signInTitle')} body={t('pp.apply.signInBody')}>
      <ApplyWhenSignedIn />
    </RequireSignIn>
  );
}

function ApplyWhenSignedIn() {
  const business = useBusiness();
  // Set once the application has gone through, so the thank-you stays on
  // screen while the business is looked up again behind it.
  const [applied, setApplied] = useState(false);

  if (applied) return <Applied />;

  if (business.loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="50%" />
        <Skeleton height={320} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (business.error) return <ErrorState message={business.error} onRetry={business.refresh} />;

  if (business.hasBusiness) return <AlreadyRegistered name={business.provider?.businessName} />;

  return (
    <ApplyForm
      onApplied={() => {
        setApplied(true);
        // So the dashboard knows about the new business straight away.
        business.refresh();
      }}
      // The backend says this account has a business already — most likely
      // registered from another tab. Asking again shows it.
      onAlreadyRegistered={business.refresh}
    />
  );
}

// ---- ALREADY A BUSINESS ----
function AlreadyRegistered({ name }: { name?: string }) {
  const { t } = useTranslation();
  return (
    <Card padded className={styles.stack}>
      <Icon name="storefront-outline" size={34} color="var(--brand)" />
      <Text variant="h2" as="h1" raw>
        {t('pp.apply.alreadyTitle')}
      </Text>
      <Text variant="body" tone="ink2" raw>
        {name
          ? t('pp.apply.alreadyBodyNamed').replace('{business}', name)
          : t('pp.apply.alreadyBody')}
      </Text>
      <div className={styles.headActions}>
        <Button label={t('pp.apply.seeDashboard')} href="/provider" size="md" />
      </div>
    </Card>
  );
}

// ---- SENT ----
function Applied() {
  const { t } = useTranslation();
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
              title: 'You add your cars from your dashboard',
              body: 'You can start now. Each car appears to customers once SXM Rentals has approved it.',
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

      <div className={authStyles.actions}>
        <Button label={t('pp.apply.seeDashboard')} href="/provider" fullWidth size="lg" />
        <Button label={t('pp.apply.backHome')} href="/" variant="ghost" size="md" fullWidth />
      </div>
    </>
  );
}

// ---- THE FORM ----
function ApplyForm({
  onApplied,
  onAlreadyRegistered,
}: {
  onApplied: () => void;
  onAlreadyRegistered: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useSession();
  const [step, setStep] = useState(1);

  // Step one — who the business is. The contact starts as the person signed
  // in, which is who it usually is; either can be changed.
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [contactName, setContactName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : '',
  );
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [townName, setTownName] = useState('');
  const [operatingSide, setOperatingSide] = useState<'dutch' | 'french' | 'both'>('dutch');
  const [registered, setRegistered] = useState<'registered' | 'not_registered'>('registered');

  // Step two — what they have.
  const [fleetSize, setFleetSize] = useState('1-5');
  const [about, setAbout] = useState('');

  // Step three — the agreements.
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCommission, setAgreedCommission] = useState(false);
  const [agreedDocuments, setAgreedDocuments] = useState(false);
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [fieldProblems, setFieldProblems] = useState<FieldError[]>([]);

  // What still has to be filled in on step one, as a sentence rather than a
  // silently disabled button.
  const stepOneMissing = (): string | null => {
    if (businessName.trim().length < 2) return 'Add the name customers know the business by.';
    if (legalName.trim().length < 2) return 'Add the registered name — or your own full name if it is not registered yet.';
    if (contactName.trim().length < 2) return 'Add the name of the person we should speak to.';
    if (!looksLikeEmail(email)) return 'Add an email address we can reach you at.';
    if (phone.trim().length < 5) return 'Add a phone number we can reach you on.';
    if (!findTown(townName)) return 'Choose the town the business is based in.';
    return null;
  };
  const stepOneBlocked = stepOneMissing();
  const stepThreeReady = agreedTerms && agreedCommission && agreedDocuments;

  const send = async () => {
    const town = findTown(townName);
    if (!town || stepOneBlocked || !stepThreeReady) return;

    setSending(true);
    setProblem(null);
    setFieldProblems([]);
    try {
      await apiClient.applyAsProvider({
        businessName: businessName.trim(),
        legalName: legalName.trim(),
        ownerName: contactName.trim(),
        contactEmail: email.trim(),
        ownerPhone: phone.trim(),
        town: town.name,
        side: town.side,
        operatingSide,
        registrationStatus: registered,
        fleetSizeBand: fleetSize,
        ...(about.trim() ? { description: about.trim() } : {}),
      });
      onApplied();
    } catch (caught) {
      if (isApiError(caught) && caught.code === 'already_a_provider') {
        onAlreadyRegistered();
        return;
      }
      // Kept on the form, so nothing typed is lost.
      setProblem(isApiError(caught) ? caught.message : 'Your application was not sent. Please try again.');
      setFieldProblems(isApiError(caught) ? caught.fieldErrors ?? [] : []);
    } finally {
      setSending(false);
    }
  };

  // The backend names fields its own way; these are the form's words for them.
  const FIELD_LABELS: Record<string, string> = {
    businessName: t('pp.apply.businessName'),
    legalName: t('pp.apply.legalName'),
    ownerName: t('pp.apply.yourName'),
    contactEmail: t('auth.email'),
    ownerPhone: t('auth.phoneNumber'),
    town: t('pp.apply.town'),
    description: t('pp.apply.aboutLabel'),
  };

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
              hint={t('pp.apply.businessNameHint')}
              required
            />

            <Input
              label={t('pp.apply.legalName')}
              value={legalName}
              onChange={(event) => setLegalName(event.target.value)}
              iconLeft="document-outline"
              hint={t('pp.apply.legalNameHint')}
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

            <TownPicker
              label={t('pp.apply.town')}
              value={townName}
              onChange={(name) => setTownName(name)}
              hint={t('pp.apply.townHint')}
              required
            />

            <div>
              <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
                {t('pp.apply.whereOperate')}
              </Text>
              <SegmentedControl
                label={t('pp.apply.whereOperate')}
                fullWidth
                value={operatingSide}
                onChange={setOperatingSide}
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

          {stepOneBlocked ? (
            <div className={styles.note} style={{ marginTop: 'var(--space-xl)' }}>
              <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
              <Text variant="small" tone="ink2" raw>
                {stepOneBlocked}
              </Text>
            </div>
          ) : null}

          <div className={styles.headActions} style={{ marginTop: 'var(--space-xl)' }}>
            <Button
              label={t('common.continue')}
              size="md"
              disabled={Boolean(stepOneBlocked)}
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

            <TextArea
              label={t('pp.apply.aboutLabel')}
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              rows={4}
              maxLength={500}
              showCount
              hint={t('pp.apply.aboutHint')}
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

            {problem ? (
              <div className={styles.note} style={{ marginTop: 'var(--space-xl)' }} role="alert">
                <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
                <div>
                  <Text variant="small" tone="ink2" raw>
                    {problem}
                  </Text>
                  {fieldProblems.map((entry) => (
                    <Text key={entry.field} variant="small" tone="ink3" raw>
                      {`${FIELD_LABELS[entry.field] ?? entry.field}: ${entry.message}`}
                    </Text>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.headActions} style={{ marginTop: 'var(--space-xl)' }}>
              <Button label={t('common.back')} variant="outline" size="md" onClick={() => setStep(2)} />
              <Button
                label={t('pp.apply.send')}
                size="md"
                loading={sending}
                disabled={!stepThreeReady}
                onClick={send}
              />
            </div>
          </Card>
        </>
      ) : null}
    </>
  );
}
