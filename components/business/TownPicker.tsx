'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A drop-down of the island's towns, split into the Dutch
// side and the French side. Used wherever a business says where it is — where
// a car is collected from, and where the business itself is based.
//
// The list and why it is a list are in lib/content/towns.ts. It is a plain
// drop-down for the same reasons as the search page's sort control: the
// browser's own control already handles the keyboard, typing a letter to jump,
// and the picker phones put up.
//
// A town that is already saved but is not on the list — typed in before the
// list existed — is still offered, at the top, so opening a form never quietly
// changes what was saved.

import React, { useId } from 'react';
import { Icon, Text } from '@/components/ui';
import { TOWNS, type Town } from '@/lib/content/towns';
import inputStyles from '@/components/ui/Input.module.css';
import { useTranslation } from '@/lib/i18n';

export function TownPicker({
  label,
  value,
  onChange,
  side,
  hint,
  error,
  required,
}: {
  label: string;
  /** The chosen town's name, or '' for none yet. */
  value: string;
  /** The town chosen, or undefined for one that is saved but not on the list. */
  onChange: (name: string, town: Town | undefined) => void;
  /** Only offer towns on this side of the island. */
  side?: 'dutch' | 'french';
  hint?: string;
  error?: string;
  required?: boolean;
}) {
  const { t } = useTranslation();
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  const offered = side ? TOWNS.filter((town) => town.side === side) : TOWNS;
  const unlisted = value && !offered.some((town) => town.name === value) ? value : null;

  const group = (which: 'dutch' | 'french', heading: string) => {
    const towns = offered.filter((town) => town.side === which);
    if (towns.length === 0) return null;
    return (
      <optgroup label={heading}>
        {towns.map((town) => (
          <option key={town.name} value={town.name}>
            {town.name}
          </option>
        ))}
      </optgroup>
    );
  };

  return (
    <div className={inputStyles.field}>
      <label htmlFor={id}>
        <Text variant="label" tone="ink2" as="span" raw>
          {label}
        </Text>
        {required ? (
          <span aria-hidden="true" className="tone-danger">
            {' *'}
          </span>
        ) : null}
      </label>

      <div className={`${inputStyles.box} ${error ? inputStyles.errorBox : ''}`} style={{ position: 'relative' }}>
        <span className={inputStyles.icon}>
          <Icon name="location-outline" size={19} />
        </span>

        <select
          id={id}
          className={inputStyles.input}
          style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 28 }}
          value={value}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          onChange={(event) => {
            const name = event.target.value;
            onChange(name, offered.find((town) => town.name === name));
          }}
        >
          <option value="" disabled>
            {t('pp.town.choose')}
          </option>
          {unlisted ? <option value={unlisted}>{unlisted}</option> : null}
          {group('dutch', t('search.side.dutch'))}
          {group('french', t('search.side.french'))}
        </select>

        {/* The browser's own arrow differs on every platform; this one is drawn
            on top, and clicks pass through it to the drop-down. */}
        <span
          aria-hidden="true"
          style={{ position: 'absolute', right: 'var(--space-md)', display: 'flex', pointerEvents: 'none', color: 'var(--ink2)' }}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </div>

      {message ? (
        <div id={messageId} className={inputStyles.message} role={error ? 'alert' : undefined}>
          {error ? <Icon name="alert-circle-outline" size={15} /> : null}
          <Text variant="small" tone={error ? 'danger' : 'ink3'} as="span" raw>
            {message}
          </Text>
        </div>
      ) : null}
    </div>
  );
}

export default TownPicker;
