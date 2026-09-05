// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The words used all over the site — buttons, labels, and the handful
// of nouns that turn up on nearly every page.
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

export const common = {

  'common.continue': {
    en: 'Continue',
    nl: 'Doorgaan',
    fr: 'Continuer',
    es: 'Continuar',
  },
  'common.back': {
    en: 'Back',
    nl: 'Terug',
    fr: 'Retour',
    es: 'Atrás',
  },
  'common.next': {
    en: 'Next',
    nl: 'Volgende',
    fr: 'Suivant',
    es: 'Siguiente',
  },
  'common.done': {
    en: 'Done',
    nl: 'Klaar',
    fr: 'Terminé',
    es: 'Listo',
  },
  'common.cancel': {
    en: 'Cancel',
    nl: 'Annuleren',
    fr: 'Annuler',
    es: 'Cancelar',
  },
  'common.save': {
    en: 'Save changes',
    nl: 'Wijzigingen opslaan',
    fr: 'Enregistrer',
    es: 'Guardar cambios',
  },
  'common.confirm': {
    en: 'Confirm',
    nl: 'Bevestigen',
    fr: 'Confirmer',
    es: 'Confirmar',
  },
  'common.delete': {
    en: 'Delete',
    nl: 'Verwijderen',
    fr: 'Supprimer',
    es: 'Eliminar',
  },
  'common.close': {
    en: 'Close',
    nl: 'Sluiten',
    fr: 'Fermer',
    es: 'Cerrar',
  },
  'common.retry': {
    en: 'Try Again',
    nl: 'Opnieuw proberen',
    fr: 'Réessayer',
    es: 'Reintentar',
  },
  'common.viewAll': {
    en: 'View all',
    nl: 'Alles bekijken',
    fr: 'Tout voir',
    es: 'Ver todo',
  },
  'common.seeAll': {
    en: 'See all',
    nl: 'Alles zien',
    fr: 'Voir tout',
    es: 'Ver todos',
  },
  'common.clearAll': {
    en: 'Clear All',
    nl: 'Alles wissen',
    fr: 'Tout effacer',
    es: 'Borrar todo',
  },
  'common.apply': {
    en: 'Apply',
    nl: 'Toepassen',
    fr: 'Appliquer',
    es: 'Aplicar',
  },
  'common.search': {
    en: 'Search',
    nl: 'Zoeken',
    fr: 'Rechercher',
    es: 'Buscar',
  },
  'common.filters': {
    en: 'Filters',
    nl: 'Filters',
    fr: 'Filtres',
    es: 'Filtros',
  },
  'common.loading': {
    en: 'Loading',
    nl: 'Laden',
    fr: 'Chargement',
    es: 'Cargando',
  },
  'common.comingSoon': {
    en: 'Coming soon',
    nl: 'Binnenkort',
    fr: 'Bientôt disponible',
    es: 'Próximamente',
  },
  'common.optional': {
    en: 'Optional',
    nl: 'Optioneel',
    fr: 'Facultatif',
    es: 'Opcional',
  },
  'common.required': {
    en: 'Required',
    nl: 'Verplicht',
    fr: 'Obligatoire',
    es: 'Obligatorio',
  },
  'common.perDay': {
    en: 'per day',
    nl: 'per dag',
    fr: 'par jour',
    es: 'por día',
  },
  'common.perWeek': {
    en: 'per week',
    nl: 'per week',
    fr: 'par semaine',
    es: 'por semana',
  },
  'common.from': {
    en: 'From',
    nl: 'Van',
    fr: 'Du',
    es: 'Desde',
  },
  'common.to': {
    en: 'To',
    nl: 'Tot',
    fr: 'Au',
    es: 'Hasta',
  },
  'common.day': {
    en: 'Day',
    nl: 'Dag',
    fr: 'Jour',
    es: 'Día',
  },
  'common.days': {
    en: 'days',
    nl: 'dagen',
    fr: 'jours',
    es: 'días',
  },
  'common.week': {
    en: 'Week',
    nl: 'Week',
    fr: 'Semaine',
    es: 'Semana',
  },
  'common.night': {
    en: 'night',
    nl: 'nacht',
    fr: 'nuit',
    es: 'noche',
  },
  'common.reviews': {
    en: 'reviews',
    nl: 'beoordelingen',
    fr: 'avis',
    es: 'reseñas',
  },
  'common.demoNotice': {
    en: 'Demo mode — sample data, not connected to a backend.',
    nl: 'Demomodus — voorbeeldgegevens, niet verbonden met een server.',
    fr: 'Mode démo — données d’exemple, non reliées à un serveur.',
    es: 'Modo demo — datos de ejemplo, sin conexión a un servidor.',
  },
  'common.yes': {
    en: 'Yes',
    nl: 'Ja',
    fr: 'Oui',
    es: 'Sí',
  },
  'common.no': {
    en: 'No',
    nl: 'Nee',
    fr: 'Non',
    es: 'No',
  },
} satisfies Record<string, Phrase>;
