'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The two small controls in the top right of every page —
// the light/dark switch and the language picker (English, Dutch, French,
// Spanish).
//
// WHY THE LANGUAGE PICKER IS IN THE HEADER RATHER THAN BURIED IN SETTINGS: a
// visitor who does not read English cannot find a settings page to change the
// language, because the link to it is written in English. It has to be visible
// from the first screen, marked with a globe that means the same thing in every
// language.

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useTranslation, languageOptions, type Language } from '@/lib/i18n';
import { IconButton } from './IconButton';
import { Sheet } from './Sheet';
import { ListRow } from './ListRow';
import { Icon } from './Icon';

// ---- LIGHT / DARK ----
// Shows the moon on a light page and the sun on a dark one — the thing you will
// get if you press it, not the thing you already have.
export function ThemeToggleButton() {
  const { scheme, toggle } = useTheme();
  const { t } = useTranslation();

  return (
    <IconButton
      icon={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
      label={scheme === 'dark' ? t('web.menu.switchToLight') : t('web.menu.switchToDark')}
      variant="plain"
      onClick={toggle}
    />
  );
}

// ---- LANGUAGE ----
export function LanguageButton() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  const current = languageOptions.find((option) => option.code === language);

  return (
    <>
      <IconButton
        icon="globe-outline"
        // Says which language is on now, so it is clear what the button controls
        // rather than leaving a bare globe to be guessed at.
        label={`${t('web.nav.language')}: ${current?.label ?? 'English'}. ${t('web.menu.languageLabel')}`}
        variant="plain"
        onClick={() => setOpen(true)}
        expanded={open}
      />

      <LanguageSheet
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(code) => {
          setLanguage(code);
          setOpen(false);
        }}
        current={language}
      />
    </>
  );
}

export function LanguageSheet({
  open,
  onClose,
  onSelect,
  current,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (code: Language) => void;
  current: Language;
}) {
  const { t } = useTranslation();
  const title = t('web.menu.languageTitle');
  const subtitle = t('web.menu.languageSubtitle');

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      {languageOptions.map((option) => (
        <ListRow
          key={option.code}
          // The name is written in the language itself — a Dutch speaker looks
          // for "Nederlands", not "Dutch" — with the English name underneath so
          // it can still be found by someone who does not read it.
          title={option.label}
          subtitle={option.english}
          onClick={() => onSelect(option.code)}
          trailing={
            option.code === current ? (
              <Icon name="checkmark" size={19} color="var(--brand)" />
            ) : null
          }
        />
      ))}
    </Sheet>
  );
}

// Both controls together, which is how the top bar uses them.
export function QuickSettingsButtons() {
  return (
    <>
      <ThemeToggleButton />
      <LanguageButton />
    </>
  );
}
