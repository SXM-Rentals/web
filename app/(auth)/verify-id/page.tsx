'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Sending in the driving licence and the identity document
// — either by dragging a file in, or by taking a photo with the webcam.
//
// UPLOADING COMES FIRST HERE, and that is the deliberate difference from the
// phone app. On a phone, holding a document up to the camera is the natural
// thing. On a laptop it is awkward — the camera is above the screen, the
// document has to be held up facing away from you, and the result is usually
// blurred. Most people on a laptop already have a scan or a photo of their
// passport in a folder, and would far rather use it. So drag-and-drop is the
// main route and the webcam is the alternative, which is the opposite way round
// from the phone.
//
// NOTHING IS ACTUALLY UPLOADED. The files chosen here are only read for their
// name and size so the page can show them; they never leave this computer.

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { cx } from '@/lib/utils';
import { Button, Card, Icon, SegmentedControl, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

type Slot = 'license' | 'identityDoc';

// What each document is, and what a good photo of it looks like.
const DOCS: Record<Slot, { title: string; blurb: string; tips: string[] }> = {
  license: {
    title: "Driver's licence",
    blurb: 'Both sides, as two files or two photos.',
    tips: [
      'Lay it flat on a dark surface',
      'Make sure all four corners are in the frame',
      'No glare across the plastic',
      'The expiry date has to be readable',
    ],
  },
  identityDoc: {
    title: 'Passport or local ID',
    blurb: 'The photo page, or both sides of a local ID card.',
    tips: [
      'The whole photo page, flat and in focus',
      'Include the two lines of code along the bottom',
      'No fingers over any of the text',
      'A scan works better than a photo if you have one',
    ],
  },
};

// Files a browser can sensibly accept for this.
const ACCEPTED = 'image/jpeg,image/png,image/heic,image/webp,application/pdf';
const MAX_BYTES = 10 * 1024 * 1024;

export default function VerifyIdPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, markVerificationStep } = useSession();

  const [slot, setSlot] = useState<Slot>('license');
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Record<Slot, File[]>>({ license: [], identityDoc: [] });
  const [problem, setProblem] = useState<string | undefined>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const documentTitle =
    slot === 'identityDoc' && user?.accountType === 'local'
      ? 'Local ID or residency document'
      : DOCS[slot].title;

  // Checks what was dropped or chosen before accepting it, and says exactly
  // what was wrong rather than silently ignoring the file.
  const accept = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;

    const list = Array.from(incoming);
    const tooBig = list.find((file) => file.size > MAX_BYTES);
    if (tooBig) {
      setProblem(
        `"${tooBig.name}" is larger than 10 MB. Most phone cameras have a setting to take smaller photos, or you can save it again at a lower size.`,
      );
      return;
    }

    const wrongKind = list.find(
      (file) => !file.type.startsWith('image/') && file.type !== 'application/pdf',
    );
    if (wrongKind) {
      setProblem(
        `"${wrongKind.name}" is not a photo or a PDF. A photo, a scan or a PDF of the document all work.`,
      );
      return;
    }

    setProblem(undefined);
    setFiles((current) => ({ ...current, [slot]: [...current[slot], ...list] }));
  };

  const removeFile = (index: number) => {
    setFiles((current) => ({
      ...current,
      [slot]: current[slot].filter((_, position) => position !== index),
    }));
  };

  const hasFiles = files[slot].length > 0;

  const confirm = () => {
    markVerificationStep(slot);

    // Move on to whichever document has not been done yet, or back to the
    // summary once both are in.
    if (slot === 'license' && files.identityDoc.length === 0) {
      setSlot('identityDoc');
      return;
    }
    router.push('/verify-status');
  };

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.id.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.id.subtitle')}
        </Text>
      </div>

      {/* ---- WHICH DOCUMENT ---- */}
      <SegmentedControl
        label={t('authp.id.whichDocument')}
        fullWidth
        value={slot}
        onChange={setSlot}
        options={[
          {
            value: 'license',
            label: files.license.length > 0 ? "Licence ✓" : 'Licence',
          },
          {
            value: 'identityDoc',
            label: files.identityDoc.length > 0 ? 'ID ✓' : 'ID',
          },
        ]}
      />

      <div className={styles.head}>
        <Text variant="h3" as="h2">
          {documentTitle}
        </Text>
        <Text variant="small" tone="ink2">
          {DOCS[slot].blurb}
        </Text>
      </div>

      {/* ---- UPLOAD OR CAMERA ---- */}
      <SegmentedControl
        label={t('authp.id.howToSend')}
        fullWidth
        value={mode}
        onChange={setMode}
        options={[
          { value: 'upload', label: t('authp.id.uploadFile') },
          { value: 'camera', label: t('authp.id.useWebcam') },
        ]}
      />

      {mode === 'upload' ? (
        <>
          {/* ---- THE DROP ZONE ----
              A real label wrapping a real file input, so clicking it, tabbing to
              it and pressing space all work with no extra code. */}
          <label
            className={cx(styles.dropZone, dragging && styles.dropZoneActive)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              accept(event.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              className={styles.hiddenInput}
              accept={ACCEPTED}
              multiple
              onChange={(event) => accept(event.target.files)}
            />

            <span className={styles.dropIcon}>
              <Icon name="cloud-upload-outline" size={26} />
            </span>

            <Text variant="label" as="span">
              {dragging ? 'Drop it here' : 'Drag a file here, or click to choose'}
            </Text>
            <Text variant="small" tone="ink3" as="span" raw>
              {t('authp.id.fileTypes')}
            </Text>
          </label>

          {problem ? (
            <div className={styles.reasonBox}>
              <Icon name="alert-circle-outline" size={18} color="var(--danger)" />
              <Text variant="small" tone="ink2">
                {problem}
              </Text>
            </div>
          ) : null}

          {/* ---- WHAT HAS BEEN CHOSEN ---- */}
          {hasFiles ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {files[slot].map((file, index) => (
                <div key={`${file.name}-${index}`} className={styles.fileRow}>
                  <Icon name="document-outline" size={19} color="var(--ink2)" />
                  <div className={styles.fileBody}>
                    <Text variant="label" as="span" className={styles.fileName} raw>
                      {file.name}
                    </Text>
                    <Text variant="caption" tone="ink3" raw>
                      {`${Math.max(1, Math.round(file.size / 1024))} KB`}
                    </Text>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                    style={{ color: 'var(--ink3)', display: 'flex' }}
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <Card padded>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="camera-outline" size={16} color="var(--ink2)" />
            <Text variant="small" tone="ink2" raw>
              {t('authp.id.webcamWarning')}
            </Text>
          </div>

          <div style={{ marginTop: 'var(--space-lg)' }}>
            <Button
              label={t('authp.id.openAnyway')}
              variant="outline"
              size="md"
              fullWidth
              href="/verify-selfie"
            />
          </div>
        </Card>
      )}

      {/* ---- HOW TO GET IT ACCEPTED FIRST TIME ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('authp.id.firstTime')}
        </Text>

        <div className={styles.steps}>
          {DOCS[slot].tips.map((tip) => (
            <div key={tip} className={styles.step}>
              <Icon name="checkmark" size={16} color="var(--success)" />
              <Text variant="small" tone="ink2">
                {tip}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      <div className={styles.actions}>
        <Button
          label={slot === 'license' ? 'Save and continue' : 'Save and finish'}
          fullWidth
          size="lg"
          disabled={!hasFiles}
          onClick={confirm}
        />
        <Button label={t('common.back')} variant="ghost" size="md" fullWidth href="/verify-status" />
      </div>

      <Card>
        <div className={styles.note}>
          <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.id.demoNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
