// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A customer's own area — their rentals, messages, notifications,
// rewards, profile and settings.
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

export const account = {

  'rentals.upcoming': {
    en: 'Upcoming',
    nl: 'Aankomend',
    fr: 'À venir',
    es: 'Próximos',
  },
  'rentals.active': {
    en: 'Active',
    nl: 'Loopt nu',
    fr: 'En cours',
    es: 'En curso',
  },
  'rentals.past': {
    en: 'Past',
    nl: 'Afgerond',
    fr: 'Terminées',
    es: 'Anteriores',
  },
  'rentals.none': {
    en: 'Nothing here yet',
    nl: 'Nog niets hier',
    fr: 'Rien pour le moment',
    es: 'Aquí todavía no hay nada',
  },
  'rentals.noneBody': {
    en: 'When you book a car it will appear here.',
    nl: 'Zodra u een auto boekt verschijnt die hier.',
    fr: 'Vos réservations apparaîtront ici.',
    es: 'Cuando reserve un coche aparecerá aquí.',
  },
  'rentals.extend': {
    en: 'Extend rental',
    nl: 'Huur verlengen',
    fr: 'Prolonger la location',
    es: 'Ampliar el alquiler',
  },
  'rentals.cancel': {
    en: 'Cancel rental',
    nl: 'Huur annuleren',
    fr: 'Annuler la location',
    es: 'Cancelar el alquiler',
  },
  'rentals.contactProvider': {
    en: 'Message provider',
    nl: 'Verhuurder berichten',
    fr: 'Écrire au loueur',
    es: 'Escribir a la empresa',
  },
  'rentals.callProvider': {
    en: 'Call provider',
    nl: 'Verhuurder bellen',
    fr: 'Appeler le loueur',
    es: 'Llamar a la empresa',
  },
  'rentals.emergency': {
    en: 'Emergency support',
    nl: 'Noodhulp',
    fr: 'Assistance d’urgence',
    es: 'Asistencia de emergencia',
  },
  'rentals.receipt': {
    en: 'Receipt',
    nl: 'Bon',
    fr: 'Reçu',
    es: 'Recibo',
  },
  'rentals.agreement': {
    en: 'Signed agreement',
    nl: 'Ondertekende overeenkomst',
    fr: 'Contrat signé',
    es: 'Contrato firmado',
  },
  'messages.title': {
    en: 'Messages',
    nl: 'Berichten',
    fr: 'Messages',
    es: 'Mensajes',
  },
  'messages.empty': {
    en: 'No messages yet',
    nl: 'Nog geen berichten',
    fr: 'Aucun message',
    es: 'Todavía no hay mensajes',
  },
  'messages.emptyBody': {
    en: 'Once you book a car you can message the rental business here.',
    nl: 'Zodra u een auto boekt kunt u het verhuurbedrijf hier berichten.',
    fr: 'Une fois votre voiture réservée, vous pourrez écrire au loueur ici.',
    es: 'Cuando reserve un coche podrá escribir aquí a la empresa de alquiler.',
  },
  'messages.placeholder': {
    en: 'Write a Message',
    nl: 'Schrijf een bericht',
    fr: 'Écrivez un message',
    es: 'Escriba un mensaje',
  },
  'notifications.title': {
    en: 'Notifications',
    nl: 'Meldingen',
    fr: 'Notifications',
    es: 'Notificaciones',
  },
  'notifications.today': {
    en: 'Today',
    nl: 'Vandaag',
    fr: 'Aujourd’hui',
    es: 'Hoy',
  },
  'notifications.earlier': {
    en: 'Earlier',
    nl: 'Eerder',
    fr: 'Plus tôt',
    es: 'Antes',
  },
  'notifications.unread': {
    en: 'unread',
    nl: 'ongelezen',
    fr: 'non lues',
    es: 'sin leer',
  },
  'notifications.empty': {
    en: 'No notifications',
    nl: 'Geen meldingen',
    fr: 'Aucune notification',
    es: 'Sin notificaciones',
  },
  'notifications.emptyBody': {
    en: 'You\'re all caught up. We\'ll let you know when something happens.',
    nl: 'U bent helemaal bij. Wij laten het weten als er iets gebeurt.',
    fr: 'Vous êtes à jour. Nous vous préviendrons dès qu’il se passe quelque chose.',
    es: 'Está al día. Le avisaremos cuando ocurra algo.',
  },
  'notifications.deleteTitle': {
    en: 'Delete these notifications?',
    nl: 'Deze meldingen verwijderen?',
    fr: 'Supprimer ces notifications ?',
    es: '¿Eliminar estas notificaciones?',
  },
  'notifications.deleteBody': {
    en: 'This cannot be undone.',
    nl: 'Dit kan niet ongedaan worden gemaakt.',
    fr: 'Cette action est définitive.',
    es: 'Esto no se puede deshacer.',
  },
  'rewards.title': {
    en: 'Rewards',
    nl: 'Voordelen',
    fr: 'Avantages',
    es: 'Recompensas',
  },
  'rewards.comingSoon': {
    en: 'Rewards are coming soon',
    nl: 'Voordelen komen binnenkort',
    fr: 'Les avantages arrivent bientôt',
    es: 'Las recompensas llegan pronto',
  },
  'rewards.comingSoonBody': {
    en: 'Here\'s a preview of how it will work. Points aren\'t being earned yet.',
    nl: 'Dit is een voorproefje van hoe het gaat werken. Er worden nog geen punten verdiend.',
    fr: 'Voici un aperçu du fonctionnement. Aucun point n’est encore cumulé.',
    es: 'Esto es un adelanto de cómo funcionará. Todavía no se acumulan puntos.',
  },
  'rewards.points': {
    en: 'points',
    nl: 'punten',
    fr: 'points',
    es: 'puntos',
  },
  'rewards.tier': {
    en: 'Tier',
    nl: 'Niveau',
    fr: 'Niveau',
    es: 'Nivel',
  },
  'rewards.nextTier': {
    en: 'to reach',
    nl: 'tot',
    fr: 'pour atteindre',
    es: 'para llegar a',
  },
  'rewards.howToEarn': {
    en: 'How you earn points',
    nl: 'Hoe u punten verdient',
    fr: 'Comment gagner des points',
    es: 'Cómo se ganan puntos',
  },
  'rewards.benefits': {
    en: 'Example rewards',
    nl: 'Voorbeelden van voordelen',
    fr: 'Exemples d’avantages',
    es: 'Ejemplos de recompensas',
  },
  'rewards.benefitsNote': {
    en: 'Examples of what the scheme could offer — not a final list.',
    nl: 'Voorbeelden van wat het programma kan bieden — nog geen definitieve lijst.',
    fr: 'Exemples de ce que le programme pourrait offrir — la liste n’est pas définitive.',
    es: 'Ejemplos de lo que podría ofrecer el programa — no es una lista definitiva.',
  },
  'rewards.islander': {
    en: 'Islander',
    nl: 'Islander',
    fr: 'Islander',
    es: 'Islander',
  },
  'rewards.islanderBody': {
    en: 'Given to verified residents of Sint Maarten and Saint-Martin. It reflects where you live, not how much you spend, and it never expires.',
    nl: 'Voor geverifieerde inwoners van Sint Maarten en Saint-Martin. Het gaat om waar u woont, niet om hoeveel u uitgeeft, en het vervalt nooit.',
    fr: 'Réservé aux résidents vérifiés de Saint-Martin et de Sint Maarten. Il dépend de votre lieu de résidence, pas de vos dépenses, et n’expire jamais.',
    es: 'Para residentes verificados de Sint Maarten y Saint-Martin. Depende de dónde vive, no de cuánto gasta, y no caduca nunca.',
  },
  'profile.editProfile': {
    en: 'Edit profile',
    nl: 'Profiel bewerken',
    fr: 'Modifier le profil',
    es: 'Editar perfil',
  },
  'profile.general': {
    en: 'General',
    nl: 'Algemeen',
    fr: 'Général',
    es: 'General',
  },
  'profile.favourites': {
    en: 'Saved cars',
    nl: 'Opgeslagen auto’s',
    fr: 'Voitures enregistrées',
    es: 'Coches guardados',
  },
  'profile.documents': {
    en: 'Receipts & agreements',
    nl: 'Bonnen en overeenkomsten',
    fr: 'Reçus et contrats',
    es: 'Recibos y contratos',
  },
  'profile.paymentMethods': {
    en: 'Payment methods',
    nl: 'Betaalmethoden',
    fr: 'Moyens de paiement',
    es: 'Métodos de pago',
  },
  'profile.support': {
    en: 'Support',
    nl: 'Hulp',
    fr: 'Aide',
    es: 'Ayuda',
  },
  'profile.settings': {
    en: 'Settings',
    nl: 'Instellingen',
    fr: 'Réglages',
    es: 'Ajustes',
  },
  'profile.language': {
    en: 'Language',
    nl: 'Taal',
    fr: 'Langue',
    es: 'Idioma',
  },
  'profile.legal': {
    en: 'Legal',
    nl: 'Juridisch',
    fr: 'Mentions légales',
    es: 'Aviso legal',
  },
  'profile.registerBusiness': {
    en: 'Register as a business',
    nl: 'Als bedrijf aanmelden',
    fr: 'Inscrire mon entreprise',
    es: 'Registrar mi empresa',
  },
  'profile.verification': {
    en: 'Identity verification',
    nl: 'Identiteitsverificatie',
    fr: 'Vérification d’identité',
    es: 'Verificación de identidad',
  },
  'settings.appearance': {
    en: 'Appearance',
    nl: 'Weergave',
    fr: 'Apparence',
    es: 'Apariencia',
  },
  'settings.system': {
    en: 'Match my phone',
    nl: 'Volg mijn apparaat',
    fr: 'Suivre mon appareil',
    es: 'Seguir mi dispositivo',
  },
  'settings.light': {
    en: 'Light',
    nl: 'Licht',
    fr: 'Clair',
    es: 'Claro',
  },
  'settings.dark': {
    en: 'Dark',
    nl: 'Donker',
    fr: 'Sombre',
    es: 'Oscuro',
  },
  'settings.notifications': {
    en: 'Push notifications',
    nl: 'Pushmeldingen',
    fr: 'Notifications push',
    es: 'Notificaciones push',
  },
  'settings.biometrics': {
    en: 'Sign in with Face ID',
    nl: 'Inloggen met Face ID',
    fr: 'Se connecter avec Face ID',
    es: 'Iniciar sesión con Face ID',
  },
} satisfies Record<string, Phrase>;
