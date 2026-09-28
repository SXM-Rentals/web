'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A car's photos on the business's form — choosing them,
// putting them in order (the first is the cover customers see in search), and
// taking them away again.
//
// ---- TWO SITUATIONS, TWO PIECES ----
//
// A CAR BEING ADDED has nowhere to put a photo yet: photos belong to a car,
// and the car does not exist until the form is sent. So PhotoPicker only
// holds them, here in the browser. Once the car is added, the form hands them
// to VehiclePhotos, which uploads them to it.
//
// A CAR ALREADY LISTED has somewhere. VehiclePhotos uploads each photo as soon
// as it is chosen, and every change — the order, a removal — is saved the
// moment it is made. Nothing waits for the form's Save button, and the card
// says so.
//
// ---- ONE AT A TIME ----
//
// Photos go up one after another, in the order they were chosen. Eight at
// once on hotel wifi makes all eight slow and any of them likely to fail, and
// each new photo goes on the end — so one at a time also keeps the order the
// business chose.
//
// ---- A RETRY NEVER UPLOADS THE SAME PHOTO TWICE ----
//
// Adding a photo is three steps (see lib/api-client.ts): a ticket, the upload,
// then telling the backend the address. If the connection drops after the
// upload, the address is kept, and "try again" repeats only the last step —
// which the backend ignores if it did arrive after all. So a flaky connection
// never leaves one photo on the listing twice.
//
// ---- WHAT IS SENT ----
//
// Not the file as the phone took it: each photo is redrawn first, smaller and
// without the hidden note of where it was taken. See lib/photos.ts.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { isAborted, isApiError, isUnavailable } from '@/lib/api/errors';
import { MAX_PHOTOS_PER_CAR, PHOTO_TYPES, PHOTO_WIDTHS, photoAt, preparePhoto } from '@/lib/photos';
import { cx } from '@/lib/utils';
import { Button, Dialog, Icon, IconButton, Text } from '@/components/ui';
import { PhotoImage } from '@/components/ui/PhotoImage';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import type { VehiclePhoto } from '@/types';
import styles from './VehiclePhotos.module.css';

/** A photo chosen and made ready, not on any listing yet. */
export type ChosenPhoto = {
  key: string;
  // Redrawn and ready to send (lib/photos.ts).
  photo: Blob;
  // A small copy to show until it is uploaded.
  preview: string;
};

type Queued = ChosenPhoto & {
  state: 'waiting' | 'uploading' | 'failed';
  // Once the upload itself has worked. Kept, so trying again only has to
  // tell the backend — see the top of the file.
  uploadedUrl?: string;
  problem?: string;
};

let chosenSoFar = 0;

// Makes each chosen file ready, one after another. The ones that cannot be
// opened are named, rather than dropped without a word.
async function makeReady(files: File[]): Promise<{ ready: ChosenPhoto[]; refused: string[] }> {
  const ready: ChosenPhoto[] = [];
  const refused: string[] = [];
  for (const file of files) {
    try {
      const { photo, preview } = await preparePhoto(file);
      chosenSoFar += 1;
      ready.push({ key: `photo-${chosenSoFar}`, photo, preview });
    } catch {
      refused.push(file.name);
    }
  }
  return { ready, refused };
}

function moved<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// Choosing photos, for both pieces: how many still fit, getting them ready,
// and what to say about any that did not make it.
function useChooser(room: number, take: (ready: ChosenPhoto[]) => void) {
  const { t } = useTranslation();
  const [preparing, setPreparing] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  const choose = async (files: File[]) => {
    if (files.length === 0) return;
    const taken = files.slice(0, Math.max(0, room));
    const said: string[] = [];
    if (taken.length < files.length) {
      said.push(
        taken.length === 0
          ? t('pp.photos.full').replace('{max}', String(MAX_PHOTOS_PER_CAR))
          : t('pp.photos.limitReached')
              .replace('{max}', String(MAX_PHOTOS_PER_CAR))
              .replace('{count}', String(taken.length)),
      );
    }
    setPreparing(true);
    try {
      const { ready, refused } = await makeReady(taken);
      if (refused.length > 0) said.push(t('pp.photos.unreadable').replace('{names}', refused.join(', ')));
      if (ready.length > 0) take(ready);
    } finally {
      setPreparing(false);
      setNotes(said);
    }
  };

  return { choose, preparing, notes };
}

// ---- THE PIECES OF THE GRID ----

