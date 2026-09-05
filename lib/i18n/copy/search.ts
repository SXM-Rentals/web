// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word on the search page, in all four languages —
// the filters, the sort menu, the trip dates, and what it says when nothing
// matches.
//
// THE TOWN NAMES ARE NOT TRANSLATED, and that is deliberate. Simpson Bay is
// Simpson Bay in every language, including on the French side; Marigot is
// Marigot on the Dutch side. Translating a place name on a small island would
// make an address unfindable rather than clearer.

import type { Phrase } from './types';

export const search = {
  // ---- THE PAGE ITSELF ----
  'search.title': {
    en: 'Find a Car',
    nl: 'Auto Zoeken',
    fr: 'Trouver une Voiture',
    es: 'Buscar un Coche',
  },
  'search.subtitle': {
    en: 'Every car listed on the island, on both sides. Add your dates to see what is actually free.',
    nl: 'Elke auto die op het eiland wordt aangeboden, aan beide kanten. Voeg uw data toe om te zien wat echt vrij is.',
    fr: 'Toutes les voitures proposées sur l’île, des deux côtés. Ajoutez vos dates pour voir ce qui est réellement libre.',
    es: 'Todos los coches publicados en la isla, en los dos lados. Añada sus fechas para ver qué está libre de verdad.',
  },

  // ---- NOTHING MATCHED ----
  'search.empty.title': {
    en: 'No cars match those filters',
    nl: 'Geen auto’s die aan deze filters voldoen',
    fr: 'Aucune voiture ne correspond à ces filtres',
    es: 'Ningún coche coincide con esos filtros',
  },
  'search.empty.body': {
    en: 'Try widening the price range, or clearing a filter or two. Every car on the island is listed here — nothing is being held back.',
    nl: 'Probeer de prijsklasse te verruimen of een filter of twee te wissen. Elke auto op het eiland staat hier — er wordt niets achtergehouden.',
    fr: 'Élargissez la fourchette de prix, ou retirez un filtre ou deux. Toutes les voitures de l’île sont ici — rien n’est mis de côté.',
    es: 'Pruebe a ampliar el rango de precios, o a quitar uno o dos filtros. Todos los coches de la isla están aquí; no se guarda nada.',
  },

  // ---- THE SEARCH BOX AND FILTER PANEL ----
  'search.placeholder': {
    en: 'Make, model or town',
    nl: 'Merk, model of plaats',
    fr: 'Marque, modèle ou ville',
    es: 'Marca, modelo o localidad',
  },
  'search.boxLabel': {
    en: 'Search cars by make, model or town',
    nl: 'Zoek auto’s op merk, model of plaats',
    fr: 'Rechercher une voiture par marque, modèle ou ville',
    es: 'Buscar coches por marca, modelo o localidad',
  },
  'search.filters': {
    en: 'Filters',
    nl: 'Filters',
    fr: 'Filtres',
    es: 'Filtros',
  },
  'search.clearAll': {
    en: 'Clear All',
    nl: 'Alles Wissen',
    fr: 'Tout Effacer',
    es: 'Borrar Todo',
  },
  'search.deliveredToMe': {
    en: 'Delivered to Me',
    nl: 'Bij mij bezorgd',
    fr: 'Livrée sur place',
    es: 'Con entrega',
  },

  // ---- WHICH SIDE OF THE ISLAND ----
  'search.side.anywhere': {
    en: 'Anywhere',
    nl: 'Overal',
    fr: 'Partout',
    es: 'En cualquier sitio',
  },
  'search.side.dutch': {
    en: 'Dutch Side',
    nl: 'Nederlandse kant',
    fr: 'Côté néerlandais',
    es: 'Lado neerlandés',
  },
  'search.side.french': {
    en: 'French Side',
    nl: 'Franse kant',
    fr: 'Côté français',
    es: 'Lado francés',
  },

  // ---- PRICE ----
  'search.price.lowest': {
    en: 'Lowest price per day, in US dollars',
    nl: 'Laagste prijs per dag, in Amerikaanse dollars',
    fr: 'Prix minimum par jour, en dollars américains',
    es: 'Precio mínimo por día, en dólares estadounidenses',
  },
  'search.price.highest': {
    en: 'Highest price per day, in US dollars',
    nl: 'Hoogste prijs per dag, in Amerikaanse dollars',
    fr: 'Prix maximum par jour, en dollars américains',
    es: 'Precio máximo por día, en dólares estadounidenses',
  },
  'search.price.note': {
    en: 'Prices are in US dollars, per day, before any security deposit.',
    nl: 'Prijzen zijn in Amerikaanse dollars, per dag, exclusief borgsom.',
    fr: 'Les prix sont en dollars américains, par jour, hors caution.',
    es: 'Los precios son en dólares estadounidenses, por día, sin contar la fianza.',
  },

  // ---- GEARBOX ----
  'search.gearbox': {
    en: 'Gearbox',
    nl: 'Versnellingsbak',
    fr: 'Boîte de vitesses',
    es: 'Cambio',
  },
  'search.gearbox.automatic': {
    en: 'Automatic',
    nl: 'Automaat',
    fr: 'Automatique',
    es: 'Automático',
  },
  'search.gearbox.manual': {
    en: 'Manual',
    nl: 'Handgeschakeld',
    fr: 'Manuelle',
    es: 'Manual',
  },

  // ---- DELIVERY ----
  'search.delivery.only': {
    en: 'Only Show Cars that Can Be Delivered',
    nl: 'Toon alleen auto’s die bezorgd kunnen worden',
    fr: 'N’afficher que les voitures livrables',
    es: 'Mostrar solo coches con entrega',
  },
  'search.delivery.note': {
    en: 'Some businesses will bring the car to your hotel or the airport, usually for a fee.',
    nl: 'Sommige bedrijven brengen de auto naar uw hotel of het vliegveld, meestal tegen betaling.',
    fr: 'Certains loueurs amènent la voiture à votre hôtel ou à l’aéroport, généralement moyennant un supplément.',
    es: 'Algunas empresas llevan el coche a su hotel o al aeropuerto, normalmente con un coste añadido.',
  },

  // ---- SORTING ----
  'search.sort.by': {
    en: 'Sort by',
    nl: 'Sorteren op',
    fr: 'Trier par',
    es: 'Ordenar por',
  },
  'search.sort.recommended': {
    en: 'Recommended',
    nl: 'Aanbevolen',
    fr: 'Recommandé',
    es: 'Recomendado',
  },
  'search.sort.priceLow': {
    en: 'Price: Low to High',
    nl: 'Prijs: laag naar hoog',
    fr: 'Prix : croissant',
    es: 'Precio: de menor a mayor',
  },
  'search.sort.priceHigh': {
    en: 'Price: High to Low',
    nl: 'Prijs: hoog naar laag',
    fr: 'Prix : décroissant',
    es: 'Precio: de mayor a menor',
  },
  'search.sort.bestRated': {
    en: 'Best Rated',
    nl: 'Best beoordeeld',
    fr: 'Les mieux notés',
    es: 'Mejor valorados',
  },

  // ---- TRIP DATES AND PICKUP ----
  'search.trip.whenTitle': {
    en: 'When do you need it?',
    nl: 'Wanneer heeft u hem nodig?',
    fr: 'Quand en avez-vous besoin ?',
    es: '¿Cuándo lo necesita?',
  },
  'search.trip.whenSubtitle': {
    en: 'Pick the day you collect the car and the day you bring it back.',
    nl: 'Kies de dag waarop u de auto ophaalt en de dag waarop u hem terugbrengt.',
    fr: 'Choisissez le jour où vous récupérez la voiture et celui où vous la rendez.',
    es: 'Elija el día en que recoge el coche y el día en que lo devuelve.',
  },
  'search.trip.whereTitle': {
    en: 'Where do you want the car?',
    nl: 'Waar wilt u de auto hebben?',
    fr: 'Où voulez-vous la voiture ?',
    es: '¿Dónde quiere el coche?',
  },
  'search.trip.howLabel': {
    en: 'How You Get the Car',
    nl: 'Hoe u de auto krijgt',
    fr: 'Comment vous récupérez la voiture',
    es: 'Cómo recibe el coche',
  },
  'search.trip.collection': {
    en: 'Collection',
    nl: 'Ophalen',
    fr: 'Retrait',
    es: 'Recogida',
  },
  'search.trip.delivery': {
    en: 'Delivery',
    nl: 'Bezorging',
    fr: 'Livraison',
    es: 'Entrega',
  },
  'search.trip.placeholder': {
    en: 'Simpson Bay, Marigot, the airport…',
    nl: 'Simpson Bay, Marigot, het vliegveld…',
    fr: 'Simpson Bay, Marigot, l’aéroport…',
    es: 'Simpson Bay, Marigot, el aeropuerto…',
  },
  'search.trip.deliveryNote': {
    en: 'Not every business delivers, and those that do usually charge for it. The delivery fee is always shown before you pay.',
    nl: 'Niet elk bedrijf bezorgt, en wie dat wel doet rekent er meestal voor. De bezorgkosten worden altijd getoond voordat u betaalt.',
    fr: 'Tous les loueurs ne livrent pas, et ceux qui le font facturent généralement le service. Les frais de livraison sont toujours indiqués avant le paiement.',
    es: 'No todas las empresas hacen entregas, y las que sí suelen cobrar por ello. Los gastos de entrega siempre se muestran antes de pagar.',
  },
  'search.trip.clear': {
    en: 'Clear',
    nl: 'Wissen',
    fr: 'Effacer',
    es: 'Borrar',
  },
  'search.trip.done': {
    en: 'Done',
    nl: 'Klaar',
    fr: 'Terminé',
    es: 'Listo',
  },

  // ---- THE FOUR VEHICLE TYPES ----
  'search.type.cars': {
    en: 'Cars',
    nl: 'Auto’s',
    fr: 'Voitures',
    es: 'Coches',
  },
  'search.type.cars.blurb': {
    en: 'Economy runabouts through to 4x4s and vans, on both sides of the island.',
    nl: 'Van zuinige stadsauto’s tot 4x4’s en bestelbussen, aan beide kanten van het eiland.',
    fr: 'De la petite citadine au 4x4 et à l’utilitaire, des deux côtés de l’île.',
    es: 'Desde utilitarios económicos hasta todoterrenos y furgonetas, en los dos lados de la isla.',
  },
  'search.type.atvs': {
    en: 'ATVs',
    nl: 'Quads',
    fr: 'Quads',
    es: 'Quads',
  },
  'search.type.atvs.blurb': {
    en: 'Quad bikes for the trails and the back roads.',
    nl: 'Quads voor de paden en de binnenwegen.',
    fr: 'Des quads pour les sentiers et les petites routes.',
    es: 'Quads para los caminos y las carreteras secundarias.',
  },
  'search.type.boats': {
    en: 'Boats',
    nl: 'Boten',
    fr: 'Bateaux',
    es: 'Barcos',
  },
  'search.type.boats.blurb': {
    en: 'Day boats and charters around the lagoon and the bays.',
    nl: 'Dagboten en charters rond de lagune en de baaien.',
    fr: 'Bateaux à la journée et locations autour du lagon et des baies.',
    es: 'Barcos de día y chárteres por la laguna y las bahías.',
  },
  'search.type.bikes': {
    en: 'Bikes',
    nl: 'Scooters',
    fr: 'Scooters',
    es: 'Motos',
  },
  'search.type.bikes.blurb': {
    en: 'Scooters and bicycles for getting around town.',
    nl: 'Scooters en fietsen om je door de stad te bewegen.',
    fr: 'Scooters et vélos pour se déplacer en ville.',
    es: 'Motos y bicicletas para moverse por la ciudad.',
  },
  'search.type.label': {
    en: 'Vehicle Type',
    nl: 'Type voertuig',
    fr: 'Type de véhicule',
    es: 'Tipo de vehículo',
  },
  'search.trip.addDates': {
    en: 'Add Your Dates',
    nl: 'Voeg uw data toe',
    fr: 'Ajoutez vos dates',
    es: 'Añada sus fechas',
  },
  'search.trip.collectFrom': {
    en: 'Collect From',
    nl: 'Ophalen bij',
    fr: 'Retrait à',
    es: 'Recoger en',
  },
  'search.trip.deliveredTo': {
    en: 'Delivered To',
    nl: 'Bezorgd naar',
    fr: 'Livrée à',
    es: 'Entregado en',
  },
  'search.sideOfIsland': {
    en: 'Side of the Island',
    nl: 'Kant van het eiland',
    fr: 'Côté de l’île',
    es: 'Lado de la isla',
  },
  'search.addDatesHint': {
    en: 'Add your dates to see the full price and book.',
    nl: 'Voeg uw data toe om de volledige prijs te zien en te boeken.',
    fr: 'Ajoutez vos dates pour voir le prix complet et réserver.',
    es: 'Añada sus fechas para ver el precio completo y reservar.',
  },
} satisfies Record<string, Phrase>;
