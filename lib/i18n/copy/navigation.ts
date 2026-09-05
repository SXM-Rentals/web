// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word in the navigation: the top bar, both sidebars, the
// account menu, and the labels screen readers announce.
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

export const navigation = {

  'nav.home': {
    en: 'Home',
    nl: 'Start',
    fr: 'Accueil',
    es: 'Inicio',
  },
  'nav.search': {
    en: 'Search',
    nl: 'Zoeken',
    fr: 'Rechercher',
    es: 'Buscar',
  },
  'nav.rentals': {
    en: 'Rentals',
    nl: 'Huurauto’s',
    fr: 'Locations',
    es: 'Alquileres',
  },
  'nav.messages': {
    en: 'Messages',
    nl: 'Berichten',
    fr: 'Messages',
    es: 'Mensajes',
  },
  'nav.rewards': {
    en: 'Rewards',
    nl: 'Voordelen',
    fr: 'Avantages',
    es: 'Recompensas',
  },
  'nav.profile': {
    en: 'Profile',
    nl: 'Profiel',
    fr: 'Profil',
    es: 'Perfil',
  },
  'web.nav.home': {
    en: 'Home',
    nl: 'Start',
    fr: 'Accueil',
    es: 'Inicio',
  },
  'web.nav.findCar': {
    en: 'Find a Car',
    nl: 'Auto Zoeken',
    fr: 'Trouver une Voiture',
    es: 'Buscar un Coche',
  },
  'web.nav.myRentals': {
    en: 'My Rentals',
    nl: 'Mijn Huurauto’s',
    fr: 'Mes Locations',
    es: 'Mis Alquileres',
  },
  'web.nav.messages': {
    en: 'Messages',
    nl: 'Berichten',
    fr: 'Messages',
    es: 'Mensajes',
  },
  'web.nav.notifications': {
    en: 'Notifications',
    nl: 'Meldingen',
    fr: 'Notifications',
    es: 'Notificaciones',
  },
  'web.nav.savedCars': {
    en: 'Saved Cars',
    nl: 'Opgeslagen Auto’s',
    fr: 'Voitures Enregistrées',
    es: 'Coches Guardados',
  },
  'web.nav.rewards': {
    en: 'Rewards',
    nl: 'Voordelen',
    fr: 'Avantages',
    es: 'Recompensas',
  },
  'web.nav.profile': {
    en: 'Profile',
    nl: 'Profiel',
    fr: 'Profil',
    es: 'Perfil',
  },
  'web.nav.account': {
    en: 'Account',
    nl: 'Account',
    fr: 'Compte',
    es: 'Cuenta',
  },
  'web.nav.documents': {
    en: 'Documents',
    nl: 'Documenten',
    fr: 'Documents',
    es: 'Documentos',
  },
  'web.nav.paymentMethods': {
    en: 'Payment Methods',
    nl: 'Betaalmethoden',
    fr: 'Moyens de Paiement',
    es: 'Métodos de Pago',
  },
  'web.nav.language': {
    en: 'Language',
    nl: 'Taal',
    fr: 'Langue',
    es: 'Idioma',
  },
  'web.nav.settings': {
    en: 'Settings',
    nl: 'Instellingen',
    fr: 'Réglages',
    es: 'Ajustes',
  },
  'web.nav.support': {
    en: 'Help and Support',
    nl: 'Hulp en Ondersteuning',
    fr: 'Aide et Assistance',
    es: 'Ayuda y Asistencia',
  },
  'web.nav.legal': {
    en: 'Legal and Policies',
    nl: 'Juridisch en Voorwaarden',
    fr: 'Mentions Légales',
    es: 'Aviso Legal y Condiciones',
  },
  'web.nav.business': {
    en: 'Business',
    nl: 'Zakelijk',
    fr: 'Professionnel',
    es: 'Empresa',
  },
  'web.nav.businessDashboard': {
    en: 'Business Dashboard',
    nl: 'Zakelijk Dashboard',
    fr: 'Espace Professionnel',
    es: 'Panel de Empresa',
  },
  'web.nav.listVehicles': {
    en: 'List Your Vehicles',
    nl: 'Plaats Uw Voertuigen',
    fr: 'Publier Vos Véhicules',
    es: 'Publique Sus Vehículos',
  },
  'web.nav.backToRenting': {
    en: 'Back to Renting',
    nl: 'Terug naar Huren',
    fr: 'Retour à la Location',
    es: 'Volver a Alquilar',
  },
  'web.group.browse': {
    en: 'Browse',
    nl: 'Bekijken',
    fr: 'Explorer',
    es: 'Explorar',
  },
  'web.group.yourRentals': {
    en: 'Your Rentals',
    nl: 'Uw Huurauto’s',
    fr: 'Vos Locations',
    es: 'Sus Alquileres',
  },
  'web.group.yourAccount': {
    en: 'Your Account',
    nl: 'Uw Account',
    fr: 'Votre Compte',
    es: 'Su Cuenta',
  },
  'web.menu.menu': {
    en: 'Menu',
    nl: 'Menu',
    fr: 'Menu',
    es: 'Menú',
  },
  'web.menu.accountMenu': {
    en: 'Your account menu',
    nl: 'Uw accountmenu',
    fr: 'Votre menu de compte',
    es: 'Su menú de cuenta',
  },
  'web.menu.signIn': {
    en: 'Sign In',
    nl: 'Inloggen',
    fr: 'Se Connecter',
    es: 'Iniciar Sesión',
  },
  'web.menu.signOut': {
    en: 'Log Out',
    nl: 'Uitloggen',
    fr: 'Se Déconnecter',
    es: 'Cerrar Sesión',
  },
  'web.a11y.sections': {
    en: 'Sections',
    nl: 'Secties',
    fr: 'Sections',
    es: 'Secciones',
  },
  'web.a11y.mainNav': {
    en: 'Main',
    nl: 'Hoofdmenu',
    fr: 'Principal',
    es: 'Principal',
  },
  'web.a11y.homeLink': {
    en: 'SXM Rentals, Go to the Homepage',
    nl: 'SXM Rentals, ga naar de startpagina',
    fr: 'SXM Rentals, aller à la page d’accueil',
    es: 'SXM Rentals, ir a la página de inicio',
  },
  'web.a11y.collapseSidebar': {
    en: 'Collapse the sidebar',
    nl: 'Zijbalk inklappen',
    fr: 'Réduire le menu latéral',
    es: 'Contraer la barra lateral',
  },
  'web.a11y.expandSidebar': {
    en: 'Expand the sidebar',
    nl: 'Zijbalk uitklappen',
    fr: 'Déployer le menu latéral',
    es: 'Desplegar la barra lateral',
  },
  'web.a11y.closeMenu': {
    en: 'Close the menu',
    nl: 'Menu sluiten',
    fr: 'Fermer le menu',
    es: 'Cerrar el menú',
  },
  'web.provider.overview': {
    en: 'Overview',
    nl: 'Overzicht',
    fr: 'Vue d’Ensemble',
    es: 'Resumen',
  },
  'web.provider.bookings': {
    en: 'Bookings',
    nl: 'Boekingen',
    fr: 'Réservations',
    es: 'Reservas',
  },
  'web.provider.fleet': {
    en: 'Fleet',
    nl: 'Wagenpark',
    fr: 'Flotte',
    es: 'Flota',
  },
  'web.provider.messages': {
    en: 'Messages',
    nl: 'Berichten',
    fr: 'Messages',
    es: 'Mensajes',
  },
  'web.provider.payouts': {
    en: 'Payouts',
    nl: 'Uitbetalingen',
    fr: 'Versements',
    es: 'Pagos',
  },
  'web.provider.performance': {
    en: 'Performance',
    nl: 'Prestaties',
    fr: 'Performance',
    es: 'Rendimiento',
  },
  'web.provider.promotions': {
    en: 'Promotions',
    nl: 'Acties',
    fr: 'Promotions',
    es: 'Promociones',
  },
  'web.provider.businessProfile': {
    en: 'Business Profile',
    nl: 'Bedrijfsprofiel',
    fr: 'Profil de l’Entreprise',
    es: 'Perfil de la Empresa',
  },
  'web.provider.groupRunning': {
    en: 'Running the Business',
    nl: 'Het Bedrijf Runnen',
    fr: 'Gérer l’Activité',
    es: 'Gestionar el Negocio',
  },
  'web.provider.groupMoney': {
    en: 'Money and Growth',
    nl: 'Geld en Groei',
    fr: 'Revenus et Croissance',
    es: 'Ingresos y Crecimiento',
  },
  'web.provider.groupYours': {
    en: 'Your Business',
    nl: 'Uw Bedrijf',
    fr: 'Votre Entreprise',
    es: 'Su Empresa',
  },
  'web.menu.appearance': {
    en: 'Appearance',
    nl: 'Weergave',
    fr: 'Apparence',
    es: 'Apariencia',
  },
  'web.menu.switchToLight': {
    en: 'Switch to light mode',
    nl: 'Overschakelen naar lichte modus',
    fr: 'Passer en mode clair',
    es: 'Cambiar al modo claro',
  },
  'web.menu.switchToDark': {
    en: 'Switch to dark mode',
    nl: 'Overschakelen naar donkere modus',
    fr: 'Passer en mode sombre',
    es: 'Cambiar al modo oscuro',
  },
  'web.menu.languageLabel': {
    en: 'Change language',
    nl: 'Taal wijzigen',
    fr: 'Changer de langue',
    es: 'Cambiar de idioma',
  },
  'web.menu.languageTitle': {
    en: 'Choose a Language',
    nl: 'Kies een Taal',
    fr: 'Choisir une Langue',
    es: 'Elija un Idioma',
  },
  'web.menu.languageSubtitle': {
    en: 'Covering both sides of the island, plus Spanish.',
    nl: 'Voor beide kanten van het eiland, plus Spaans.',
    fr: 'Pour les deux côtés de l’île, plus l’espagnol.',
    es: 'Para los dos lados de la isla, y también español.',
  },
} satisfies Record<string, Phrase>;
