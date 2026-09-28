// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The block where a car's photo goes, and the round
// initials shown in place of a profile picture.
//
// THE BLOCK IS ALWAYS DRAWN, photo or not: a deliberate grey block of exactly
// the right proportions. A car with photos has its photo laid over it; a car
// without — most of them, until businesses add some — keeps the block. So the
// page has its final shape either way, and nothing moves as a photo arrives
// or if one never does.

import React from 'react';
import { cx } from '@/lib/utils';
import { photoAt, PHOTO_WIDTHS, type PhotoSize } from '@/lib/photos';
import { Icon, type IconName } from './Icon';
import { PhotoImage } from './PhotoImage';
import { initials as toInitials } from '@/lib/format';
import styles from './Placeholders.module.css';

export function PhotoPlaceholder({
  // The shape of the block. Cars use "wide" in lists and the default 4:3 on
  // their own page.
  shape = 'default',
  icon = 'car-outline',
  // A short caption inside the block, e.g. the car's name.
  label,
  iconSize = 34,
  // The photo's address, as the backend gives it — usually a car's
  // `photos[0]`, its cover. Left out, or not https, and the block is all.
  photo,
  // How big a copy to ask for. See PHOTO_WIDTHS in lib/photos.ts.
  size = 'card',
  // Words for the photo, when it says something the page around it does not.
  // Without them the photo is treated as decoration, like the block.
  alt,
  // For the one photo at the top of a page: loaded at once, not when near.
  eager = false,
  className,
  style,
}: {
  shape?: 'default' | 'wide' | 'square' | 'tall' | 'fill';
  icon?: IconName;
  label?: string;
  iconSize?: number;
  photo?: string;
  size?: PhotoSize;
  alt?: string;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = photoAt(photo, { width: PHOTO_WIDTHS[size] });
  return (
    <div
      className={cx(styles.photo, shape !== 'default' && styles[shape], className)}
      style={style}
      // Decorative, unless there are words for the photo. Announcing
      // "placeholder" on every car in a list would be pure noise, and so
      // would "photo" with nothing to say about it.
      aria-hidden={src && alt ? undefined : 'true'}
    >
      <div className={styles.photoInner}>
        <Icon name={icon} size={iconSize} />
        {label ? <span className="t-caption">{label}</span> : null}
      </div>
      {src ? <PhotoImage src={src} alt={alt ?? ''} className={styles.photoImage} eager={eager} /> : null}
    </div>
  );
}

// ---- AVATAR ----
// A circle holding someone's initials.
export function Avatar({
  firstName,
  lastName,
  // Use this instead when all that is available is a display name such as
  // "Benjamin J." — which is all a rental business is ever given.
  name,
  size = 40,
  tone = 'default',
  className,
}: {
  firstName?: string;
  lastName?: string;
  name?: string;
  size?: number;
  tone?: 'default' | 'brand' | 'primary';
  className?: string;
}) {
  const letters = name
    ? toInitials(...(name.split(' ') as [string, string?]))
    : toInitials(firstName ?? '', lastName);

  return (
    <span
      className={cx(
        styles.avatar,
        tone === 'brand' && styles.avatarBrand,
        tone === 'primary' && styles.avatarPrimary,
        className,
      )}
      style={{
        width: size,
        height: size,
        // Initials scale with the circle so a large avatar is not left with
        // tiny letters floating in the middle of it.
        fontSize: Math.round(size * 0.38),
      }}
      aria-hidden="true"
    >
      {letters}
    </span>
  );
}
