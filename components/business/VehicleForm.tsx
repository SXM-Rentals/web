'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The form for adding a vehicle or editing one already
// listed — photos, the price, how long it can be rented for, the deposit, where
// it is collected from, and anything the business declares about its history.
//
// ONE FORM SERVES BOTH JOBS, because a vehicle being added and a vehicle being
// edited need exactly the same fields. Two nearly-identical forms is how one of
// them quietly ends up missing a field the other has.
//
// TWO THINGS ON THIS FORM ARE NOT ORDINARY SETTINGS:
//
//   THE DEPOSIT is money that will be held against a customer's card and given
//   back. The wording here never calls it a fee or income, because a business
//   that thinks of it as revenue will price as though it is.
//
//   THE ACCIDENT HISTORY is declared by the business, and SXM Rentals does not
//   verify it. The form says so, and every listing repeats it, so nobody can
//   claim they thought the platform had checked.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { money, vehicleClassLabels, fuelLabels } from '@/lib/format';
import {
  Button,
  Card,
  Checkbox,
  Chip,
  ChipRow,
  Dialog,
  Icon,
  Input,
  PhotoPlaceholder,
  SegmentedControl,
  Text,
  TextArea,
  Toggle,
} from '@/components/ui';
import type { Vehicle, VehicleClass } from '@/types';
import styles from '@/app/provider/provider.module.css';
import { useTranslation } from '@/lib/i18n';

