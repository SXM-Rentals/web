'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Taking the photo that gets matched against somebody's
// identity document, using the webcam.
//
// THE CAMERA IS ONLY ASKED FOR WHEN THE BUTTON IS PRESSED, never on arrival. A
// browser that pops up "this site wants to use your camera" the instant a page
// loads is a browser people close. Asking after they have read what it is for,
// and pressed something, is both more polite and far more likely to get a yes.
//
// EVERY WAY THIS CAN FAIL IS HANDLED, because on a laptop they are all common:
// permission refused, no camera at all, or a camera already being used by
// something else. Each gets its own message saying what to do, rather than a
// blank rectangle. Anyone who cannot use a camera can upload a photo instead.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { Button, Card, Icon, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

type CameraState = 'idle' | 'starting' | 'live' | 'captured' | 'denied' | 'missing' | 'busy';

export default function VerifySelfiePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { markVerificationStep } = useSession();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>('idle');

  // ---- SWITCH THE CAMERA OFF AGAIN ----
  // Essential rather than tidy: a webcam left running keeps its light on after
  // the person has moved to another page, which is alarming and looks like
  // spying. This runs when they leave, whichever way they leave.
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setState('starting');

    // Some browsers do not offer camera access at all — over a plain http
    // connection, for instance, or in a locked-down work profile.
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('missing');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // The front camera, and a portrait-ish shape so a face fills the frame.
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState('live');
    } catch (caught) {
      // Which failure it was decides what we tell them to do about it.
      const name = caught instanceof Error ? caught.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') setState('denied');
      else if (name === 'NotFoundError' || name === 'OverconstrainedError') setState('missing');
      else if (name === 'NotReadableError') setState('busy');
      else setState('denied');
    }
  };

  const capture = () => {
    stopCamera();
    setState('captured');
  };

  const problem: Record<'denied' | 'missing' | 'busy', { title: string; body: string }> = {
    denied: {
      title: 'The camera was blocked',
      body: 'Your browser refused access. Click the camera icon in the address bar and allow it, then try again — or upload a photo instead.',
    },
    missing: {
      title: 'No camera found',
      body: 'This computer does not seem to have a camera available. Uploading a photo works just as well.',
    },
    busy: {
      title: 'The camera is already in use',
      body: 'Another program has hold of it — a video call, usually. Close that and try again, or upload a photo instead.',
    },
  };

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.selfie.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.selfie.subtitle')}
        </Text>
      </div>

      <div className={styles.cameraFrame}>
        {state === 'live' ? (
          <>
            <video ref={videoRef} className={styles.cameraVideo} playsInline muted />
            {/* The same oval as the phone app, so the instructions match
                whichever one somebody is using. */}
            <span className={styles.cameraOval} aria-hidden="true" />
          </>
        ) : state === 'captured' ? (
          <div className={styles.cameraPlaceholder}>
            <Icon name="checkmark-circle" size={44} color="var(--success)" />
            <Text variant="label">Photo taken</Text>
          </div>
        ) : (
          <div className={styles.cameraPlaceholder}>
            <Icon name="camera-outline" size={40} />
            <Text variant="small" tone="ink3">
              {state === 'starting'
                ? 'Starting the camera…'
                : 'Your camera is off until you press the button below.'}
            </Text>
          </div>
        )}
      </div>

      {/* ---- SOMETHING WENT WRONG WITH THE CAMERA ---- */}
      {state === 'denied' || state === 'missing' || state === 'busy' ? (
        <Card>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="alert-circle-outline" size={16} color="var(--warning)" />
            <div>
              <Text variant="label" as="h2">
                {problem[state].title}
              </Text>
              <Text variant="small" tone="ink2">
                {problem[state].body}
              </Text>
            </div>
          </div>
        </Card>
      ) : null}

      <div className={styles.actions}>
        {state === 'live' ? (
          <Button label={t('authp.selfie.take')} fullWidth size="lg" onClick={capture} />
        ) : state === 'captured' ? (
          <>
            <Button
              label={t('authp.selfie.use')}
              fullWidth
              size="lg"
              onClick={() => {
                markVerificationStep('selfie');
                router.push('/verify-id');
              }}
            />
            <Button
              label={t('authp.selfie.retake')}
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                setState('idle');
                startCamera();
              }}
            />
          </>
        ) : (
          <Button
            label={t('authp.selfie.turnOn')}
            fullWidth
            size="lg"
            loading={state === 'starting'}
            onClick={startCamera}
            iconLeft={<Icon name="camera-outline" size={18} />}
          />
        )}

        {/* Always available, not only after the camera fails. Some people
            simply cannot use one, and hiding the alternative until something
            breaks makes them work for it. */}
        {state !== 'captured' ? (
          <Button
            label={t('authp.selfie.uploadInstead')}
            variant="outline"
            size="md"
            fullWidth
            href="/verify-id"
          />
        ) : null}

        <Button label={t('common.back')} variant="ghost" size="md" fullWidth href="/verify-status" />
      </div>

      <Card>
        <div className={styles.note}>
          <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.selfie.demoNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
