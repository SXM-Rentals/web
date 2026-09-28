// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Sends one photo straight to where photos are kept
// (Cloudinary), with an upload ticket the backend signed, and hands back the
// address the photo is now at.
//
// ---- WHY THIS DOES NOT GO THROUGH lib/api/http.ts ----
//
// That file talks to our backend. This talks to somebody else's server, and
// nearly everything that file does would be wrong here:
//
//   the address is Cloudinary's, not /api/v1 on this site;
//   the body is a file, sent as a form, not JSON;
//   the sign-in cookie must not go — it is ours, and Cloudinary has no use
//   for it;
//   Cloudinary's refusals are not written for a person to read ("Invalid
//   Signature 3f2a… String to sign - 'folder=…'"), so they are kept for
//   whoever is building this and replaced with a plain sentence;
//   and a photo on hotel wifi takes far longer than a request, so it has its
//   own, longer clock.
//
// The photo never passes through our backend at all (the backend's
// src/lib/storage.ts says why). Which is also why all that comes back is an
// address: the backend is told it afterwards, and accepts it only if it is in
// the folder the ticket was signed for — that one car's.

import { ApiError } from './errors';
import type { PhotoUploadTicket } from '@/types';

// Two minutes. A photo that has not arrived in two minutes is not going to,
// and a spinner that never stops is worse than "try again".
const UPLOAD_TIMEOUT_MS = 120_000;

export async function uploadPhoto(
  ticket: PhotoUploadTicket,
  photo: Blob,
  signal?: AbortSignal,
): Promise<string> {
  // Said before the upload, not after a minute of it.
  if (photo.size > ticket.maxBytes) {
    throw new ApiError({
      code: 'photo_too_large',
      message: 'That photo is too large to upload.',
      status: 0,
      developerHint: `${photo.size} bytes; the ticket allows ${ticket.maxBytes}.`,
    });
  }

  // The signed fields exactly as given, then the file.
  const form = new FormData();
  for (const [name, value] of Object.entries(ticket.fields)) form.append(name, value);
  form.append('file', photo, 'photo');

  // The caller's cancel and the clock, folded into one signal — by hand, for
  // the reason given on startClocks in lib/api/http.ts.
  const controller = new AbortController();
  let timedOut = false;
  const clock = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, UPLOAD_TIMEOUT_MS);
  const relay = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', relay, { once: true });

  let response: Response;
  try {
    response = await fetch(ticket.uploadUrl, {
      method: 'POST',
      body: form,
      signal: controller.signal,
      credentials: 'omit',
    });
  } catch (caught) {
    if (signal?.aborted) {
      throw new ApiError({ code: 'aborted', message: 'That upload was cancelled.', status: 0 });
    }
    if (timedOut) {
      throw new ApiError({
        code: 'timeout',
        message: 'The photo took too long to upload. Check your connection and try again.',
        status: 0,
      });
    }
    throw new ApiError({
      code: 'offline',
      message: 'The photo could not be uploaded. Check your connection and try again.',
      status: 0,
      cause: caught,
    });
  } finally {
    clearTimeout(clock);
    signal?.removeEventListener('abort', relay);
  }

  const text = await response.text().catch(() => '');
  let answer: unknown;
  try {
    answer = text ? JSON.parse(text) : undefined;
  } catch {
    answer = undefined;
  }

  const address =
    typeof answer === 'object' && answer !== null && 'secure_url' in answer
      ? (answer as { secure_url: unknown }).secure_url
      : undefined;
  if (response.ok && typeof address === 'string' && address.startsWith('https://')) return address;

  throw new ApiError({
    code: 'upload_failed',
    message: 'The photo could not be uploaded. Please try again.',
    status: response.status,
    developerHint: `The photo store answered ${response.status}: ${text.slice(0, 300)}`,
  });
}
