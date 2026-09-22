'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The form for adding a vehicle or editing one already
// listed — the price, how long it can be rented for, the deposit, and where it
// is collected from — saved to the backend.
//
// ONE FORM SERVES BOTH JOBS, because a vehicle being added and a vehicle being
// edited need the same fields. Two nearly-identical forms is how one of them
// quietly ends up missing a field the other has.
//
// THE DEPOSIT IS NOT AN ORDINARY SETTING. It is money held against a
// customer's card and given back. The wording here never calls it a fee or
// income, because a business that thinks of it as revenue will price as
// though it is.
//
// ---- WHAT EDITING CAN AND CANNOT CHANGE ----
//
// The backend changes the price, the rental length, the deposit, the seats and
// doors, air conditioning, delivery and the description of a listed car. It
// does not change what the car IS — make, model, year, class, gearbox, fuel —
// and changing where it is collected from would move the town's name without
// moving its side of the island or its place on the map. So when editing,
// those are shown, not offered: a box that looks editable and then does not
// save is worse than no box.
//
// ---- WHAT THIS FORM NO LONGER ASKS ----
//
// A delivery fee and the car's accident history. The form used to ask for
// both, and the backend has nowhere to keep either, so both went nowhere. It
// says so instead (backend ask 6 in docs/backend-asks.md). The accident history
// matters most: a customer reading an empty history takes it to mean "no
// accidents", so it is not collected until it can be kept and shown.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError, type FieldError } from '@/lib/api/errors';
import { COMMISSION_RATE } from '@/lib/constants';
import { findTown } from '@/lib/content/towns';
import { money, sideLabels, vehicleClassLabels, fuelLabels } from '@/lib/format';
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
  useToast,
} from '@/components/ui';
import { TownPicker } from '@/components/business/TownPicker';
import type { FleetVehicle, VehicleClass, VehicleInput } from '@/types';
import styles from '@/app/provider/provider.module.css';
import { useTranslation } from '@/lib/i18n';

const CLASSES: VehicleClass[] = ['economy', 'compact', 'suv', 'van', 'fourByFour', 'luxury'];

// The backend's own limits, checked here first so a slip is caught on the
// form, with a sentence, rather than coming back as a refusal.
const LATEST_YEAR = new Date().getFullYear() + 2;
const isWhole = (text: string, low: number, high: number) => {
  const value = Number(text);
  return text.trim() !== '' && Number.isInteger(value) && value >= low && value <= high;
};
const isAmount = (text: string, low: number, high: number, allowZero = false) => {
  const value = Number(text);
  return text.trim() !== '' && Number.isFinite(value) && (allowZero ? value >= low : value > low) && value <= high;
};

export function VehicleForm({ vehicle }: { vehicle?: FleetVehicle }) {
  // "Add another" needs an empty form. Changing the key throws the old one
  // away whole, rather than resetting twenty fields one by one and missing one.
  const [round, setRound] = useState(0);
  return (
    <VehicleFormBody key={round} vehicle={vehicle} onAddAnother={() => setRound((count) => count + 1)} />
  );
}

