'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Shows the SXM Rentals logo.
//
// THERE ARE TWO VERSIONS OF THE ARTWORK and this file picks between them
// automatically, so no page ever has to think about it:
//
//   /brand/logo-black.png  on light backgrounds — the normal light theme
//   /brand/logo-white.png  on dark backgrounds — dark mode, and photo headers
//
// Both have transparent backgrounds, so whichever is chosen sits cleanly on the
// page or on a photograph without a white box around it.
//
// THIS IS THE ONLY FILE ON THE SITE THAT SHOWS THE LOGO. If the artwork ever
// changes, replace the two files in public/brand and nothing else needs
// touching.
//
// BOTH VERSIONS ARE ALWAYS IN THE PAGE, with one hidden by the stylesheet
// depending on the theme. That sounds wasteful, but it means the logo is already
// downloaded when someone switches to dark mode, so it swaps instantly instead
// of blinking out and fading back in.

import React from 'react';
import Image from 'next/image';
import { cx } from '@/lib/utils';
import styles from './Logo.module.css';

// The supplied artwork is 1675 x 442, so it is a little under four times as wide
// as it is tall. Keeping this here means the logo can be asked for by height
// alone and never comes out stretched or squashed.
const LOGO_ASPECT = 1675 / 442;

export type LogoProps = {
  // How tall the logo should be. The width follows automatically.
  size?: number;
  // Forces the white version, for use on a photograph or a fixed dark panel
  // that does not change with the theme.
  onDark?: boolean;
  className?: string;
  // Set on a page where the logo is not the main heading, so the wording is not
  // announced twice to someone listening.
  decorative?: boolean;
  priority?: boolean;
};

export function Logo({
  size = 30,
  onDark = false,
  className,
  decorative = false,
  priority = false,
}: LogoProps) {
  const width = Math.round(size * LOGO_ASPECT);
  // The artwork already contains the words "SXM RENTALS", so this is what the
  // logo says, not a description of the picture.
  const alt = decorative ? '' : 'SXM Rentals';

  if (onDark) {
    return (
      <Image
        src="/brand/logo-white.png"
        alt={alt}
        width={width}
        height={size}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <span className={cx(styles.logo, className)} style={{ height: size, width }}>
      <Image
        src="/brand/logo-black.png"
        alt={alt}
        width={width}
        height={size}
        className={styles.light}
        priority={priority}
      />
      <Image
        src="/brand/logo-white.png"
        // Empty, so the same wording is not read out twice — one of these two is
        // always hidden, but both are in the page.
        alt=""
        width={width}
        height={size}
        className={styles.dark}
        priority={priority}
        aria-hidden="true"
      />
    </span>
  );
}

export default Logo;