function AddTile({ onChoose, preparing }: { onChoose: (files: File[]) => void; preparing: boolean }) {
  const { t } = useTranslation();
  return (
    <li>
      <label className={cx(styles.add, preparing && styles.addBusy)}>
        <input
          type="file"
          accept={PHOTO_TYPES}
          multiple
          className="sr-only"
          disabled={preparing}
          onChange={(event) => {
            // Copied out first: emptying the box, so the same photo can be
            // chosen again later, empties this list too.
            const files = Array.from(event.target.files ?? []);
            event.target.value = '';
            onChoose(files);
          }}
        />
        {preparing ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <Icon name="camera-outline" size={26} />
        )}
        <span>{preparing ? t('pp.photos.preparing') : t('pp.photos.add')}</span>
      </label>
    </li>
  );
}

const STATE_WORDS: Record<Queued['state'], TranslationKey> = {
  waiting: 'pp.photos.waiting',
  uploading: 'pp.photos.uploading',
  failed: 'pp.photos.failed',
};

function PhotoTile({
  src,
  number,
  cover = false,
  state,
  locked = false,
  onMakeCover,
  onEarlier,
  onLater,
  onRetry,
  onRemove,
}: {
  src?: string;
  number: number;
  cover?: boolean;
  state?: Queued['state'];
  locked?: boolean;
  onMakeCover?: () => void;
  onEarlier?: () => void;
  onLater?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
}) {
  const { t } = useTranslation();
  const say = (key: TranslationKey) => t(key).replace('{n}', String(number));

  return (
    <li className={styles.tile}>
      {src ? <PhotoImage src={src} alt={say('pp.photos.photoN')} className={styles.image} eager /> : null}

      {state ? (
        <div className={styles.status}>
          {state === 'failed' ? (
            <Icon name="alert-circle-outline" size={20} />
          ) : (
            <span className={styles.spinner} aria-hidden="true" />
          )}
          <span>{t(STATE_WORDS[state])}</span>
        </div>
      ) : null}

      {cover ? (
        <span className={styles.cover}>{t('pp.photos.cover')}</span>
      ) : onMakeCover ? (
        <button
          type="button"
          className={styles.makeCover}
          onClick={onMakeCover}
          disabled={locked}
          aria-label={say('pp.photos.makeCoverN')}
        >
          {t('pp.photos.makeCover')}
        </button>
      ) : null}

      <div className={styles.tools}>
        {onEarlier ? (
          <IconButton icon="chevron-back" label={say('pp.photos.earlierN')} variant="onPhoto" size="sm" onClick={onEarlier} disabled={locked} />
        ) : null}
        {onLater ? (
          <IconButton icon="chevron-forward" label={say('pp.photos.laterN')} variant="onPhoto" size="sm" onClick={onLater} disabled={locked} />
        ) : null}
        {onRetry ? (
          <IconButton icon="refresh" label={say('pp.photos.retryN')} variant="onPhoto" size="sm" onClick={onRetry} />
        ) : null}
        {onRemove ? (
          <IconButton icon="trash-outline" label={say('pp.photos.removeN')} variant="onPhoto" size="sm" onClick={onRemove} disabled={locked} />
        ) : null}
      </div>
    </li>
  );
}

function Lines({ lines, tone }: { lines: string[]; tone: 'problem' | 'note' }) {
  return (
    <>
      {lines.map((line) => (
        <div key={line} className={styles.line} role={tone === 'problem' ? 'alert' : undefined}>
          <Icon
            name={tone === 'problem' ? 'alert-circle-outline' : 'information-circle-outline'}
            size={15}
            color={tone === 'problem' ? 'var(--danger)' : 'var(--ink3)'}
          />
          <Text variant="small" tone={tone === 'problem' ? 'ink2' : 'ink3'} raw>
            {line}
          </Text>
        </div>
      ))}
    </>
  );
}

function Heading({ note }: { note: string }) {
  const { t } = useTranslation();
  return (
    <div>
      <Text variant="label" as="h2" raw>
        {t('pp.photos.title')}
      </Text>
      <Text variant="small" tone="ink2" raw>
        {t('pp.photos.intro')}
      </Text>
      <Text variant="small" tone="ink3" raw style={{ marginTop: 'var(--space-xs)' }}>
        {note}
      </Text>
    </div>
  );
}

// ==================== A CAR BEING ADDED ====================

/**
 * Holds photos for a car that does not exist yet. Nothing is sent: the form
 * hands them to VehiclePhotos once the car has been added.
 */
