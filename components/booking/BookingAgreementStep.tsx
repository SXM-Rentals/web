'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Step 3 of the booking — reading and signing the rental
// agreement.
//
// THE TERMS ARE SHOWN, NOT LINKED. A link to a policy page in the middle of a
// booking is a link almost nobody follows, and "I agree to the terms" with the
// terms somewhere else is the weakest possible version of agreement. The clauses
// that actually affect this rental are on the page, in a box that scrolls, with
// the full policies linked underneath for anyone who wants them.
//
// THE PLACEHOLDER WORDING IS MARKED AS SUCH. A local attorney still has to write
// and approve the real text, and a draft that reads like a finished agreement is
// worse than one that admits it is a draft.
//
// ---- SIGNING IS NOT RECORDED YET ----
//
// The backend has nowhere to keep a signature: a booking carries
// `agreementSigned`, and nothing sets it. So this step says the signature is
// not kept, and that the business will ask for one at the counter, rather than
// promising a signed copy in an account that will not have one. Filed as an
// ask in docs/backend-asks.md.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dateRange, daysBetween, money } from '@/lib/format';
import { useTrip } from '@/lib/trip';
import { useQuote } from '@/hooks/useQuote';
import { useSession } from '@/lib/auth';
import { Button, Card, Checkbox, Icon, Text } from '@/components/ui';
import { BookingShell } from './BookingShell';
import { SignaturePad } from './SignaturePad';
import type { Vehicle } from '@/types';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function BookingAgreementStep({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { trip, hasDates } = useTrip();
  const { user } = useSession();
  const quote = useQuote(vehicle.id, trip);

  const [signed, setSigned] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const days = hasDates ? daysBetween(trip.startDate!, trip.endDate!) : vehicle.minimumDays;

  // The clauses that actually apply to this rental, filled in with its real
  // numbers rather than left as generic wording.
  const clauses: { heading: string; body: string }[] = [
    {
      heading: 'Who this agreement is between',
      body: `You${
        user ? `, ${user.firstName} ${user.lastName},` : ''
      } and the rental business listing this vehicle. SXM Rentals handles the booking, the payment and the messages between you, but the car is rented to you by the business.`,
    },
    {
      heading: 'The vehicle and the dates',
      body: `${vehicle.make} ${vehicle.model} ${vehicle.year}, for ${days} ${
        days === 1 ? 'day' : 'days'
      }${hasDates ? `, ${dateRange(trip.startDate!, trip.endDate!)}` : ''}.`,
    },
    {
      heading: 'The security deposit',
      body: `${money(
        quote.quote?.depositAmount ?? vehicle.depositAmount,
      )}, held on your card by SXM Rentals, through Stripe, from two days before pickup. It is not a charge, is not part of the rental price, and is released after the car is returned and checked.`,
    },
    {
      heading: 'Who may drive',
      body: 'Only you, and anyone else named on the booking who has passed the same licence check. Letting anyone else drive ends the cover on the vehicle.',
    },
    {
      heading: 'Damage, fuel and fines',
      body: 'The vehicle comes back in the condition it left in, with the same amount of fuel. Damage, missing fuel, a late return or a traffic fine may be taken from the deposit, and the business has to tell you why.',
    },
    {
      heading: 'Returning late',
      body: 'Let the business know through SXM Rentals if you are running late. An unannounced late return may be charged at the daily rate.',
    },
    {
      heading: 'Cancelling',
      body: 'You can cancel a rental that has not started, from the rental in your account. What you get back depends on how close to the start you cancel, under the Cancellation and Refund Policy.',
    },
  ];

  return (
    <BookingShell
      vehicle={vehicle}
      step={3}
      title={t('flow.step.agreement')}
      subtitle={t('flow.agreement.subtitle')}
      quote={quote}
      actions={
        <>
          <Button
            label={t('common.back')}
            href={`/booking/${vehicle.id}/payment`}
            variant="outline"
            size="md"
          />
          <Button
            label={t('flow.agreement.signAndContinue')}
            size="md"
            disabled={!signed || !agreed}
            onClick={() => router.push(`/booking/${vehicle.id}/confirm`)}
          />
        </>
      }
    >
      {/* ---- THE AGREEMENT ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.agreement.whatYouAgree')}
        </Text>

        <div className={styles.agreementBox} tabIndex={0} role="region" aria-label={t('flow.agreement.termsLabel')}>
          {clauses.map((clause, index) => (
            <div key={clause.heading} className={styles.clause}>
              <Text variant="label" as="h3" raw>
                {`${index + 1}. ${clause.heading}`}
              </Text>
              <Text variant="small" tone="ink2">
                {clause.body}
              </Text>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('flow.agreement.draftNote')}
            <Link href="/legal" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              {t('legal.title')}
            </Link>
            .
          </Text>
        </div>
      </Card>

      {/* ---- SIGNING ---- */}
      <Card>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('flow.agreement.yourSignature')}
        </Text>

        <SignaturePad
          onChange={setSigned}
          typedName={typedName}
          onTypedNameChange={setTypedName}
        />

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={t('flow.agreement.consent')}
          />
        </div>

        {/* Said where the signature is given, not buried at the end. */}
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('flow.agreement.notRecorded')}
          </Text>
        </div>
      </Card>
    </BookingShell>
  );
}
