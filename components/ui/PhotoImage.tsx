'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One photo, laid over the grey block that stands in for
// it (components/ui/Placeholders.tsx). If the photo cannot be loaded it takes
// itself away, and the grey block underneath is what shows — never a broken
// image icon.
//
// It has to run in the browser to hear that a photo failed, and a photo can
// fail before the browser has handed the page over to React: the "it failed"
// event has then already been and gone, with nobody listening. So once React
// is in charge, it also looks at whether the photo actually arrived.

import React, { useEffect, useRef, useState } from 'react';

export function PhotoImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  // Loaded straight away rather than when it is scrolled near. For the one
  // photo at the top of a page.
  eager?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = image.current;
    if (element && element.complete && element.naturalWidth === 0) setFailed(src);
  }, [src]);

  if (failed === src) return null;

  return (
    // A plain <img>: the photos are already cut to size by Cloudinary (see
    // lib/photos.ts), which is the job next/image would otherwise do.
    <img
      ref={image}
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(src)}
    />
  );
}

export default PhotoImage;
