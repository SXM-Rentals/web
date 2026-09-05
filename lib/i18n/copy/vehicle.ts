// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word on a car's page and a rental business's page,
// in all four languages.
//
// THE DEPOSIT WORDING IN HERE IS THE MOST IMPORTANT TEXT ON THE SITE, and it is
// worth being explicit about why. A security deposit is held on a card and given
// back; it is not a charge. Somebody who misreads that thinks a $65 car costs
// $565, and either walks away or books believing they have been overcharged.
// Every language has a specific word for money held rather than paid — borgsom,
// caution, fianza — and each of them is used here rather than a literal
// translation of "deposit", which in French especially would read as money
// handed over and not coming back.
//
// SXM VERIFIED IS NOT TRANSLATED. It is the name of the check, the way a brand
// name is, and it appears on a badge that people learn to recognise. The
// sentence explaining what it means is translated; the two words are not.

import type { Phrase } from './types';

export const vehicle = {
  // ---- AT A GLANCE ----
  'vehicle.atAGlance': {
    en: 'At a glance',
    nl: 'In het kort',
    fr: 'En bref',
    es: 'De un vistazo',
  },
  'vehicle.about': {
    en: 'About this car',
    nl: 'Over deze auto',
    fr: 'À propos de cette voiture',
    es: 'Sobre este coche',
  },
  'vehicle.rentedBy': {
    en: 'Rented out by',
    nl: 'Verhuurd door',
    fr: 'Loué par',
    es: 'Alquilado por',
  },
  'vehicle.beforeYouBook': {
    en: 'Before you book',
    nl: 'Voordat u boekt',
    fr: 'Avant de réserver',
    es: 'Antes de reservar',
  },
  'vehicle.notFound': {
    en: 'Car not found',
    nl: 'Auto niet gevonden',
    fr: 'Voiture introuvable',
    es: 'Coche no encontrado',
  },
  'vehicle.aircon': {
    en: 'Air Con',
    nl: 'Airco',
    fr: 'Clim',
    es: 'Aire ac.',
  },
  'vehicle.viewFleet': {
    en: 'View Fleet',
    nl: 'Wagenpark Bekijken',
    fr: 'Voir la Flotte',
    es: 'Ver la Flota',
  },
  'vehicle.weeklyRate': {
    en: 'Weekly rate',
    nl: 'Weektarief',
    fr: 'Tarif hebdomadaire',
    es: 'Tarifa semanal',
  },

  // ---- THE DEPOSIT ----
  'vehicle.deposit.heldNotTaken': {
    en: 'It is held, not taken',
    nl: 'Het wordt gereserveerd, niet afgeschreven',
    fr: 'Elle est bloquée, pas prélevée',
    es: 'Se retiene, no se cobra',
  },
  'vehicle.deposit.shortBody': {
    en: 'Held on your card while you have the car and released when you bring it back.',
    nl: 'Wordt op uw kaart gereserveerd zolang u de auto heeft en vrijgegeven wanneer u hem terugbrengt.',
    fr: 'Bloquée sur votre carte pendant la location et libérée dès que vous rendez la voiture.',
    es: 'Se retiene en su tarjeta mientras tiene el coche y se libera cuando lo devuelve.',
  },
  'vehicle.deposit.notACharge': {
    en: 'This is not a charge.',
    nl: 'Dit is geen afschrijving.',
    fr: 'Ce n’est pas un débit.',
    es: 'No es un cobro.',
  },
  'vehicle.deposit.setForVehicle': {
    en: 'SET FOR THIS VEHICLE',
    nl: 'GELDT VOOR DIT VOERTUIG',
    fr: 'PROPRE À CE VÉHICULE',
    es: 'FIJADA PARA ESTE VEHÍCULO',
  },
  'vehicle.deposit.howItWorks': {
    en: 'How the deposit works',
    nl: 'Hoe de borgsom werkt',
    fr: 'Comment fonctionne la caution',
    es: 'Cómo funciona la fianza',
  },
  'vehicle.deposit.whenTitle': {
    en: 'When it happens',
    nl: 'Wanneer het gebeurt',
    fr: 'Quand cela se passe',
    es: 'Cuándo ocurre',
  },
  'vehicle.deposit.whenBody': {
    en: 'The hold is placed shortly before you collect the car, not when you book.',
    nl: 'De reservering wordt kort voor het ophalen van de auto geplaatst, niet bij het boeken.',
    fr: 'Le blocage est effectué peu avant que vous récupériez la voiture, pas au moment de la réservation.',
    es: 'La retención se hace poco antes de recoger el coche, no al reservar.',
  },
  'vehicle.deposit.backTitle': {
    en: 'Getting it back',
    nl: 'Het terugkrijgen',
    fr: 'La récupérer',
    es: 'Recuperarla',
  },
  'vehicle.deposit.backBody': {
    en: 'Once the car is returned and checked, the hold is released. Banks usually free the money within a few working days.',
    nl: 'Zodra de auto is teruggebracht en gecontroleerd, wordt de reservering opgeheven. Banken geven het bedrag meestal binnen enkele werkdagen vrij.',
    fr: 'Une fois la voiture rendue et vérifiée, le blocage est levé. Les banques libèrent généralement la somme sous quelques jours ouvrés.',
    es: 'Cuando el coche se devuelve y se revisa, se levanta la retención. Los bancos suelen liberar el dinero en unos pocos días laborables.',
  },
  'vehicle.deposit.takenTitle': {
    en: 'When money is taken from it',
    nl: 'Wanneer er geld van af gaat',
    fr: 'Quand de l’argent en est prélevé',
    es: 'Cuándo se descuenta algo',
  },
  'vehicle.deposit.takenBody': {
    en: 'Only for damage, a late return, missing fuel or a traffic fine — and the business has to tell you why. You can dispute it.',
    nl: 'Alleen bij schade, te laat terugbrengen, ontbrekende brandstof of een verkeersboete — en het bedrijf moet u vertellen waarom. U kunt bezwaar maken.',
    fr: 'Uniquement pour des dommages, un retard, du carburant manquant ou une amende — et le loueur doit vous en donner la raison. Vous pouvez la contester.',
    es: 'Solo por daños, devolución tardía, falta de combustible o una multa de tráfico, y la empresa tiene que explicarle el motivo. Puede reclamar.',
  },
  'vehicle.deposit.readPolicy': {
    en: 'Read the full Security Deposit Policy',
    nl: 'Lees het volledige borgsombeleid',
    fr: 'Lire la politique de caution complète',
    es: 'Leer la política de fianzas completa',
  },
  'vehicle.deposit.gotIt': {
    en: 'Got It',
    nl: 'Begrepen',
    fr: 'Compris',
    es: 'Entendido',
  },

  // ---- ACCIDENT HISTORY ----
  'vehicle.accidents.title': {
    en: 'Accident History',
    nl: 'Schadeverleden',
    fr: 'Historique des accidents',
    es: 'Historial de accidentes',
  },
  'vehicle.accidents.repaired': {
    en: 'REPAIRED',
    nl: 'HERSTELD',
    fr: 'RÉPARÉ',
    es: 'REPARADO',
  },
  'vehicle.accidents.none': {
    en: 'No accidents reported for this vehicle.',
    nl: 'Geen schade gemeld voor dit voertuig.',
    fr: 'Aucun accident signalé pour ce véhicule.',
    es: 'No se han declarado accidentes para este vehículo.',
  },
  'vehicle.accidents.disclaimer': {
    en: 'As reported by the provider. SXM Rentals does not inspect vehicles or independently confirm this history.',
    nl: 'Zoals opgegeven door de verhuurder. SXM Rentals inspecteert geen voertuigen en bevestigt deze historie niet zelfstandig.',
    fr: 'Tel que déclaré par le loueur. SXM Rentals n’inspecte pas les véhicules et ne vérifie pas cet historique de façon indépendante.',
    es: 'Según lo declarado por la empresa. SXM Rentals no inspecciona los vehículos ni confirma este historial de forma independiente.',
  },
  'vehicle.rentalPeriodTitle': {
    en: 'Rental Period',
    nl: 'Huurperiode',
    fr: 'Durée de location',
    es: 'Duración del alquiler',
  },

  // ---- THE BOOKING PANEL ----
  'vehicle.panel.yourDates': {
    en: 'Your Dates',
    nl: 'Uw Data',
    fr: 'Vos Dates',
    es: 'Sus Fechas',
  },
  'vehicle.panel.chooseDates': {
    en: 'Choose Your Dates',
    nl: 'Kies uw data',
    fr: 'Choisissez vos dates',
    es: 'Elija sus fechas',
  },
  'vehicle.panel.depositNote': {
    en: 'Held on your card just before pickup and released when you return the car. Not included in the total above.',
    nl: 'Wordt vlak voor het ophalen op uw kaart gereserveerd en vrijgegeven wanneer u de auto terugbrengt. Niet inbegrepen in het totaal hierboven.',
    fr: 'Bloquée sur votre carte juste avant le retrait et libérée quand vous rendez la voiture. Non comprise dans le total ci-dessus.',
    es: 'Se retiene en su tarjeta justo antes de la recogida y se libera cuando devuelve el coche. No está incluida en el total de arriba.',
  },
  'vehicle.panel.notChargedYet': {
    en: 'You will not be charged yet. The next step confirms the trip before any payment is taken.',
    nl: 'Er wordt nog niets afgeschreven. De volgende stap bevestigt de reis voordat er wordt betaald.',
    fr: 'Rien ne vous sera débité pour l’instant. L’étape suivante confirme le trajet avant tout paiement.',
    es: 'Todavía no se le cobrará nada. El siguiente paso confirma el viaje antes de cobrar.',
  },

  // ---- SXM VERIFIED ----
  'vehicle.verified.badgeLabel': {
    en: 'SXM Verified. Read what this checks and what it does not.',
    nl: 'SXM Verified. Lees wat hiermee wel en niet wordt gecontroleerd.',
    fr: 'SXM Verified. Lisez ce que cela vérifie et ce que cela ne vérifie pas.',
    es: 'SXM Verified. Lea qué comprueba esto y qué no.',
  },
  'vehicle.verified.title': {
    en: 'What SXM Verified means',
    nl: 'Wat SXM Verified betekent',
    fr: 'Ce que signifie SXM Verified',
    es: 'Qué significa SXM Verified',
  },
  'vehicle.verified.aboutBusiness': {
    en: 'This badge is about the business, not a guarantee about the car.',
    nl: 'Dit label gaat over het bedrijf, het is geen garantie over de auto.',
    fr: 'Ce badge concerne l’entreprise, ce n’est pas une garantie sur le véhicule.',
    es: 'Esta insignia se refiere a la empresa, no es una garantía sobre el coche.',
  },
  'vehicle.verified.whatWeCheck': {
    en: 'What we check',
    nl: 'Wat wij controleren',
    fr: 'Ce que nous vérifions',
    es: 'Qué comprobamos',
  },
  'vehicle.verified.whatItDoesNot': {
    en: 'What it does not guarantee',
    nl: 'Wat het niet garandeert',
    fr: 'Ce que cela ne garantit pas',
    es: 'Qué no garantiza',
  },

  // ---- REVIEWS ----
  'vehicle.reviews.readAll': {
    en: 'Read All Reviews',
    nl: 'Alle Beoordelingen Lezen',
    fr: 'Lire Tous les Avis',
    es: 'Leer Todas las Reseñas',
  },
  'vehicle.reviews.noneInline': {
    en: 'No reviews for this car yet. Reviews can only be left by someone who has',
    nl: 'Nog geen beoordelingen voor deze auto. Beoordelingen kunnen alleen worden achtergelaten door iemand die',
    fr: 'Pas encore d’avis pour cette voiture. Seule une personne ayant',
    es: 'Todavía no hay reseñas de este coche. Solo puede dejar una reseña alguien que',
  },
  'vehicle.reviews.title': {
    en: 'Reviews',
    nl: 'Beoordelingen',
    fr: 'Avis',
    es: 'Reseñas',
  },
  'vehicle.reviews.subtitle': {
    en: 'Only someone who has actually rented this car can leave a review.',
    nl: 'Alleen iemand die deze auto daadwerkelijk heeft gehuurd kan een beoordeling achterlaten.',
    fr: 'Seule une personne ayant réellement loué cette voiture peut laisser un avis.',
    es: 'Solo quien haya alquilado realmente este coche puede dejar una reseña.',
  },
  'vehicle.reviews.emptyTitle': {
    en: 'No reviews yet',
    nl: 'Nog geen beoordelingen',
    fr: 'Pas encore d’avis',
    es: 'Todavía no hay reseñas',
  },
  'vehicle.reviews.emptyBody': {
    en: 'This car has not been reviewed. Reviews appear once someone has rented it and returned it.',
    nl: 'Deze auto is nog niet beoordeeld. Beoordelingen verschijnen zodra iemand hem heeft gehuurd en teruggebracht.',
    fr: 'Cette voiture n’a pas encore été évaluée. Les avis apparaissent une fois qu’elle a été louée et rendue.',
    es: 'Este coche todavía no tiene valoraciones. Las reseñas aparecen cuando alguien lo alquila y lo devuelve.',
  },

  // ---- A RENTAL BUSINESS'S OWN PAGE ----
  'provider.notFound': {
    en: 'Rental business not found',
    nl: 'Verhuurbedrijf niet gevonden',
    fr: 'Loueur introuvable',
    es: 'Empresa de alquiler no encontrada',
  },
  'provider.deliversVehicles': {
    en: 'DELIVERS VEHICLES',
    nl: 'BEZORGT VOERTUIGEN',
    fr: 'LIVRE LES VÉHICULES',
    es: 'ENTREGA VEHÍCULOS',
  },
  'provider.airportCollection': {
    en: 'AIRPORT COLLECTION',
    nl: 'OPHALEN OP HET VLIEGVELD',
    fr: 'RETRAIT À L’AÉROPORT',
    es: 'RECOGIDA EN EL AEROPUERTO',
  },
  'provider.messageNote': {
    en: 'Message this business through SXM Rentals once you have a booking. Keeping',
    nl: 'Stuur dit bedrijf een bericht via SXM Rentals zodra u een boeking heeft. Door',
    fr: 'Écrivez à ce loueur via SXM Rentals une fois votre réservation faite. Garder',
    es: 'Escriba a esta empresa a través de SXM Rentals cuando tenga una reserva. Mantener',
  },
  'provider.noCarsTitle': {
    en: 'No cars listed right now',
    nl: 'Op dit moment geen auto’s beschikbaar',
    fr: 'Aucune voiture proposée pour le moment',
    es: 'Ahora mismo no hay coches publicados',
  },
  'provider.noCarsBody': {
    en: 'This business has no vehicles available at the moment. They may be adding some, or everything may currently be out on rental.',
    nl: 'Dit bedrijf heeft momenteel geen voertuigen beschikbaar. Mogelijk worden er nog toegevoegd, of is alles op dit moment verhuurd.',
    fr: 'Ce loueur n’a aucun véhicule disponible pour l’instant. Il est possible qu’il en ajoute, ou que tout soit actuellement en location.',
    es: 'Esta empresa no tiene vehículos disponibles en este momento. Puede que esté añadiendo alguno, o que todo esté alquilado ahora mismo.',
  },
  'vehicle.depositLabel': {
    en: 'Security deposit',
    nl: 'Borgsom',
    fr: 'Caution',
    es: 'Fianza',
  },
} satisfies Record<string, Phrase>;
