// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The rental business side: applying to join, and the dashboard.
//
// EACH PHRASE CARRIES ALL FOUR LANGUAGES TOGETHER. That is the whole point of
// this format: to translate something you read the English on one line and
// write the other three underneath it, rather than opening four files and
// finding the same key in each. A missing translation is visible here; in four
// separate files it was invisible.
//
// The type in copy/index.ts requires all four, so a phrase cannot be added in
// English alone and quietly stay English forever.

import type { Phrase } from './types';

export const business = {

  'business.title': {
    en: 'Register as a business',
    nl: 'Als bedrijf aanmelden',
    fr: 'Inscrire mon entreprise',
    es: 'Registrar mi empresa',
  },
  'business.welcomeTitle': {
    en: 'List your fleet on SXM Rentals',
    nl: 'Zet uw wagenpark op SXM Rentals',
    fr: 'Proposez votre flotte sur SXM Rentals',
    es: 'Publique su flota en SXM Rentals',
  },
  'business.welcomeBody': {
    en: 'Reach visitors and residents across both sides of the island. Get verified, list your vehicles, and get paid.',
    nl: 'Bereik bezoekers en inwoners aan beide kanten van het eiland. Word geverifieerd, plaats uw voertuigen en word betaald.',
    fr: 'Touchez les visiteurs et les résidents des deux côtés de l’île. Faites-vous vérifier, publiez vos véhicules et soyez payé.',
    es: 'Llegue a visitantes y residentes de los dos lados de la isla. Verifíquese, publique sus vehículos y cobre.',
  },
  'business.ownerInfo': {
    en: 'Business owner details',
    nl: 'Gegevens van de eigenaar',
    fr: 'Coordonnées du responsable',
    es: 'Datos del responsable',
  },
  'business.vehicleInfo': {
    en: 'Vehicle details',
    nl: 'Voertuiggegevens',
    fr: 'Détails du véhicule',
    es: 'Datos del vehículo',
  },
  'business.payoutInfo': {
    en: 'How you get paid',
    nl: 'Hoe u betaald krijgt',
    fr: 'Comment vous êtes payé',
    es: 'Cómo se le paga',
  },
  'business.submit': {
    en: 'Submit application',
    nl: 'Aanvraag versturen',
    fr: 'Envoyer la demande',
    es: 'Enviar solicitud',
  },
  'business.successTitle': {
    en: 'Application received',
    nl: 'Aanvraag ontvangen',
    fr: 'Demande reçue',
    es: 'Solicitud recibida',
  },
  'business.successBody': {
    en: 'We\'ll review your details and vehicle documents, then get in touch. This usually takes a couple of days.',
    nl: 'Wij bekijken uw gegevens en voertuigdocumenten en nemen daarna contact op. Dit duurt meestal een paar dagen.',
    fr: 'Nous examinons vos informations et les documents de vos véhicules, puis nous vous recontactons. Cela prend en général quelques jours.',
    es: 'Revisaremos sus datos y los documentos de sus vehículos, y después nos pondremos en contacto. Normalmente tarda un par de días.',
  },
} satisfies Record<string, Phrase>;
