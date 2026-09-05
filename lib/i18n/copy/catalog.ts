// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Browsing for a vehicle, and everything on a single car's page.
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

export const catalog = {

  'catalog.cars': {
    en: 'Cars',
    nl: 'Auto’s',
    fr: 'Voitures',
    es: 'Coches',
  },
  'catalog.atvs': {
    en: 'ATVs',
    nl: 'Quads',
    fr: 'Quads',
    es: 'Quads',
  },
  'catalog.boats': {
    en: 'Boats',
    nl: 'Boten',
    fr: 'Bateaux',
    es: 'Barcos',
  },
  'catalog.bikes': {
    en: 'Bikes',
    nl: 'Scooters',
    fr: 'Scooters',
    es: 'Motos',
  },
  'catalog.searchPlaceholder': {
    en: 'Search make, model or town',
    nl: 'Zoek op merk, model of plaats',
    fr: 'Marque, modèle ou ville',
    es: 'Marca, modelo o localidad',
  },
  'catalog.availableNow': {
    en: 'Available now',
    nl: 'Nu beschikbaar',
    fr: 'Disponible maintenant',
    es: 'Disponible ahora',
  },
  'catalog.nearYou': {
    en: 'Near you',
    nl: 'Bij u in de buurt',
    fr: 'Près de vous',
    es: 'Cerca de usted',
  },
  'catalog.recommended': {
    en: 'Recommended for you',
    nl: 'Aanbevolen voor u',
    fr: 'Recommandé pour vous',
    es: 'Recomendado para usted',
  },
  'catalog.popular': {
    en: 'Popular on the island',
    nl: 'Populair op het eiland',
    fr: 'Populaire sur l’île',
    es: 'Popular en la isla',
  },
  'catalog.noResults': {
    en: 'No cars match your filters',
    nl: 'Geen auto’s passen bij uw filters',
    fr: 'Aucune voiture ne correspond à vos filtres',
    es: 'Ningún coche coincide con sus filtros',
  },
  'catalog.noResultsBody': {
    en: 'Try widening your dates, price range or pickup area.',
    nl: 'Probeer uw data, prijsklasse of ophaalgebied ruimer te maken.',
    fr: 'Élargissez vos dates, votre budget ou la zone de retrait.',
    es: 'Pruebe a ampliar las fechas, el precio o la zona de recogida.',
  },
  'catalog.listView': {
    en: 'List',
    nl: 'Lijst',
    fr: 'Liste',
    es: 'Lista',
  },
  'catalog.mapView': {
    en: 'Map',
    nl: 'Kaart',
    fr: 'Carte',
    es: 'Mapa',
  },
  'catalog.addDates': {
    en: 'Add trip dates',
    nl: 'Reisdata toevoegen',
    fr: 'Ajouter vos dates',
    es: 'Añadir fechas',
  },
  'catalog.anywhere': {
    en: 'Anywhere on the island',
    nl: 'Overal op het eiland',
    fr: 'Partout sur l’île',
    es: 'En cualquier punto de la isla',
  },
  'catalog.comingSoonBody': {
    en: 'Only cars can be booked right now. More vehicle types are on the way.',
    nl: 'Op dit moment kunnen alleen auto’s worden geboekt. Meer voertuigtypes volgen.',
    fr: 'Seules les voitures sont réservables pour l’instant. D’autres types de véhicules arrivent.',
    es: 'Por ahora solo se pueden reservar coches. Pronto habrá más tipos de vehículo.',
  },
  'vehicle.bookNow': {
    en: 'Book now',
    nl: 'Nu boeken',
    fr: 'Réserver',
    es: 'Reservar',
  },
  'vehicle.features': {
    en: 'Car features',
    nl: 'Kenmerken',
    fr: 'Caractéristiques',
    es: 'Características',
  },
  'vehicle.seats': {
    en: 'Seats',
    nl: 'Zitplaatsen',
    fr: 'Places',
    es: 'Plazas',
  },
  'vehicle.transmission': {
    en: 'Gearbox',
    nl: 'Versnellingsbak',
    fr: 'Boîte de vitesses',
    es: 'Cambio',
  },
  'vehicle.fuel': {
    en: 'Fuel',
    nl: 'Brandstof',
    fr: 'Carburant',
    es: 'Combustible',
  },
  'vehicle.doors': {
    en: 'Doors',
    nl: 'Deuren',
    fr: 'Portes',
    es: 'Puertas',
  },
  'vehicle.aircon': {
    en: 'Air conditioning',
    nl: 'Airconditioning',
    fr: 'Climatisation',
    es: 'Aire acondicionado',
  },
  'vehicle.class': {
    en: 'Class',
    nl: 'Klasse',
    fr: 'Catégorie',
    es: 'Categoría',
  },
  'vehicle.deposit': {
    en: 'Security Deposit',
    nl: 'Borgsom',
    fr: 'Caution',
    es: 'Fianza',
  },
  'vehicle.depositBody': {
    en: 'Held on your card while you have the car and released when you return it. This is not a charge.',
    nl: 'Wordt op uw kaart gereserveerd zolang u de auto heeft en vrijgegeven zodra u hem terugbrengt. Dit is geen afschrijving.',
    fr: 'Bloquée sur votre carte pendant la location et libérée au retour du véhicule. Ce n’est pas un débit.',
    es: 'Se retiene en su tarjeta mientras tenga el coche y se libera al devolverlo. No es un cobro.',
  },
  'vehicle.depositVehicleSpecific': {
    en: 'This amount is set for this vehicle',
    nl: 'Dit bedrag geldt voor dit voertuig',
    fr: 'Ce montant s’applique à ce véhicule',
    es: 'Este importe corresponde a este vehículo',
  },
  'vehicle.rentalPeriod': {
    en: 'Rental Period',
    nl: 'Huurperiode',
    fr: 'Durée de location',
    es: 'Duración del alquiler',
  },
  'vehicle.minimum': {
    en: 'Minimum',
    nl: 'Minimaal',
    fr: 'Minimum',
    es: 'Mínimo',
  },
  'vehicle.maximum': {
    en: 'Maximum',
    nl: 'Maximaal',
    fr: 'Maximum',
    es: 'Máximo',
  },
  'vehicle.accidentHistory': {
    en: 'Accident History',
    nl: 'Schadeverleden',
    fr: 'Historique des accidents',
    es: 'Historial de accidentes',
  },
  'vehicle.accidentNone': {
    en: 'No accidents reported',
    nl: 'Geen schade gemeld',
    fr: 'Aucun accident signalé',
    es: 'Sin accidentes declarados',
  },
  'vehicle.accidentDisclaimer': {
    en: 'As reported by the provider',
    nl: 'Zoals opgegeven door de verhuurder',
    fr: 'Tel que déclaré par le loueur',
    es: 'Según lo declarado por la empresa',
  },
  'vehicle.availability': {
    en: 'Availability',
    nl: 'Beschikbaarheid',
    fr: 'Disponibilité',
    es: 'Disponibilidad',
  },
  'vehicle.verifiedTitle': {
    en: 'What SXM Verified means',
    nl: 'Wat SXM Verified betekent',
    fr: 'Ce que signifie SXM Verified',
    es: 'Qué significa SXM Verified',
  },
  'vehicle.pickupFrom': {
    en: 'Pick up from',
    nl: 'Ophalen bij',
    fr: 'Retrait à',
    es: 'Recogida en',
  },
  'vehicle.deliveryAvailable': {
    en: 'Delivery available',
    nl: 'Bezorging mogelijk',
    fr: 'Livraison possible',
    es: 'Entrega disponible',
  },
} satisfies Record<string, Phrase>;