const CLASSES: VehicleClass[] = ['economy', 'compact', 'suv', 'van', 'fourByFour', 'luxury'];

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const { t } = useTranslation();
  const router = useRouter();
  const editing = Boolean(vehicle);

  // Everything starts from the vehicle being edited, or from sensible defaults
  // for a new one. Nothing is left undefined, so no field ever switches from
  // uncontrolled to controlled halfway through being typed in.
  const [make, setMake] = useState(vehicle?.make ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [year, setYear] = useState(String(vehicle?.year ?? ''));
  const [trim, setTrim] = useState(vehicle?.trim ?? '');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(
    vehicle?.vehicleClass ?? 'economy',
  );
  const [transmission, setTransmission] = useState(vehicle?.transmission ?? 'automatic');
  const [fuel, setFuel] = useState(vehicle?.fuel ?? 'petrol');
  const [seats, setSeats] = useState(String(vehicle?.seats ?? '5'));
  const [doors, setDoors] = useState(String(vehicle?.doors ?? '4'));
  const [airConditioning, setAirConditioning] = useState(vehicle?.airConditioning ?? true);

  const [dailyRate, setDailyRate] = useState(String(vehicle?.dailyRate ?? ''));
  const [weeklyRate, setWeeklyRate] = useState(String(vehicle?.weeklyRate ?? ''));
  const [minimumDays, setMinimumDays] = useState(String(vehicle?.minimumDays ?? '1'));
  const [maximumDays, setMaximumDays] = useState(String(vehicle?.maximumDays ?? '30'));
  const [depositAmount, setDepositAmount] = useState(String(vehicle?.depositAmount ?? ''));

  const [pickupTown, setPickupTown] = useState(vehicle?.pickupTown ?? '');
  const [side, setSide] = useState(vehicle?.side ?? 'dutch');
  const [deliveryAvailable, setDeliveryAvailable] = useState(
    vehicle?.deliveryAvailable ?? false,
  );
  const [deliveryFee, setDeliveryFee] = useState(String(vehicle?.deliveryFee ?? ''));

  const [description, setDescription] = useState(vehicle?.description ?? '');
  const [hasHistory, setHasHistory] = useState((vehicle?.accidentHistory.length ?? 0) > 0);
  const [historyNote, setHistoryNote] = useState(
    vehicle?.accidentHistory.map((record) => record.description).join('\n') ?? '',
  );
  const [historyDeclared, setHistoryDeclared] = useState(editing);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // What still has to be filled in before this can be saved, as a sentence
  // rather than a silently disabled button.
  const missing = (): string | null => {
    if (!make.trim() || !model.trim()) return 'Add the make and model.';
    if (!year.trim()) return 'Add the year.';
    if (!dailyRate.trim() || Number(dailyRate) <= 0) return 'Add a daily rate.';
    if (!depositAmount.trim()) return 'Add a security deposit amount.';
    if (!pickupTown.trim()) return 'Add the town the vehicle is collected from.';
    if (!historyDeclared)
      return 'Confirm whether this vehicle has any accident or damage history.';
    return null;
  };

  const blocked = missing();

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 700);
  };

  if (saved) {
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={38} color="var(--success)" />
        <Text variant="h2" as="h1">
          {editing ? 'Changes saved' : 'Vehicle added'}
        </Text>
        <Text variant="body" tone="ink2">
          {editing
            ? 'Your listing has been updated.'
            : 'It is not visible to customers yet. SXM Rentals staff check the registration and insurance documents before a vehicle goes live.'}
        </Text>
        <Text variant="small" tone="ink3" raw>
          {t('pp.import.demoNote')}
        </Text>

        <div className={styles.headActions}>
          <Button label="Back to your fleet" href="/provider/fleet" size="md" />
          {!editing ? (
            <Button
              label="Add another"
              variant="outline"
              size="md"
              onClick={() => router.refresh()}
            />
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* ---- PHOTOS ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            Photos
          </Text>
          <Text variant="small" tone="ink2">
            Four or five is plenty: the outside from the front and back, the inside, and
            the boot. Daylight, and a clean car.
          </Text>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-lg)',
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <PhotoPlaceholder key={index} shape="wide" iconSize={26} />
          ))}
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3">
            Photo uploading is not built yet. Listings currently show a placeholder in
            place of each photograph.
          </Text>
        </div>
      </Card>

      {/* ---- THE VEHICLE ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            The vehicle
          </Text>
        </div>

        <div className={styles.formGrid} style={{ marginTop: 'var(--space-lg)' }}>
          <Input label="Make" value={make} onChange={(e) => setMake(e.target.value)} required placeholder="Toyota" />
          <Input label="Model" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="RAV4" />
          <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="2023" />
          <Input label="Trim" value={trim} onChange={(e) => setTrim(e.target.value)} hint="Optional" placeholder="XLE" />
          <Input label={t('vehicle.seats')} type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
          <Input label={t('vehicle.doors')} type="number" value={doors} onChange={(e) => setDoors(e.target.value)} />
        </div>

        <div className={styles.formSection} style={{ marginTop: 'var(--space-xl)' }}>
          <div>
            <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
              {t('vehicle.class')}
            </Text>
            <ChipRow>
              {CLASSES.map((value) => (
                <Chip
                  key={value}
                  label={vehicleClassLabels[value]}
                  selected={vehicleClass === value}
                  onClick={() => setVehicleClass(value)}
                />
              ))}
            </ChipRow>
          </div>

          <div>
            <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
              {t('vehicle.transmission')}
            </Text>
            <SegmentedControl
              label={t('vehicle.transmission')}
              value={transmission}
              onChange={setTransmission}
              options={[
                { value: 'automatic', label: 'Automatic' },
                { value: 'manual', label: 'Manual' },
              ]}
            />
          </div>

          <div>
            <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
              {t('vehicle.fuel')}
            </Text>
            <ChipRow>
              {Object.entries(fuelLabels).map(([value, label]) => (
                <Chip
                  key={value}
                  label={label}
                  selected={fuel === value}
                  onClick={() => setFuel(value as typeof fuel)}
                />
              ))}
            </ChipRow>
          </div>

          <Checkbox
            checked={airConditioning}
            onChange={setAirConditioning}
            label="This vehicle has working air conditioning."
            hint="Worth being accurate about. It is the single most common complaint on the island."
          />
        </div>
      </Card>

      {/* ---- PRICE ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            Price and rental length
          </Text>
          <Text variant="small" tone="ink2">
            Set what the customer pays. SXM Rentals takes its commission from this, and
            your payout page shows the deduction on every line.
          </Text>
        </div>

        <div className={styles.formGrid} style={{ marginTop: 'var(--space-lg)' }}>
          <Input
            label="Daily rate (USD)"
            type="number"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
            required
            iconLeft="pricetag-outline"
            hint={
              dailyRate && Number(dailyRate) > 0
                ? `You receive about ${money(Number(dailyRate) * 0.7)} per day after commission.`
                : 'What the customer pays per day.'
            }
          />
          <Input
            label="Weekly rate (USD)"
            type="number"
            value={weeklyRate}
            onChange={(e) => setWeeklyRate(e.target.value)}
            hint="Optional. A cheaper rate for seven days or more."
          />
          <Input
            label="Minimum days"
            type="number"
            value={minimumDays}
            onChange={(e) => setMinimumDays(e.target.value)}
          />
          <Input
            label="Maximum days"
            type="number"
            value={maximumDays}
            onChange={(e) => setMaximumDays(e.target.value)}
          />
        </div>
      </Card>

      {/* ---- THE DEPOSIT ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            {t('vehicle.depositLabel')}
          </Text>
          <Text variant="small" tone="ink2">
            Held against the customer&rsquo;s card by SXM Rentals shortly before
            collection, and released after the vehicle comes back.
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)', maxWidth: 320 }}>
          <Input
            label="Deposit amount (USD)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
            iconLeft="shield-outline"
          />
        </div>

        {/* Said plainly, on the form where the number is set. */}
        <div className={styles.privacyNote} style={{ marginTop: 'var(--space-lg)' }}>
          <Icon name="shield-outline" size={19} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h3">
              A deposit is not income
            </Text>
            <Text variant="small" tone="ink2">
              This money is never charged, never yours, and never part of a payout. No
              commission is taken from it. It is set aside on the customer&rsquo;s card and
              given back — so set it to cover a realistic excess, not as a way to raise the
              price.
            </Text>
          </div>
        </div>
      </Card>

      {/* ---- WHERE IT IS COLLECTED ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            Collection and delivery
          </Text>
        </div>

        <div className={styles.formGrid} style={{ marginTop: 'var(--space-lg)' }}>
          <Input
            label="Collected from"
            value={pickupTown}
            onChange={(e) => setPickupTown(e.target.value)}
            required
            iconLeft="location-outline"
            placeholder="Simpson Bay"
          />

          <div>
            <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
              {t('pp.profile.sideOfIsland')}
            </Text>
            <SegmentedControl
              label={t('pp.profile.sideOfIsland')}
              fullWidth
              value={side}
              onChange={setSide}
              options={[
                { value: 'dutch', label: 'Dutch side' },
                { value: 'french', label: 'French side' },
              ]}
            />
          </div>
        </div>

        <div className={styles.formSection} style={{ marginTop: 'var(--space-xl)' }}>
          <div className={styles.infoRow}>
            <div>
              <Text variant="body" as="span">
                I can deliver this vehicle
              </Text>
              <Text variant="small" tone="ink3">
                To a hotel, an address, or the airport.
              </Text>
            </div>
            <Toggle
              label="I can deliver this vehicle"
              value={deliveryAvailable}
              onChange={setDeliveryAvailable}
            />
          </div>

          {deliveryAvailable ? (
            <div style={{ maxWidth: 320 }}>
              <Input
                label="Delivery fee (USD)"
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                hint="Leave empty if you do not charge for it. It is always shown to the customer before they pay."
              />
            </div>
          ) : null}
        </div>
      </Card>

      {/* ---- DESCRIPTION AND HISTORY ---- */}
      <Card padded>
        <div className={styles.formHead}>
          <Text variant="label" as="h2">
            Description and history
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <TextArea
            label={t('pp.profile.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={600}
            showCount
            rows={4}
            placeholder="What is this car good for? Where does it go well? Anything a visitor would not know."
          />
        </div>

        <div style={{ marginTop: 'var(--space-xl)' }} className={styles.formSection}>
          <Checkbox
            checked={hasHistory}
            onChange={setHasHistory}
            label="This vehicle has been in an accident or has damage history."
          />

          {hasHistory ? (
            <TextArea
              label="What happened"
              value={historyNote}
              onChange={(e) => setHistoryNote(e.target.value)}
              rows={3}
              maxLength={500}
              showCount
              placeholder="When it happened, what was damaged, and whether it has been repaired."
            />
          ) : null}

          {/* The declaration is a required tick, not an assumption. */}
          <Checkbox
            checked={historyDeclared}
            onChange={setHistoryDeclared}
            label={
              hasHistory
                ? 'I confirm the history above is accurate and complete.'
                : 'I confirm this vehicle has no accident or damage history to declare.'
            }
            hint="Shown on the listing as reported by you. SXM Rentals does not inspect vehicles or independently confirm this."
          />
        </div>
      </Card>

      {/* ---- SAVING ---- */}
      <Card padded>
        {blocked ? (
          <div className={styles.note} style={{ marginTop: 0, marginBottom: 'var(--space-md)' }}>
            <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
            <Text variant="small" tone="ink2">
              {blocked}
            </Text>
          </div>
        ) : null}

        <div className={styles.headActions}>
          <Button
            label={editing ? 'Save changes' : 'Add this vehicle'}
            size="md"
            loading={saving}
            disabled={Boolean(blocked)}
            onClick={save}
          />
          <Button label={t('common.cancel')} href="/provider/fleet" variant="outline" size="md" />

          {editing ? (
            <Button
              label="Remove this vehicle"
              variant="ghost"
              size="md"
              onClick={() => setDeleteOpen(true)}
            />
          ) : null}
        </div>
      </Card>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove this vehicle?"
        body="It will no longer be listed to customers. Bookings already made on it are not affected and still have to be honoured."
        confirmLabel="Remove it"
        destructive
        onConfirm={() => {
          setDeleteOpen(false);
          router.push('/provider/fleet');
        }}
      />
    </>
  );
}

export default VehicleForm;
