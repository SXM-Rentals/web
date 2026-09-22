// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Turns a refusal from the backend into the sentence the
// sign-in, sign-up and password pages show — in the reader's language where
// it matters most.
//
// ---- WHY THESE FEW ARE TRANSLATED AND THE REST ARE NOT ----
//
// Everywhere else the site shows the backend's own sentence, word for word,
// because the backend knows what actually failed (see lib/api/errors.ts). But
// the backend only writes English, and these pages are where a wrong
// password, a link that has run out, or a locked-out account are met most —
// by exactly the people least able to guess at a sentence in a language they
// do not read. So the handful of refusals these pages see every day have
// their own wording in all four languages.
//
// Anything rarer falls through to the backend's sentence. It is English, but
// it is specific, and a specific sentence in English beats a vague one in
// Dutch.

import { isApiError } from '@/lib/api/errors';
import type { TranslationKey } from '@/lib/i18n';

type Translate = (key: TranslationKey) => string;

export function authErrorMessage(caught: unknown, t: Translate): string {
  if (!isApiError(caught)) {
    return caught instanceof Error ? caught.message : String(caught);
  }

  switch (caught.code) {
    // Never "unauthorized": that means signed out, and a wrong password must
    // never be mistaken for it. See lib/api/errors.ts.
    case 'invalid_credentials':
      return t('authp.login.wrongPassword');
    case 'email_not_verified':
      return t('authp.login.notConfirmed');
    case 'rate_limited':
      return t('authp.login.tooMany');
    case 'password_breached':
      return t('authp.signup.passwordBreached');
    case 'offline':
      return t('error.offline');
    default:
      return caught.message;
  }
}

/**
 * Puts a value into a translated sentence at "{email}".
 *
 * The translations take no arguments, and word order differs between the four
 * languages, so a sentence cannot be glued together from halves. Each
 * translation carries the placeholder where its own grammar wants it.
 */
export function withEmail(sentence: string, email: string): string {
  return sentence.replace('{email}', email.trim());
}
