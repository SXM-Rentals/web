'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The blocks that make up a car's page — the grid of
// features, the rental business behind it, the security deposit, the accident
// history, and how long the car can be rented for.
//
// TWO OF THESE CARRY RULES RATHER THAN JUST INFORMATION:
//
//   DepositBlock  — the deposit is money HELD and given back, never a charge.
//                   The wording never calls it a fee or adds it to a price.
//   AccidentBlock — SXM Rentals does not inspect these cars. The history comes
//                   from the business, and the block says so every time, whether
//                   there is history to show or not.

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  Divider,
  Icon,
  Sheet,
  StatusPill,
  StarRow,
  Text,
  Avatar,
} from '@/components/ui';
import type { IconName } from '@/components/ui';
import { VerifiedBadge } from './VerifiedBadge';
import {
  money,
  longDate,
  fuelLabels,
  transmissionLabels,
  vehicleClassLabels,
  sideLabels,
} from '@/lib/format';
import type { Provider, Vehicle } from '@/types';
import styles from './VehicleDetails.module.css';
import { useTranslation } from '@/lib/i18n';

// ---- THE FEATURE GRID ----
export function FeatureGrid({ vehicle }: { vehicle: Vehicle }) {
  const features: { icon: IconName; label: string; value: string }[] = [
    { icon: 'people-outline', label: 'Seats', value: `${vehicle.seats}` },
    { icon: 'settings-outline', label: 'Gearbox', value: transmissionLabels[vehicle.transmission] },
    { icon: 'water-outline', label: 'Fuel', value: fuelLabels[vehicle.fuel] },
    { icon: 'car-outline', label: 'Doors', value: `${vehicle.doors}` },
    { icon: 'snow-outline', label: 'Air con', value: vehicle.airConditioning ? 'Yes' : 'No' },
    { icon: 'pricetag-outline', label: 'Class', value: vehicleClassLabels[vehicle.vehicleClass] },
  ];

  return (
    <div className={styles.features}>
      {features.map((feature) => (
        <div key={feature.label} className={styles.feature}>
          <span className={styles.featureIcon}>
            <Icon name={feature.icon} size={17} />
          </span>
          <Text variant="small" tone="ink2" as="span">
            {feature.label}
          </Text>
          <Text variant="label" as="span" className={styles.featureValue} raw>
            {feature.value}
          </Text>
        </div>
      ))}
    </div>
  );
}

// ---- THE RENTAL BUSINESS ----
// Opens their page, where every car they have is listed. That is the obvious
// next question after liking one car.
export function ProviderRow({ provider }: { provider: Provider }) {
  const { t } = useTranslation();
  return (
    <div className={styles.provider}>
      <Avatar name={provider.businessName} size={48} tone="brand" />

      <div className={styles.providerBody}>
        <span className={styles.providerName}>
          <Text variant="label" as="span" raw>
            <Link href={`/providers/${provider.id}`}>{provider.businessName}</Link>
          </Text>
          {provider.isVerified ? <VerifiedBadge /> : null}
        </span>

        <span className={styles.providerMeta}>
          <StarRow rating={provider.rating} reviewCount={provider.reviewCount} size={13} />
          <Text variant="small" tone="ink3" as="span">
            {sideLabels[provider.side]} · {provider.town}
          </Text>
        </span>

        <Text variant="small" tone="ink2">
          {provider.respondsIn}
        </Text>
      </div>

      <Button label={t('vehicle.viewFleet')} href={`/providers/${provider.id}`} variant="outline" size="sm" />
    </div>
  );
}