export function PhotoPicker({
  chosen,
  setChosen,
}: {
  chosen: ChosenPhoto[];
  setChosen: React.Dispatch<React.SetStateAction<ChosenPhoto[]>>;
}) {
  const { t } = useTranslation();
  const room = MAX_PHOTOS_PER_CAR - chosen.length;
  const { choose, preparing, notes } = useChooser(room, (ready) =>
    setChosen((current) => [...current, ...ready]),
  );

  return (
    <>
      <Heading note={t('pp.photos.heldNote')} />

      <ul className={styles.grid}>
        {chosen.map((item, index) => (
          <PhotoTile
            key={item.key}
            src={item.preview}
            number={index + 1}
            cover={index === 0}
            onMakeCover={index > 0 ? () => setChosen((current) => moved(current, index, 0)) : undefined}
            onEarlier={index > 0 ? () => setChosen((current) => moved(current, index, index - 1)) : undefined}
            onLater={
              index < chosen.length - 1
                ? () => setChosen((current) => moved(current, index, index + 1))
                : undefined
            }
            onRemove={() => setChosen((current) => current.filter((other) => other.key !== item.key))}
          />
        ))}
        {room > 0 ? <AddTile onChoose={(files) => void choose(files)} preparing={preparing} /> : null}
      </ul>

      <div className={styles.footer}>
        <Text variant="small" tone="ink3" raw>
          {t('pp.photos.count')
            .replace('{count}', String(chosen.length))
            .replace('{max}', String(MAX_PHOTOS_PER_CAR))}
        </Text>
        <Lines lines={notes} tone="problem" />
      </div>
    </>
  );
}

// ==================== A CAR ALREADY LISTED ====================

/**
 * The photos of one of the business's own cars, changed for real as they are
 * changed here. `startWith` is uploaded straight away — the photos chosen
 * while the car was being added.
 */