function VehicleFormBody({
  vehicle,
  onAddAnother,
}: {
  vehicle?: FleetVehicle;
  onAddAnother: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
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

  const [townName, setTownName] = useState(vehicle?.pickupTown ?? '');
  const [deliveryAvailable, setDeliveryAvailable] = useState(
    vehicle?.deliveryAvailable ?? false,
  );
  const [description, setDescription] = useState(vehicle?.description ?? '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<FleetVehicle | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [fieldProblems, setFieldProblems] = useState<FieldError[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeProblem, setRemoveProblem] = useState<string | null>(null);

  // What still has to be put right before this can be saved, as a sentence
  // rather than a silently disabled button.
  const missing = (): string | null => {
    if (!editing) {
      if (!make.trim() || !model.trim()) return 'Add the make and model.';
      if (!isWhole(year, 1950, LATEST_YEAR)) return `Add the year, between 1950 and ${LATEST_YEAR}.`;
    }
    if (!isWhole(seats, 1, 20)) return 'Seats should be a whole number from 1 to 20.';
    if (!isWhole(doors, 1, 8)) return 'Doors should be a whole number from 1 to 8.';
    if (!isAmount(dailyRate, 0, 10_000)) return 'Add a daily rate, up to $10,000.';
    if (weeklyRate.trim() && !isAmount(weeklyRate, 0, 70_000)) {
      return 'The weekly rate should be more than $0, or left empty.';
    }
    // The backend can change a weekly rate but has no way to take one away.
    if (editing && vehicle?.weeklyRate && !weeklyRate.trim()) {
      return 'A weekly rate cannot be removed yet, only changed.';
    }
    if (!isWhole(minimumDays, 1, 365) || !isWhole(maximumDays, 1, 365)) {
      return 'The minimum and maximum days should be whole numbers from 1 to 365.';
    }
    if (Number(minimumDays) > Number(maximumDays)) {
      return 'The minimum number of days is more than the maximum.';
    }
    if (!isAmount(depositAmount, 0, 100_000, true)) return 'Add a security deposit amount.';
    if (!editing && !findTown(townName)) return 'Choose where the vehicle is collected from.';
    return null;
  };

  const blocked = missing();

  // A new car: everything. The town brings its side and map position with it.
  const newVehicle = (): VehicleInput => {
    const town = findTown(townName)!;
    return {
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      ...(trim.trim() ? { trim: trim.trim() } : {}),
      vehicleClass,
      transmission,
      fuel,
      seats: Number(seats),
      doors: Number(doors),
      airConditioning,
      dailyRate: Number(dailyRate),
      ...(weeklyRate.trim() ? { weeklyRate: Number(weeklyRate) } : {}),
      minimumDays: Number(minimumDays),
      maximumDays: Number(maximumDays),
      depositAmount: Number(depositAmount),
      pickupTown: town.name,
      side: town.side,
      latitude: town.latitude,
      longitude: town.longitude,
      deliveryAvailable,
      ...(description.trim() ? { description: description.trim() } : {}),
    };
  };

  // A listed car: only what the backend will change (see the top of the file).
  const changes = (): Partial<VehicleInput> => ({
    trim: trim.trim(),
    seats: Number(seats),
    doors: Number(doors),
    airConditioning,
    dailyRate: Number(dailyRate),
    ...(weeklyRate.trim() ? { weeklyRate: Number(weeklyRate) } : {}),
    minimumDays: Number(minimumDays),
    maximumDays: Number(maximumDays),
    depositAmount: Number(depositAmount),
    deliveryAvailable,
    description: description.trim(),
  });

  const save = async () => {
    if (blocked || saving) return;
    setSaving(true);
    setProblem(null);
    setFieldProblems([]);
    try {
      const result = vehicle
        ? await apiClient.updateVehicle(vehicle.id, changes())
        : await apiClient.addVehicle(newVehicle());
      setSaved(result);
      window.scrollTo({ top: 0 });
    } catch (caught) {
      // Kept on the form, so nothing typed is lost.
      if (isApiError(caught)) {
        setProblem(caught.message);
        setFieldProblems(caught.fieldErrors ?? []);
      } else {
        setProblem('The vehicle was not saved. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!vehicle) return;
    setRemoving(true);
    setRemoveProblem(null);
    try {
      await apiClient.removeVehicle(vehicle.id);
      showToast('Vehicle removed', `${vehicle.make} ${vehicle.model} is no longer listed.`);
      router.push('/provider/fleet');
    } catch (caught) {
      // Most often: it has a rental coming up. The backend says so in words.
      setDeleteOpen(false);
      setRemoveProblem(
        isApiError(caught) ? caught.message : 'The vehicle was not removed. Please try again.',
      );
    } finally {
      setRemoving(false);
    }
  };

  if (saved) {
    const name = `${saved.make} ${saved.model}`;
    return (
      <Card padded className={styles.stack}>
        <Icon name="checkmark-circle-outline" size={38} color="var(--success)" />
        <Text variant="h2" as="h1" raw>
          {editing ? t('pp.vform.savedTitle') : t('pp.vform.submittedTitle')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {editing
            ? t('pp.vform.savedBody')
            : t('pp.vform.submittedBody').replace('{name}', name)}
        </Text>

        <div className={styles.headActions}>
          <Button label={t('pp.vform.backToFleet')} href="/provider/fleet" size="md" />
          {!editing ? (
            <Button label={t('pp.vform.addAnother')} variant="outline" size="md" onClick={onAddAnother} />
          ) : null}
        </div>
      </Card>
    );
  }

  // What went wrong with a field, by the name the backend gave it.
  const fieldProblem = (field: string) =>
    fieldProblems.find((entry) => entry.field === field)?.message;

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

        {editing && vehicle ? (
          // What the car is, fixed once it is listed.
          <>
            <div className={styles.infoRows} style={{ marginTop: 'var(--space-lg)' }}>
              {[
                { label: 'Make and model', value: `${vehicle.make} ${vehicle.model}` },
                { label: 'Year', value: String(vehicle.year) },
                { label: t('vehicle.class'), value: vehicleClassLabels[vehicle.vehicleClass] },
                { label: t('vehicle.transmission'), value: vehicle.transmission === 'manual' ? 'Manual' : 'Automatic' },
                { label: t('vehicle.fuel'), value: fuelLabels[vehicle.fuel] },
                { label: t('pp.vform.collectedFrom'), value: `${vehicle.pickupTown}, ${sideLabels[vehicle.side]}` },
              ].map((row) => (
                <div key={row.label} className={styles.infoRow}>
                  <Text variant="body" tone="ink2" as="span" raw>
                    {row.label}
                  </Text>
                  <Text variant="body" as="span" className={styles.infoValue} raw>
                    {row.value}
                  </Text>
                </div>
              ))}
            </div>

            <div className={styles.note}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('pp.vform.fixedNote')}
              </Text>
            </div>

            <div className={styles.formGrid} style={{ marginTop: 'var(--space-lg)' }}>
              <Input label="Trim" value={trim} onChange={(e) => setTrim(e.target.value)} hint="Optional" placeholder="XLE" error={fieldProblem('trim')} />
              <Input label={t('vehicle.seats')} type="number" value={seats} onChange={(e) => setSeats(e.target.value)} error={fieldProblem('seats')} />
              <Input label={t('vehicle.doors')} type="number" value={doors} onChange={(e) => setDoors(e.target.value)} error={fieldProblem('doors')} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGrid} style={{ marginTop: 'var(--space-lg)' }}>
              <Input label="Make" value={make} onChange={(e) => setMake(e.target.value)} required placeholder="Toyota" error={fieldProblem('make')} />
              <Input label="Model" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="RAV4" error={fieldProblem('model')} />
              <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="2023" error={fieldProblem('year')} />
              <Input label="Trim" value={trim} onChange={(e) => setTrim(e.target.value)} hint="Optional" placeholder="XLE" error={fieldProblem('trim')} />
              <Input label={t('vehicle.seats')} type="number" value={seats} onChange={(e) => setSeats(e.target.value)} error={fieldProblem('seats')} />
              <Input label={t('vehicle.doors')} type="number" value={doors} onChange={(e) => setDoors(e.target.value)} error={fieldProblem('doors')} />
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
            </div>
          </>
        )}

        <div style={{ marginTop: 'var(--space-xl)' }}>
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
            error={fieldProblem('dailyRate')}
            hint={
              dailyRate && Number(dailyRate) > 0
                ? `You receive about ${money(Number(dailyRate) * (1 - COMMISSION_RATE))} per day after commission.`
                : 'What the customer pays per day.'
            }
          />
          <Input
            label="Weekly rate (USD)"
            type="number"
            value={weeklyRate}
            onChange={(e) => setWeeklyRate(e.target.value)}
            error={fieldProblem('weeklyRate')}
            hint="Optional. A cheaper rate for seven days or more."
          />
          <Input
            label="Minimum days"
            type="number"
            value={minimumDays}
            onChange={(e) => setMinimumDays(e.target.value)}
            error={fieldProblem('minimumDays')}
          />
          <Input
            label="Maximum days"
            type="number"
            value={maximumDays}
            onChange={(e) => setMaximumDays(e.target.value)}
            error={fieldProblem('maximumDays')}
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
            error={fieldProblem('depositAmount')}
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

        {!editing ? (
          <div style={{ marginTop: 'var(--space-lg)', maxWidth: 420 }}>
            <TownPicker
              label={t('pp.vform.collectedFrom')}
              value={townName}
              onChange={(name) => setTownName(name)}
              required
              error={fieldProblem('pickupTown')}
              hint={
                findTown(townName)
                  ? `${sideLabels[findTown(townName)!.side]}. ${t('pp.vform.townHint')}`
                  : t('pp.vform.townHint')
              }
            />
          </div>
        ) : null}

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
            <div className={styles.note} style={{ marginTop: 0 }}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('pp.vform.deliveryFeeNote')}
              </Text>
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
            error={fieldProblem('description')}
            placeholder="What is this car good for? Where does it go well? Anything a visitor would not know."
          />
        </div>

        <div className={styles.privacyNote} style={{ marginTop: 'var(--space-lg)' }}>
          <Icon name="document-outline" size={19} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h3" raw>
              {t('pp.vform.historyTitle')}
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('pp.vform.historyBody')}
            </Text>
          </div>
        </div>
      </Card>

      {/* ---- SAVING ---- */}
      <Card padded>
        {blocked ? (
          <div className={styles.note} style={{ marginTop: 0, marginBottom: 'var(--space-md)' }}>
            <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
            <Text variant="small" tone="ink2" raw>
              {blocked}
            </Text>
          </div>
        ) : null}

        {problem ? (
          <div className={styles.note} style={{ marginTop: 0, marginBottom: 'var(--space-md)' }} role="alert">
            <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

        {removeProblem ? (
          <div className={styles.note} style={{ marginTop: 0, marginBottom: 'var(--space-md)' }} role="alert">
            <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {removeProblem}
            </Text>
          </div>
        ) : null}

        <div className={styles.headActions}>
          <Button
            label={editing ? 'Save Changes' : 'Add This Vehicle'}
            size="md"
            loading={saving}
            disabled={Boolean(blocked)}
            onClick={save}
          />
          <Button label={t('common.cancel')} href="/provider/fleet" variant="outline" size="md" />

          {editing ? (
            <Button
              label="Remove This Vehicle"
              variant="ghost"
              size="md"
              onClick={() => setDeleteOpen(true)}
            />
          ) : null}
        </div>

        {!editing ? (
          <div className={styles.note}>
            <Icon name="shield-checkmark-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('pp.vform.waitsForApproval')}
            </Text>
          </div>
        ) : null}
      </Card>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove this vehicle?"
        body="It will no longer be listed to customers. A vehicle with a rental coming up cannot be removed until that rental is over."
        confirmLabel="Remove It"
        destructive
        loading={removing}
        onConfirm={remove}
      />
    </>
  );
}

export default VehicleForm;
