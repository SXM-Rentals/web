'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The box someone signs their name in, using a mouse, a
// finger or a stylus, to sign the rental agreement.
//
// IT LISTENS FOR "POINTER" EVENTS rather than mouse events, which is what makes
// one piece of code work for all three. Mouse events alone would leave anyone on
// a touchscreen laptop or tablet unable to sign at all.
//
// THE CANVAS IS DRAWN AT THE SCREEN'S OWN RESOLUTION. Without that, a signature
// on a modern laptop comes out visibly blurred, because the browser stretches a
// small drawing over a screen with twice as many dots. The scaling below is what
// keeps the line crisp.
//
// TYPING A NAME IS OFFERED AS AN ALTERNATIVE. Drawing a recognisable signature
// with a mouse is genuinely hard, and impossible for some people. A typed name is
// how most e-signature services handle this, and refusing to offer it would stop
// people completing a rental for no good reason.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon, Input, SegmentedControl, Text } from '@/components/ui';
import styles from './BookingSteps.module.css';
import { useTranslation } from '@/lib/i18n';

export function SignaturePad({
  // Called whenever the signature becomes valid or invalid, so the page can
  // enable or disable its own button.
  onChange,
  typedName,
  onTypedNameChange,
}: {
  onChange: (signed: boolean) => void;
  typedName: string;
  onTypedNameChange: (name: string) => void;
}) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  // ---- MATCH THE CANVAS TO THE SCREEN ----
  // Sized to however wide the box actually is, multiplied by the screen's pixel
  // density, so the line is sharp rather than stretched.
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(ratio, ratio);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // Read from the theme, so the signature is dark on a light page and light on
    // a dark one rather than invisible on one of them.
    context.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--ink')
      .trim() || '#000';
  }, []);

  useEffect(() => {
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    return () => window.removeEventListener('resize', sizeCanvas);
  }, [sizeCanvas]);

  // Where the pointer is, relative to the top-left of the box.
  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    // Keeps receiving movement even if the pointer leaves the box mid-stroke,
    // so a signature that overshoots the edge does not break in half.
    event.currentTarget.setPointerCapture(event.pointerId);

    drawing.current = true;
    const point = pointFrom(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const point = pointFrom(event);
    context.lineTo(point.x, point.y);
    context.stroke();

    if (!hasDrawn) {
      setHasDrawn(true);
      onChange(true);
    }
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange(false);
  };

  // Switching between drawing and typing re-checks whether there is a valid
  // signature, since the two are kept separately.
  const switchMode = (next: 'draw' | 'type') => {
    setMode(next);
    onChange(next === 'draw' ? hasDrawn : typedName.trim().length > 1);
  };

  return (
    <div>
      <SegmentedControl
        label={t('flow.sign.how')}
        fullWidth
        value={mode}
        onChange={switchMode}
        options={[
          { value: 'draw', label: 'Draw it' },
          { value: 'type', label: 'Type it' },
        ]}
      />

      <div style={{ marginTop: 'var(--space-lg)' }}>
        {mode === 'draw' ? (
          <>
            <div className={styles.signatureWrap}>
              <canvas
                ref={canvasRef}
                className={styles.signatureCanvas}
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
                // Described for anyone who cannot see it. Typing is the way
                // through for someone who cannot draw with a pointer at all,
                // which is why both are offered.
                role="img"
                aria-label={t('flow.sign.boxLabel')}
              />

              {!hasDrawn ? (
                <span className={styles.signatureHint}>Sign here</span>
              ) : null}
            </div>

            <div className={styles.signatureActions}>
              <Text variant="small" tone="ink3" as="span" raw>
                {t('flow.sign.hint')}
              </Text>
              <Button
                label={t('booking.clearSignature')}
                variant="ghost"
                size="sm"
                onClick={clear}
                iconLeft={<Icon name="refresh" size={15} />}
              />
            </div>
          </>
        ) : (
          <Input
            label={t('flow.sign.typeName')}
            placeholder={t('authp.signup.firstNamePlaceholder')}
            value={typedName}
            onChange={(event) => {
              onTypedNameChange(event.target.value);
              onChange(event.target.value.trim().length > 1);
            }}
            hint="Typing your name counts as your signature, the same as drawing it."
          />
        )}
      </div>
    </div>
  );
}

export default SignaturePad;