export function VehiclePhotos({
  vehicleId,
  startWith = [],
  onBusyChange,
}: {
  vehicleId: string;
  startWith?: ChosenPhoto[];
  // Told whether photos are still going up, so the page can hold back
  // anything that would leave before they have.
  onBusyChange?: (busy: boolean) => void;
}) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<VehiclePhoto[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [queue, setQueue] = useState<Queued[]>(() =>
    startWith.map((item) => ({ ...item, state: 'waiting' as const })),
  );
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [removing, setRemoving] = useState<VehiclePhoto | null>(null);

  // The one upload in progress, if any. A ref rather than state, because it
  // has to be true the instant an upload starts — before React has redrawn.
  const inFlight = useRef<string | null>(null);
  const stop = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    stop.current = controller;
    // Leaving the page stops the upload in progress rather than finishing
    // it for a screen that is gone.
    return () => controller.abort();
  }, []);

  const load = useCallback(async () => {
    setLoadFailed(false);
    try {
      setPhotos(await apiClient.getVehiclePhotos(vehicleId));
    } catch (caught) {
      if (!isAborted(caught)) setLoadFailed(true);
    }
  }, [vehicleId]);

  useEffect(() => {
    void load();
  }, [load]);

  // What went wrong, in words for the business. The backend's own sentence
  // where it has one; ours where the failure never reached it.
  const describe = (caught: unknown): string => {
    if (isUnavailable(caught)) return t('pp.photos.notOn');
    if (!isApiError(caught)) return t('pp.photos.uploadFailed');
    switch (caught.code) {
      case 'photo_too_large':
        return t('pp.photos.tooLarge');
      case 'upload_failed':
        return t('pp.photos.uploadFailed');
      case 'offline':
      case 'timeout':
        return t('pp.photos.connection');
      default:
        return caught.message;
    }
  };

  const change = (key: string, changes: Partial<Queued>) =>
    setQueue((current) => current.map((item) => (item.key === key ? { ...item, ...changes } : item)));

  const send = async (item: Queued) => {
    if (inFlight.current) return;
    inFlight.current = item.key;
    change(item.key, { state: 'uploading', problem: undefined });
    try {
      let url = item.uploadedUrl;
      if (!url) {
        url = await apiClient.uploadVehiclePhoto(vehicleId, item.photo, stop.current?.signal);
        change(item.key, { uploadedUrl: url });
      }
      const now = await apiClient.attachVehiclePhoto(vehicleId, url);
      setPhotos(now);
      setQueue((current) => current.filter((other) => other.key !== item.key));
    } catch (caught) {
      if (isAborted(caught)) return;
      const reason = describe(caught);
      if (isUnavailable(caught)) {
        // Nothing else will get through either, so nothing else is tried.
        setQueue((current) =>
          current.map((other) =>
            other.key === item.key || other.state === 'waiting'
              ? { ...other, state: 'failed', problem: reason }
              : other,
          ),
        );
      } else {
        change(item.key, { state: 'failed', problem: reason });
      }
    } finally {
      inFlight.current = null;
    }
  };

  // The next photo goes once the last has finished — and not before the
  // car's current photos have loaded, or the list could be drawn over with an
  // older one.
  const uploading = queue.some((item) => item.state === 'uploading');
  useEffect(() => {
    if (photos === null || uploading) return;
    const next = queue.find((item) => item.state === 'waiting');
    if (next) void send(next);
    // `send` is left out on purpose: it is made afresh on every draw, and
    // what decides whether to run is all listed here.
  }, [photos, queue, uploading]);

  const busy = queue.some((item) => item.state !== 'failed');
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  // Closing the tab mid-upload loses the rest, so the browser asks first.
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // What older browsers look for instead.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  const room = MAX_PHOTOS_PER_CAR - (photos?.length ?? 0) - queue.length;
  const { choose, preparing, notes } = useChooser(room, (ready) =>
    setQueue((current) => [...current, ...ready.map((item) => ({ ...item, state: 'waiting' as const }))]),
  );

  // A change to the photos already listed. Not while any are going up: a new
  // order has to name every photo, and one arriving mid-change would be left
  // out of it.
  const locked = working || busy;
  const act = async (job: () => Promise<VehiclePhoto[]>) => {
    setWorking(true);
    setProblem(null);
    try {
      setPhotos(await job());
      return true;
    } catch (caught) {
      setProblem(describe(caught));
      return false;
    } finally {
      setWorking(false);
    }
  };
  const reorder = (from: number, to: number) => {
    if (!photos) return;
    const order = moved(photos, from, to).map((photo) => photo.id);
    void act(() => apiClient.orderVehiclePhotos(vehicleId, order));
  };

  const reasons = Array.from(
    new Set(queue.filter((item) => item.state === 'failed' && item.problem).map((item) => item.problem!)),
  );

  return (
    <>
      <Heading note={t('pp.photos.liveNote')} />

      {photos === null ? (
        loadFailed ? (
          <div className={styles.footer}>
            <Lines lines={[t('pp.photos.loadFailed')]} tone="problem" />
            <div>
              <Button label={t('common.retry')} variant="outline" size="sm" onClick={() => void load()} />
            </div>
          </div>
        ) : (
          <Text variant="small" tone="ink3" raw style={{ marginTop: 'var(--space-lg)' }}>
            {t('common.loading')}
          </Text>
        )
      ) : (
        <>
          <ul className={styles.grid}>
            {photos.map((photo, index) => (
              <PhotoTile
                key={photo.id}
                src={photoAt(photo.url, { width: PHOTO_WIDTHS.thumb })}
                number={index + 1}
                cover={index === 0}
                locked={locked}
                onMakeCover={index > 0 ? () => reorder(index, 0) : undefined}
                onEarlier={index > 0 ? () => reorder(index, index - 1) : undefined}
                onLater={index < photos.length - 1 ? () => reorder(index, index + 1) : undefined}
                onRemove={() => setRemoving(photo)}
              />
            ))}
            {queue.map((item, index) => (
              <PhotoTile
                key={item.key}
                src={item.preview}
                number={photos.length + index + 1}
                state={item.state}
                onRetry={item.state === 'failed' ? () => change(item.key, { state: 'waiting' }) : undefined}
                onRemove={
                  item.state === 'uploading'
                    ? undefined
                    : () => setQueue((current) => current.filter((other) => other.key !== item.key))
                }
              />
            ))}
            {room > 0 ? <AddTile onChoose={(files) => void choose(files)} preparing={preparing} /> : null}
          </ul>

          <div className={styles.footer}>
            <Text variant="small" tone="ink3" raw>
              {t('pp.photos.count')
                .replace('{count}', String(photos.length))
                .replace('{max}', String(MAX_PHOTOS_PER_CAR))}
            </Text>
            {busy ? <Lines lines={[t('pp.photos.stayOnPage')]} tone="note" /> : null}
            <Lines lines={[...notes, ...reasons, ...(problem ? [problem] : [])]} tone="problem" />
          </div>
        </>
      )}

      <Dialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title={t('pp.photos.removeTitle')}
        body={t('pp.photos.removeBody')}
        confirmLabel={t('pp.photos.removeConfirm')}
        destructive
        loading={working}
        onConfirm={async () => {
          const photo = removing;
          if (!photo) return;
          await act(() => apiClient.removeVehiclePhoto(vehicleId, photo.id));
          setRemoving(null);
        }}
      />
    </>
  );
}

export default VehiclePhotos;