// ---- THE SECURITY DEPOSIT ----
// The rule this block exists to hold: a deposit is HELD against a card and given
// back. It is not a charge, it is never added into any total, and no commission
// is taken from it. Every word here is chosen to make that unambiguous.
export function DepositBlock({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const [explainerOpen, setExplainerOpen] = useState(false);

  const points: { icon: IconName; title: string; body: string }[] = [
    {
      icon: 'lock-closed-outline',
      title: 'It is held, not taken',
      body: `Your card is authorised for ${money(
        vehicle.depositAmount,
      )}. The money stays yours — your bank simply sets it aside so it cannot be spent elsewhere.`,
    },
    {
      icon: 'calendar-outline',
      title: 'When it happens',
      body: 'The hold is placed shortly before you collect the car, not when you book.',
    },
    {
      icon: 'checkmark-circle-outline',
      title: 'Getting it back',
      body: 'Once the car is returned and checked, the hold is released. Banks usually free the money within a few working days.',
    },
    {
      icon: 'alert-circle-outline',
      title: 'When money is taken from it',
      body: 'Only for damage, a late return, missing fuel or a traffic fine — and the business has to tell you why. You can dispute it.',
    },
  ];

  return (
    <>
      <Card>
        <div className={styles.deposit}>
          <Icon name="shield-outline" size={22} />

          <div className={styles.depositBody}>
            <div className={styles.depositHead}>
              <Text variant="label" as="h3">
                {t('vehicle.depositLabel')}
              </Text>
              <Text variant="h3" as="span" raw>
                {money(vehicle.depositAmount)}
              </Text>
            </div>

            <Text variant="small" tone="ink2" raw>
              {t('vehicle.deposit.shortBody')}
              {t('vehicle.deposit.notACharge')}
            </Text>

            {/* Some cars carry their own deposit rather than the standard one. */}
            {vehicle.depositIsVehicleSpecific ? (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <StatusPill label={t('vehicle.deposit.setForVehicle')} tone="neutral" />
              </div>
            ) : null}

            <button
              type="button"
              className={styles.depositLink}
              onClick={() => setExplainerOpen(true)}
            >
              {t('vehicle.deposit.howItWorks')}
            </button>
          </div>
        </div>
      </Card>

      <Sheet
        open={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        title={t('vehicle.deposit.howItWorks')}
        footer={<Button label={t('vehicle.deposit.gotIt')} size="md" onClick={() => setExplainerOpen(false)} />}
      >
        {points.map((point) => (
          <div key={point.title} className={styles.explainerItem}>
            <Icon name={point.icon} size={22} />
            <div>
              <Text variant="label" as="h4">
                {point.title}
              </Text>
              <Text variant="body" tone="ink2">
                {point.body}
              </Text>
            </div>
          </div>
        ))}

        <Divider style={{ marginBottom: 'var(--space-lg)' }} />

        <Link href="/legal/security-deposit" className={styles.depositLink}>
          {t('vehicle.deposit.readPolicy')}
        </Link>
      </Sheet>
    </>
  );
}

// ---- ACCIDENT AND DAMAGE HISTORY ----
// The wording here matters: SXM Rentals does not inspect these cars, so the page
// is explicit that this comes from the rental business, not from us. The
// disclaimer appears whether or not there is any history — "none reported" is
// also a claim by the business, not a finding of ours.
export function AccidentBlock({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const hasHistory = vehicle.accidentHistory.length > 0;

  return (
    <Card>
      <div className={styles.accidentHead}>
        <Icon
          name={hasHistory ? 'warning-outline' : 'checkmark-circle-outline'}
          size={20}
          color={hasHistory ? 'var(--warning)' : 'var(--success)'}
        />
        <Text variant="label" as="h3" raw>
          {t('vehicle.accidentHistory')}
        </Text>
      </div>

      {hasHistory ? (
        vehicle.accidentHistory.map((record, index) => (
          <div key={`${record.date}-${index}`} className={styles.accidentRecord}>
            <Text variant="small" tone="ink3">
              {longDate(record.date)}
            </Text>
            <Text variant="body" tone="ink2">
              {record.description}
            </Text>
            {record.repaired ? (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <StatusPill label={t('vehicle.accidents.repaired')} tone="success" />
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <Text variant="body" tone="ink2" raw>
          {t('vehicle.accidents.none')}
        </Text>
      )}

      <div className={styles.disclaimer}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3" raw>
          {t('vehicle.accidents.disclaimer')}
        </Text>
      </div>
    </Card>
  );
}

// ---- HOW LONG THE CAR CAN BE BOOKED FOR ----
export function RentalPeriod({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  return (
    <Card>
      <Text variant="label" as="h3" style={{ marginBottom: 'var(--space-md)' }} raw>
        {t('vehicle.rentalPeriod')}
      </Text>

      <div className={styles.periodRow}>
        <div>
          <Text variant="small" tone="ink2" raw>
            {t('vehicle.minimum')}
          </Text>
          <Text variant="label" raw>
            {`${vehicle.minimumDays} ${vehicle.minimumDays === 1 ? 'day' : 'days'}`}
          </Text>
        </div>

        <div className={styles.periodEnd}>
          <Text variant="small" tone="ink2" raw>
            {t('vehicle.maximum')}
          </Text>
          <Text variant="label" raw>
            {`${vehicle.maximumDays} days`}
          </Text>
        </div>
      </div>

      {/* The weekly price only appears when the business offers one. */}
      {vehicle.weeklyRate ? (
        <div className={styles.weekly}>
          <Text variant="small" tone="ink2" raw>
            {t('vehicle.weeklyRate')}
          </Text>
          <Text variant="label" raw>
            {`${money(vehicle.weeklyRate)} per week`}
            <Text variant="small" tone="success" as="span" className={styles.saving}>
              {`save ${money(vehicle.dailyRate * 7 - vehicle.weeklyRate)}`}
            </Text>
          </Text>
        </div>
      ) : null}
    </Card>
  );
}
