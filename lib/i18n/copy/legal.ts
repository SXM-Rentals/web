// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The wording around the nineteen policy documents — the
// index page, the headings, the drafting notice — in all four languages.
//
// THE DOCUMENTS THEMSELVES ARE NOT TRANSLATED HERE, AND MUST NOT BE. This is
// the one deliberate exception on the whole site, so it is worth stating the
// reason plainly rather than leaving it to be discovered.
//
// A terms-of-service document is an agreement. If the Dutch version says
// something slightly different from the English — and a translation always says
// something slightly different — then there are two agreements, and the company
// has no way of knowing which one a customer accepted. That is not an untidy
// translation; it is a legal exposure, and it is created the moment somebody
// runs a policy through a translation tool to be helpful.
//
// So the documents stay in English, and the notice below says so in the
// reader's own language: here is what this covers, it is written in English,
// the English is the version that counts. When there is budget for a lawyer to
// draft the real ones, translating them is that lawyer's job — done by a person,
// signed off, and versioned alongside the original.

import type { Phrase } from './types';

export const legal = {
  // ---- THE INDEX ----
  'legal.title': {
    en: 'Legal and Policies',
    nl: 'Juridisch en voorwaarden',
    fr: 'Mentions légales et conditions',
    es: 'Aviso legal y condiciones',
  },
  'legal.subtitle': {
    en: 'All nineteen documents, grouped by what they cover. Every one has its own page and can be read without an account.',
    nl: 'Alle negentien documenten, gegroepeerd naar onderwerp. Elk heeft een eigen pagina en is te lezen zonder account.',
    fr: 'Les dix-neuf documents, regroupés par sujet. Chacun a sa propre page et peut être lu sans compte.',
    es: 'Los diecinueve documentos, agrupados por tema. Cada uno tiene su propia página y se puede leer sin cuenta.',
  },
  'legal.notFound': {
    en: 'Policy not found',
    nl: 'Voorwaarden niet gevonden',
    fr: 'Document introuvable',
    es: 'Documento no encontrado',
  },
  'legal.allPolicies': {
    en: 'All Policies',
    nl: 'Alle Voorwaarden',
    fr: 'Tous les Documents',
    es: 'Todos los Documentos',
  },
  'legal.onThisPage': {
    en: 'On This Page',
    nl: 'Op Deze Pagina',
    fr: 'Sur Cette Page',
    es: 'En Esta Página',
  },
  'legal.sectionsLabel': {
    en: 'Sections of this document',
    nl: 'Onderdelen van dit document',
    fr: 'Sections de ce document',
    es: 'Secciones de este documento',
  },

  // ---- THE THREE GROUPS ----
  'legal.tier.platform': {
    en: 'Platform',
    nl: 'Platform',
    fr: 'Plateforme',
    es: 'Plataforma',
  },
  'legal.tier.rental': {
    en: 'Renting a Vehicle',
    nl: 'Een Voertuig Huren',
    fr: 'Louer un Véhicule',
    es: 'Alquilar un Vehículo',
  },
  'legal.tier.provider': {
    en: 'For Rental Businesses',
    nl: 'Voor Verhuurbedrijven',
    fr: 'Pour les Loueurs',
    es: 'Para Empresas de Alquiler',
  },

  // ---- THESE ARE DRAFTS ----
  'legal.draftsTitle': {
    en: 'These Are Drafts',
    nl: 'Dit zijn concepten',
    fr: 'Ce sont des brouillons',
    es: 'Estos son borradores',
  },
  'legal.draftsBody': {
    en: 'The headings below are real — they are what each document has to cover. The',
    nl: 'De koppen hieronder zijn echt — dat is wat elk document moet behandelen. De',
    fr: 'Les titres ci-dessous sont réels — c’est ce que chaque document doit couvrir. Le',
    es: 'Los encabezados de abajo son reales: es lo que cada documento tiene que cubrir. El',
  },
  'legal.draftTitle': {
    en: 'Draft Wording',
    nl: 'Conceptversie',
    fr: 'Texte provisoire',
    es: 'Texto provisional',
  },
  'legal.draftSettled': {
    en: 'The headings below are settled — they are what this document has to cover.',
    nl: 'De koppen hieronder liggen vast — dat is wat dit document moet behandelen.',
    fr: 'Les titres ci-dessous sont arrêtés — c’est ce que ce document doit couvrir.',
    es: 'Los encabezados de abajo están fijados: es lo que este documento tiene que cubrir.',
  },
  'legal.draftNotWritten': {
    en: 'The text under each one has not been written yet, and will be drafted and',
    nl: 'De tekst onder elke kop is nog niet geschreven en wordt opgesteld en',
    fr: 'Le texte sous chacun n’a pas encore été rédigé ; il sera écrit et',
    es: 'El texto de cada uno todavía no está escrito, y lo redactará y',
  },

  // ---- WHY THE DOCUMENTS ARE IN ENGLISH ----
  'legal.englishOnlyTitle': {
    en: 'These documents are in English',
    nl: 'Deze documenten zijn in het Engels',
    fr: 'Ces documents sont en anglais',
    es: 'Estos documentos están en inglés',
  },
  'legal.englishOnlyBody': {
    en: 'The rest of the site is translated, but the policies are not — deliberately. A translated agreement is a second agreement, and if the two ever disagree there is no way to know which one you accepted. The English version is the one that counts. Proper translations will be prepared by a lawyer alongside the final documents.',
    nl: 'De rest van de site is vertaald, maar de voorwaarden bewust niet. Een vertaalde overeenkomst is een tweede overeenkomst, en als de twee ooit van elkaar afwijken valt niet vast te stellen welke u heeft aanvaard. De Engelse versie is de versie die geldt. Goede vertalingen worden samen met de definitieve documenten door een jurist opgesteld.',
    fr: 'Le reste du site est traduit, mais pas les conditions — et c’est délibéré. Un contrat traduit est un second contrat, et si les deux divergent, il devient impossible de savoir lequel vous avez accepté. La version anglaise est celle qui fait foi. De véritables traductions seront préparées par un juriste en même temps que les documents définitifs.',
    es: 'El resto del sitio está traducido, pero las condiciones no, y es a propósito. Un contrato traducido es un segundo contrato, y si ambos llegan a diferir no hay forma de saber cuál aceptó usted. La versión en inglés es la que cuenta. Un abogado preparará las traducciones adecuadas junto con los documentos definitivos.',
  },
} satisfies Record<string, Phrase>;
