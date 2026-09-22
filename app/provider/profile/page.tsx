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
//
// ---- SAVING ----
//
// Changes go to the backend (PATCH /providers/me), and the record it hands
// back replaces the one on screen. Two things are shown rather than offered:
//
//   The business name, which the backend does not let a business change.
//
//   The town is chosen from the towns on the business's own side of the
//   island. The side itself cannot change, so a town on the other side would
//   leave the page saying one thing and the side filter another.
//
// If the public half could not be loaded, its boxes are not offered at all.
// Starting them empty and saving would have wiped the description that is
// really there.

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useBusiness, useOwnBusiness } from '@/lib/business';
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
import { TownPicker } from '@/components/business/TownPicker';
import styles from '../provider.module.css';
import { useTranslation } from '@/lib/i18n';

export default function ProviderSettingsPage() {
  const { t } = useTranslation();
  const { provider, profile } = useOwnBusiness();
  const { applyChanges } = useBusiness();

  const [description, setDescription] = useState(provider?.description ?? '');
  const [town, setTown] = useState(provider?.town ?? '');
  const [website, setWebsite] = useState(profile.website ?? '');
  const [delivers, setDelivers] = useState(profile.deliversVehicles);
  const [airport, setAirport] = useState(profile.airportPickup);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setProblem(null);
    try {
      const next = await apiClient.updateBusinessProfile({
        website: website.trim(),
        deliversVehicles: delivers,
        airportPickup: airport,
        // The public half only when it was loaded — see the top of the file.
        ...(provider ? { description: description.trim(), town } : {}),
      });
      applyChanges(next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (caught) {
      // Kept on the page, so nothing typed is lost.
      setProblem(isApiError(caught) ? caught.message : 'Your changes were not saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
      <LogoUpload businessName={provider?.businessName ?? ''} />

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
          {provider ? (
            <>
              <div className={styles.infoRow}>
                <div>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {t('pp.apply.businessName')}
                  </Text>
                  <Text variant="small" tone="ink3" raw>
                    {t('pp.profile.nameFixed')}
                  </Text>
                </div>
                <Text variant="label" as="span" className={styles.infoValue} raw>
                  {provider.businessName}
                </Text>
              </div>

              <TextArea
                label={t('pp.profile.description')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={500}
                showCount
                hint="What makes you worth renting from. Kept short — most people read a line or two."
              />
            </>
          ) : (
            <div className={styles.note} style={{ marginTop: 0 }}>
              <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
              <Text variant="small" tone="ink2" raw>
                {t('pp.profile.publicNotLoaded')}
              </Text>
            </div>
          )}

          <div className={styles.formGrid}>
            {provider ? (
              <TownPicker
                label={t('pp.profile.town')}
                value={town}
                onChange={(name) => setTown(name)}
                side={provider.side}
              />
            ) : null}
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
              {profile.locations.length > 0 ? profile.locations.join(', ') : '—'}
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
        {problem ? (
          <div className={styles.note} style={{ marginTop: 0, marginBottom: 'var(--space-md)' }} role="alert">
            <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

        <div className={styles.headActions}>
          <Button
            label={saved ? 'Saved' : 'Save changes'}
            size="md"
            loading={saving}
            iconLeft={saved ? <Icon name="checkmark" size={17} /> : undefined}
            onClick={save}
          />
        </div>
      </Card>
    </>
  );
}
