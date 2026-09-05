'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Lets a rental business put its own logo on its profile —
// dragged in from the desktop, or chosen with a file picker.
//
// UNTIL ONE IS ADDED it shows the business's initials in a circle, the same
// stand-in used everywhere else on the site. That way the profile looks
// deliberate rather than broken, and adding a logo later changes what is inside
// the circle without moving anything around it.
//
// NOTHING IS UPLOADED ANYWHERE. There is no backend and no file storage, so the
// picture is shown straight from the visitor's own computer using a temporary
// address the browser creates for it. That address is released again whenever
// the picture is replaced or removed — a browser holds the whole file in memory
// for as long as one exists, so leaving them behind quietly leaks memory every
// time somebody tries another logo.
//
// The checks below run before anything is shown, and each says exactly what was
// wrong: a file too large, or something that is not an image at all. "Upload
// failed" tells nobody anything.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import { Avatar, Button, Card, Icon, Text } from '@/components/ui';
import styles from './LogoUpload.module.css';
import { useTranslation } from '@/lib/i18n';

// What a browser can sensibly display as a logo.
const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml';
const MAX_BYTES = 2 * 1024 * 1024;

export function LogoUpload({ businessName }: { businessName: string }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ---- RELEASE THE OLD PICTURE ----
  // Every temporary address holds its file in memory until it is revoked, so
  // trying five logos without this leaves all five sitting there.
  const replacePreview = useCallback((next: string | null) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return next;
    });
  }, []);

  // And release the last one when leaving the page.
  useEffect(() => {
    return () => {
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
    };
  }, []);

  const accept = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setProblem(
        `"${file.name}" is not an image. A PNG, JPEG, WebP or SVG all work — a PDF does not.`,
      );
      return;
    }

    if (file.size > MAX_BYTES) {
      setProblem(
        `"${file.name}" is larger than 2 MB. A logo rarely needs to be that big — saving it again at a smaller size will look identical here.`,
      );
      return;
    }

    setProblem(null);
    setFileName(file.name);
    replacePreview(URL.createObjectURL(file));
  };

  const remove = () => {
    replacePreview(null);
    setFileName(null);
    setProblem(null);
    // Clears the picker too, so choosing the same file again still counts as a
    // change and fires the event.
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card padded>
      <div className={styles.head}>
        <Text variant="label" as="h2" raw>
          {t('pp.logo.title')}
        </Text>
        <Text variant="small" tone="ink2" raw>
          {t('pp.logo.body')}
        </Text>
      </div>

      <div className={styles.row}>
        {/* ---- WHAT IT LOOKS LIKE NOW ---- */}
        <div className={styles.previewWrap}>
          {preview ? (
            // A plain <img> rather than Next's optimised one: this file only
            // exists in this browser, so there is nothing for a server to
            // resize, and Next would refuse the address anyway.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className={styles.preview} />
          ) : (
            <Avatar name={businessName || 'SXM'} size={96} tone="brand" />
          )}

          <Text variant="caption" tone="ink3" as="p" align="center">
            {preview ? 'Your Logo' : 'No Logo Yet'}
          </Text>
        </div>

        {/* ---- CHOOSING ONE ---- */}
        <div className={styles.chooser}>
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
            {/* A real file input inside a real label, so clicking it, tabbing to
                it and pressing space all work with no code of ours. */}
            <input
              ref={inputRef}
              type="file"
              className={styles.hiddenInput}
              accept={ACCEPTED}
              onChange={(event) => accept(event.target.files)}
            />

            <span className={styles.dropIcon}>
              <Icon name="cloud-upload-outline" size={22} />
            </span>

            <Text variant="label" as="span">
              {dragging ? 'Drop it here' : 'Drag a logo here, or click to choose'}
            </Text>
            <Text variant="small" tone="ink3" as="span" raw>
              {t('pp.logo.fileTypes')}
            </Text>
          </label>

          {problem ? (
            <div className={styles.problem} role="alert">
              <Icon name="alert-circle-outline" size={16} color="var(--danger)" />
              <Text variant="small" tone="ink2">
                {problem}
              </Text>
            </div>
          ) : null}

          {preview && fileName ? (
            <div className={styles.fileRow}>
              <Icon name="checkmark-circle-outline" size={18} color="var(--success)" />
              <div className={styles.fileBody}>
                <Text variant="label" as="span" className={styles.fileName} raw>
                  {fileName}
                </Text>
              </div>
              <Button label={t('pp.logo.remove')} variant="ghost" size="sm" onClick={remove} />
            </div>
          ) : null}

          <div className={styles.note}>
            <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('pp.logo.demoNote')}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LogoUpload;
