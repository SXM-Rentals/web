// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Words used by the pieces that appear on many pages — the
// footer, the calendar, the offline banner, error states, the messages view —
// in all four languages.
//
// THESE MATTER MORE THAN THEIR WORD COUNT SUGGESTS. A phrase here shows up on
// fifty pages. If it is left in English it is not one English sentence in a
// Dutch site; it is the same English sentence in the corner of every page, which
// reads less like an oversight and more like the translation was abandoned.
//
// THE OFFLINE AND ERROR MESSAGES ESPECIALLY. Somebody reading those is already
// having a bad time, and reading them in a language they do not speak is how a
// temporary problem becomes a closed tab.

import type { Phrase } from './types';

export const shared = {
  // ---- THE FOOTER ----
  'footer.follow': {
    en: 'Follow SXM Rentals',
    nl: 'Volg SXM Rentals',
    fr: 'Suivre SXM Rentals',
    es: 'Siga a SXM Rentals',
  },
  'footer.forBusinesses': {
    en: 'For Rental Businesses',
    nl: 'Voor Verhuurbedrijven',
    fr: 'Pour les Loueurs',
    es: 'Para Empresas de Alquiler',
  },
  'footer.rentingAVehicle': {
    en: 'Renting a Vehicle',
    nl: 'Een Voertuig Huren',
    fr: 'Louer un Véhicule',
    es: 'Alquilar un Vehículo',
  },
  'footer.platform': {
    en: 'Platform',
    nl: 'Platform',
    fr: 'Plateforme',
    es: 'Plataforma',
  },
  'footer.createAccount': {
    en: 'Create an Account',
    nl: 'Een Account Aanmaken',
    fr: 'Créer un Compte',
    es: 'Crear una Cuenta',
  },
  'footer.connectSystem': {
    en: 'Connect Your Booking System',
    nl: 'Koppel Uw Boekingssysteem',
    fr: 'Connecter Votre Système de Réservation',
    es: 'Conecte Su Sistema de Reservas',
  },
  'footer.providerTerms': {
    en: 'Provider Terms',
    nl: 'Voorwaarden voor Aanbieders',
    fr: 'Conditions Loueurs',
    es: 'Condiciones para Empresas',
  },
  'footer.commission': {
    en: 'Commission and Payouts',
    nl: 'Commissie en Uitbetalingen',
    fr: 'Commission et Versements',
    es: 'Comisión y Pagos',
  },
  'footer.legalAndPolicies': {
    en: 'Legal and Policies',
    nl: 'Juridisch en Voorwaarden',
    fr: 'Mentions Légales et Conditions',
    es: 'Aviso Legal y Condiciones',
  },
  'footer.demoNotice': {
    en: 'Demo build — sample data, not connected to a backend.',
    nl: 'Demoversie — voorbeeldgegevens, niet verbonden met een server.',
    fr: 'Version de démonstration — données d’exemple, non reliées à un serveur.',
    es: 'Versión de demostración — datos de ejemplo, sin conexión a un servidor.',
  },

  // ---- THE CALENDAR ----
  'calendar.chooseDates': {
    en: 'Choose Your Dates',
    nl: 'Kies uw data',
    fr: 'Choisissez vos dates',
    es: 'Elija sus fechas',
  },
  'calendar.yourDates': {
    en: 'Your dates',
    nl: 'Uw data',
    fr: 'Vos dates',
    es: 'Sus fechas',
  },
  'calendar.alreadyBooked': {
    en: 'Already booked',
    nl: 'Al geboekt',
    fr: 'Déjà réservé',
    es: 'Ya reservado',
  },

  // ---- WHEN SOMETHING GOES WRONG ----
  'error.pageTitle': {
    en: 'This page ran into a problem',
    nl: 'Deze pagina liep tegen een probleem aan',
    fr: 'Cette page a rencontré un problème',
    es: 'Esta página ha tenido un problema',
  },
  'error.pageMessage': {
    en: 'Something went wrong while showing this page. Reloading usually fixes it.',
    nl: 'Er ging iets mis bij het tonen van deze pagina. Opnieuw laden lost het meestal op.',
    fr: 'Une erreur est survenue en affichant cette page. Recharger règle généralement le problème.',
    es: 'Algo ha fallado al mostrar esta página. Recargar suele arreglarlo.',
  },
  'error.offline': {
    en: 'You are offline. Some things will not load until your connection comes back.',
    nl: 'U bent offline. Sommige onderdelen laden pas weer als uw verbinding terug is.',
    fr: 'Vous êtes hors ligne. Certains éléments ne se chargeront pas tant que la connexion n’est pas rétablie.',
    es: 'No tiene conexión. Algunas cosas no se cargarán hasta que vuelva.',
  },
  'error.dismiss': {
    en: 'Dismiss this message',
    nl: 'Dit bericht sluiten',
    fr: 'Fermer ce message',
    es: 'Cerrar este mensaje',
  },

  // ---- MESSAGES ----
  'messages.emptyTitle': {
    en: 'No messages yet',
    nl: 'Nog geen berichten',
    fr: 'Pas encore de messages',
    es: 'Todavía no hay mensajes',
  },
  'messages.emptyBodyLong': {
    en: 'Once you book a car, this is where you and the rental business talk — about collection, running late, or anything else.',
    nl: 'Zodra u een auto boekt, praat u hier met het verhuurbedrijf — over ophalen, later zijn, of wat dan ook.',
    fr: 'Une fois votre voiture réservée, c’est ici que vous échangez avec le loueur — pour le retrait, un retard, ou autre chose.',
    es: 'Cuando reserve un coche, aquí es donde habla con la empresa de alquiler: la recogida, un retraso o cualquier otra cosa.',
  },
  'messages.intro': {
    en: 'Talking to the businesses you have booked with. Everything stays on SXM Rentals.',
    nl: 'Praten met de bedrijven waar u heeft geboekt. Alles blijft binnen SXM Rentals.',
    fr: 'Vous échangez avec les loueurs chez qui vous avez réservé. Tout reste sur SXM Rentals.',
    es: 'Habla con las empresas donde ha reservado. Todo se queda dentro de SXM Rentals.',
  },
  'messages.viewBusiness': {
    en: 'View Business',
    nl: 'Bedrijf Bekijken',
    fr: 'Voir le Loueur',
    es: 'Ver la Empresa',
  },
  'messages.write': {
    en: 'Write a Message',
    nl: 'Schrijf een bericht',
    fr: 'Écrire un message',
    es: 'Escriba un mensaje',
  },
  'messages.send': {
    en: 'Send',
    nl: 'Verzenden',
    fr: 'Envoyer',
    es: 'Enviar',
  },
  'messages.demoNote': {
    en: 'Demo mode — replies you write here are not sent anywhere and disappear when the page is reloaded.',
    nl: 'Demomodus — antwoorden die u hier schrijft worden nergens verzonden en verdwijnen zodra de pagina opnieuw wordt geladen.',
    fr: 'Mode démo — les réponses écrites ici ne sont envoyées nulle part et disparaissent au rechargement de la page.',
    es: 'Modo demo: las respuestas que escriba aquí no se envían a ningún sitio y desaparecen al recargar la página.',
  },

  // ---- SMALL SHARED CONTROLS ----
  'shared.close': {
    en: 'Close',
    nl: 'Sluiten',
    fr: 'Fermer',
    es: 'Cerrar',
  },
  'shared.breadcrumb': {
    en: 'Breadcrumb',
    nl: 'Kruimelpad',
    fr: 'Fil d’Ariane',
    es: 'Ruta de navegación',
  },
  'shared.skipToContent': {
    en: 'Skip to the main content',
    nl: 'Ga direct naar de hoofdinhoud',
    fr: 'Aller directement au contenu principal',
    es: 'Saltar al contenido principal',
  },
  'shared.demoBanner': {
    en: 'Demo mode — sample data, not connected to a backend.',
    nl: 'Demomodus — voorbeeldgegevens, niet verbonden met een server.',
    fr: 'Mode démo — données d’exemple, non reliées à un serveur.',
    es: 'Modo demo: datos de ejemplo, sin conexión a un servidor.',
  },
} satisfies Record<string, Phrase>;
