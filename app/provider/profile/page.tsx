'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A rental business's own profile — its name, description,
// where it operates, and what it offers.
//
// THIS IS NOT THE SETTINGS PAGE. It used to live at /provider/settings, which
// made it the obvious place to look for light/dark and language — and it holds
// neither. Those are at /provider/settings now; this is only what a customer
// sees about the business.
//
// THE PAGE IS SPLIT IN TWO, ON PURPOSE, and it says which half is which:
//
//   PUBLIC — what any customer can see on the business page. Name, description,
//   rating, whether it delivers.
//
//   PRIVATE — registration details, locations, the API connection. Never shown
//   to a customer.
//
// That split is not just a heading here. The two halves live on two different
// records in the code — Provider for the public half, BusinessProfile for the
// private one — and the public business page has no access to the second. That
// is what guarantees a business's earnings and registration details cannot leak
// onto a customer-facing page by accident: they were never handed to it.

import React, { useState } from 'react';
import { useBusiness } from '@/lib/business';
import { longDate, sideLabels } from '@/lib/format';
import {
  Button,
  Card,
  Icon,
  Input,
  StatusPill,
  Text,
  TextArea,
  Toggle,
} from '@/components/ui';
import { LogoUpload } from '@/components/business/LogoUpload';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderSettingsPage() {
  const { t } = useTranslation();
  const { provider, profile } = useBusiness();

  const [businessName, setBusinessName] = useState(provider?.businessName ?? '');
  const [description, setDescription] = useState(provider?.description ?? '');
  const [town, setTown] = useState(provider?.town ?? '');
  const [website, setWebsite] = useState(profile.website ?? '');
  const [delivers, setDelivers] = useState(profile.deliversVehicles);
  const [airport, setAirport] = useState(profile.airportPickup);
  const [saved, setSaved] = useState(false);

  const registrationLook = {
    registered: { label: 'REGISTERED', tone: 'success' as const },
    pending: { label: 'BEING CHECKED', tone: 'warning' as const },
    not_registered: { label: 'NOT REGISTERED', tone: 'neutral' as const },
  }[profile.registrationStatus];

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('pp.profile.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.profile.subtitle')}
          </Text>
        </div>

        <div className={styles.headActions}>
          {provider ? (
            <Button
              label={t('pp.profile.viewPublic')}
              href={`/providers/${provider.id}`}
              variant="outline"
              size="sm"
            />
          ) : null}
        </div>
      </div>

      {/* ==================== PUBLIC ==================== */}
      {/* The logo comes first, because it is the most visible thing a customer
          sees about a business — on its page, on every listing, and beside its
          name in messages. */}
      <LogoUpload businessName={businessName} />

      <Card padded>
        <div className={styles.formHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Icon name="globe-outline" size={18} />
            <Text variant="label" as="h2" raw>
              {t('pp.profile.whatCustomersSee')}
            </Text>
          </div>
          <Text variant="small" tone="ink2" raw>
            {t('pp.profile.appearsOnPage')}
          </Text>
        </div>

        <div className={styles.formSection} style={{ marginTop: 'var(--space-lg)' }}>
          <Input
            label={t('pp.apply.businessName')}
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            iconLeft="storefront-outline"
          />

          <TextArea
            label={t('pp.profile.description')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={500}
            showCount
            hint="What makes you worth renting from. Kept short — most people read a line or two."
          />

          <div className={styles.formGrid}>
            <Input
              label={t('pp.profile.town')}
              value={town}
              onChange={(event) => setTown(event.target.value)}
              iconLeft="location-outline"
            />
            <Input
              label={t('pp.profile.website')}
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              hint="Optional"
              placeholder="https://"
            />
          </div>

          <div className={styles.infoRow}>
            <div>
              <Text variant="body" as="span" raw>
                {t('pp.profile.weDeliver')}
              </Text>
              <Text variant="small" tone="ink3" raw>
                {t('pp.profile.weDeliverNote')}
              </Text>
            </div>
            <Toggle label={t('pp.profile.weDeliver')} value={delivers} onChange={setDelivers} />
          </div>

          <div className={styles.infoRow}>
            <div>
              <Text variant="body" as="span" raw>
                {t('pp.profile.airport')}
              </Text>
              <Text variant="small" tone="ink3" raw>
                {t('pp.profile.airportNote')}
              </Text>
            </div>
            <Toggle
              label={t('pp.profile.airport')}
              value={airport}
              onChange={setAirport}
            />
          </div>
        </div>
      </Card>

      {/* ---- WHAT CUSTOMERS SEE THAT YOU DO NOT SET ---- */}
      {provider ? (
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-lg)' }} raw>
            {t('pp.profile.alsoPublic')}
          </Text>

          <div className={styles.infoRows}>
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span">
                Rating
              </Text>
              <Text variant="body" as="span" raw>
                {`${provider.rating.toFixed(1)} from ${provider.reviewCount} reviews`}
              </Text>
            </div>

            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span">
                SXM Verified
              </Text>
              <StatusPill
                label={provider.isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                tone={provider.isVerified ? 'success' : 'neutral'}
              />
            </div>

            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.profile.sideOfIsland')}
              </Text>
              <Text variant="body" as="span" raw>
                {sideLabels[provider.side]}
              </Text>
            </div>

            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.profile.memberSince')}
              </Text>
              <Text variant="body" as="span" raw>
                {longDate(provider.memberSince)}
              </Text>
            </div>
          </div>

          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('pp.profile.setByUs')}
            </Text>
          </div>
        </Card>
      ) : null}

      {/* ==================== PRIVATE ==================== */}
      <Card padded>
        <div className={styles.formHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Icon name="lock-closed-outline" size={18} />
            <Text variant="label" as="h2" raw>
              {t('pp.profile.betweenUs')}
            </Text>
          </div>
          <Text variant="small" tone="ink2" raw>
            {t('pp.profile.notShownToCustomers')}
          </Text>
        </div>

        <div className={styles.infoRows} style={{ marginTop: 'var(--space-lg)' }}>
          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('pp.profile.registeredName')}
            </Text>
            <Text variant="body" as="span" className={styles.infoValue} raw>
              {profile.legalName}
            </Text>
          </div>

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span">
              Registration
            </Text>
            <StatusPill label={registrationLook.label} tone={registrationLook.tone} />
          </div>

          {profile.registeredIn ? (
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.profile.registeredIn')}
              </Text>
              <Text variant="body" as="span" raw>
                {profile.registeredIn}
              </Text>
            </div>
          ) : null}

          {profile.registrationNumber ? (
            <div className={styles.infoRow}>
              <Text variant="body" tone="ink2" as="span" raw>
                {t('pp.profile.registrationNumber')}
              </Text>
              <Text variant="body" as="span" raw>
                {profile.registrationNumber}
              </Text>
            </div>
          ) : null}

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span">
              Operating
            </Text>
            <Text variant="body" as="span" raw>
              {profile.operatingSide === 'both'
                ? 'Both sides of the island'
                : sideLabels[profile.operatingSide]}
            </Text>
          </div>

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span">
              Locations
            </Text>
            <Text variant="body" as="span" className={styles.infoValue} raw>
              {profile.locations.join(', ')}
            </Text>
          </div>

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('pp.profile.fleetBand')}
            </Text>
            <Text variant="body" as="span" raw>
              {profile.fleetSizeBand}
            </Text>
          </div>

          <div className={styles.infoRow}>
            <Text variant="body" tone="ink2" as="span" raw>
              {t('pp.profile.ownSystem')}
            </Text>
            <StatusPill
              label={profile.apiConnected ? 'CONNECTED' : 'NOT CONNECTED'}
              tone={profile.apiConnected ? 'success' : 'neutral'}
            />
          </div>
        </div>

        <div className={styles.headActions} style={{ marginTop: 'var(--space-lg)' }}>
          <Button
            label="Connect your system"
            href="/provider/fleet/api"
            variant="outline"
            size="sm"
          />
        </div>
      </Card>

      {/* ---- PAYOUT ACCOUNT ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2" raw>
            {t('pp.profile.whereYouGetPaid')}
          </Text>
        </div>

        <div className={styles.note} style={{ marginTop: 'var(--space-lg)' }}>
          <Icon name="card-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('pp.profile.stripeNote')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={16} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.profile.notConnected')}
          </Text>
        </div>
      </Card>

      <Card padded>
        <div className={styles.headActions}>
          <Button
            label={saved ? 'Saved' : 'Save changes'}
            size="md"
            iconLeft={saved ? <Icon name="checkmark" size={17} /> : undefined}
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 2500);
            }}
          />
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('pp.profile.demoNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
