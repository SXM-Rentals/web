// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The real logos of the social networks — Instagram,
// Facebook, WhatsApp and TikTok — drawn as code.
//
// WHY THESE ARE SEPARATE FROM THE REST OF THE ICONS: everything in Icon.tsx is
// ours, drawn as thin outlines to match the rest of the site. These are not ours.
// They are other companies' trademarks, and each one has an exact shape that
// people recognise instantly — a generic camera outline reads as "photo", not as
// "Instagram". Since the whole point of the row is being recognised at a glance,
// they have to be the actual marks.
//
// They are drawn as SOLID shapes rather than outlines, because that is how every
// one of these companies publishes its mark. Mixing a solid brand logo into a row
// of outline icons is the one place on this site where breaking the visual rule
// is the right call.
//
// A NOTE ON USING THEM: linking to your own accounts with the official marks is
// what every brand's guidelines explicitly allow. What is not allowed is altering
// them — so these are the correct outlines, unmodified, and they take their
// colour from the text around them rather than being recoloured.

import React from 'react';

export type BrandName = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok';

const PATHS: Record<BrandName, React.ReactNode> = {
  instagram: (
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
  ),
  facebook: (
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.32A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.6-5.68c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.64.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.01-.38.11-.51.11-.11.25-.29.38-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.14-1.19-.06-.1-.23-.16-.48-.29Z" />
  ),
  tiktok: (
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 3.44-2.45v-3.1a5.66 5.66 0 0 0-5.63 5.66A5.66 5.66 0 0 0 10.74 21a5.66 5.66 0 0 0 5.66-5.66V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-4.1-1.48Z" />
  ),
};

export function BrandIcon({
  name,
  size = 20,
  className,
  // These sit inside buttons that already carry the network's name, so by
  // default the mark itself is decoration and stays silent to screen readers.
  label,
}: {
  name: BrandName;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {PATHS[name]}
    </svg>
  );
}

export default BrandIcon;
