// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Two things about car photos — getting one ready to
// upload, and asking for one at the size a page actually shows it.
//
// ---- GETTING A PHOTO READY ----
//
// A photo straight off a phone is several megabytes and 4000 pixels across.
// No screen shows a car at that size, and on hotel wifi it is the difference
// between a few seconds a photo and a minute. So each one is redrawn at no
// more than 2000 pixels on its longest side and saved as a JPEG, which comes
// out at a few hundred kilobytes.
//
// Redrawing it also leaves behind what the phone wrote INTO the file: the
// time, the phone, and — unless it was switched off — the exact spot the photo
// was taken. For a car photographed on somebody's driveway, that is their home
// address, published on a listing. The redrawn copy carries none of it. That
// is also why a photo that cannot be redrawn is refused rather than sent as
// it is.
//
// A file this browser cannot open — most often an iPhone's HEIC photo on a
// computer that does not read them — is refused with a sentence, rather than
// uploaded as something most browsers could not then show. (An iPhone itself
// converts to JPEG when a website asks for one, which the photo picker does.)
//
// ---- SHOWING ONE ----
//
// Cloudinary makes any size of a photo from its address: put "w_800" in it
// and it hands back one 800 pixels wide, made once and served from a cache
// after that. A search result showing a 2000-pixel photo in a 300-pixel card
// would make every visitor download six times what they can see.

import { ApiError } from './api/errors';

/** The most photos a car can have — the backend's limit. */
export const MAX_PHOTOS_PER_CAR = 12;

/** What the photo picker offers: kinds every browser can open and show. */
export const PHOTO_TYPES = 'image/jpeg,image/png,image/webp';

const LONGEST_SIDE = 2000;
const JPEG_QUALITY = 0.85;
// The small copy shown on the form before the photo is uploaded.
const PREVIEW_SIDE = 480;

const unreadable = () =>
  new ApiError({
    code: 'photo_unreadable',
    message: 'That file could not be opened as a photo. Use a JPEG, PNG or WebP picture.',
    status: 0,
  });

function openImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const address = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(address);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(address);
      reject(unreadable());
    };
    image.src = address;
  });
}

/**
 * A chosen photo, made ready to upload: no bigger than it needs to be, a
 * JPEG, and with nothing hidden inside it. Refused, as `photo_unreadable`,
 * when this browser cannot open it.
 *
 * A small copy comes with it, to show on the form until it is uploaded. It is
 * written out in full as text (a "data:" address) rather than kept as a
 * local file, so there is nothing to remember to let go of: it goes when the
 * form does.
 */
export async function preparePhoto(file: Blob): Promise<{ photo: Blob; preview: string }> {
  const image = await openImage(file);
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) throw unreadable();

  const scale = Math.min(1, LONGEST_SIDE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw unreadable();
  // A see-through PNG would turn black as a JPEG. White is how it looked.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Browsers turn the photo the right way up as they draw it, using the same
  // hidden note that is then left behind.
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const photo = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!photo) throw unreadable();

  const shrink = Math.min(1, PREVIEW_SIDE / Math.max(canvas.width, canvas.height));
  const small = document.createElement('canvas');
  small.width = Math.round(canvas.width * shrink);
  small.height = Math.round(canvas.height * shrink);
  small.getContext('2d')?.drawImage(canvas, 0, 0, small.width, small.height);

  return { photo, preview: small.toDataURL('image/jpeg', 0.7) };
}

/** The sizes pages ask for, in pixels across — twice what is shown, for sharp screens. */
export const PHOTO_WIDTHS = {
  thumb: 400,
  card: 800,
  page: 1600,
} as const;

export type PhotoSize = keyof typeof PHOTO_WIDTHS;

const CLOUDINARY = 'https://res.cloudinary.com/';
const UPLOADED = '/image/upload/';

/**
 * A photo's address at a given width, or cut to an exact width and height.
 *
 * Only an https address is ever shown — anything else did not come from us,
 * and `undefined` comes back so the page draws its grey block instead. Only
 * Cloudinary's own addresses can be resized; any other is handed back as it
 * is.
 */
export function photoAt(
  url: string | undefined,
  size: { width: number; height?: number },
): string | undefined {
  if (!url || !url.startsWith('https://')) return undefined;
  const at = url.indexOf(UPLOADED);
  if (!url.startsWith(CLOUDINARY) || at === -1) return url;

  const shape = size.height
    ? `c_fill,g_center,w_${size.width},h_${size.height}`
    : `c_limit,w_${size.width}`;
  // f_auto sends each browser the smallest format it can show; q_auto picks
  // the lowest quality nobody can tell apart from the original.
  const cut = at + UPLOADED.length;
  return `${url.slice(0, cut)}${shape},f_auto,q_auto/${url.slice(cut)}`;
}
