// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The places on the island a car can be collected from, or
// a business can be based in — each with its side of the island and where it
// is on a map.
//
// ---- WHY A LIST, AND NOT A BOX TO TYPE IN ----
//
// The backend will not take a car without a map position, and a business
// owner should not be asked for latitude and longitude. Picking a town from a
// list gives the position and the side of the island in one choice — and it
// cannot be typed as "Philipsbrg", which a customer searching for Philipsburg
// would never find.
//
// ---- HOW EXACT THE POSITIONS ARE ----
//
// The middle of each town, not an address. That is as close as a listing needs
// to be: it answers "which part of the island is this car on?", and the exact
// spot to meet is agreed in messages, the same as it always was.
//
// Town names are not translated — Simpson Bay is Simpson Bay in every
// language, the same rule as the search page (see lib/i18n/copy/search.ts).

export type Town = {
  name: string;
  side: 'dutch' | 'french';
  latitude: number;
  longitude: number;
};

export const TOWNS: readonly Town[] = [
  // ---- THE DUTCH SIDE ----
  { name: 'Philipsburg', side: 'dutch', latitude: 18.026, longitude: -63.0458 },
  { name: 'Simpson Bay', side: 'dutch', latitude: 18.0386, longitude: -63.0922 },
  { name: 'Princess Juliana Airport', side: 'dutch', latitude: 18.041, longitude: -63.1089 },
  { name: 'Maho', side: 'dutch', latitude: 18.0392, longitude: -63.1178 },
  { name: 'Cupecoy', side: 'dutch', latitude: 18.0455, longitude: -63.1425 },
  { name: 'Cole Bay', side: 'dutch', latitude: 18.0398, longitude: -63.0835 },
  { name: 'Cay Hill', side: 'dutch', latitude: 18.0306, longitude: -63.0615 },
  { name: 'Little Bay', side: 'dutch', latitude: 18.021, longitude: -63.0615 },
  { name: 'Dutch Quarter', side: 'dutch', latitude: 18.039, longitude: -63.042 },
  { name: 'Pointe Blanche', side: 'dutch', latitude: 18.0128, longitude: -63.0357 },
  { name: 'Oyster Pond', side: 'dutch', latitude: 18.0535, longitude: -63.0175 },

  // ---- THE FRENCH SIDE ----
  { name: 'Marigot', side: 'french', latitude: 18.068, longitude: -63.0825 },
  { name: 'Grand Case', side: 'french', latitude: 18.1015, longitude: -63.0553 },
  { name: 'Grand Case Airport', side: 'french', latitude: 18.0999, longitude: -63.0472 },
  { name: 'Orient Bay', side: 'french', latitude: 18.0858, longitude: -63.0185 },
  { name: 'Nettle Bay', side: 'french', latitude: 18.0635, longitude: -63.0985 },
  { name: 'Sandy Ground', side: 'french', latitude: 18.0648, longitude: -63.0905 },
  { name: 'Terres Basses', side: 'french', latitude: 18.0565, longitude: -63.1415 },
  { name: 'Concordia', side: 'french', latitude: 18.0692, longitude: -63.078 },
  { name: 'Friar\'s Bay', side: 'french', latitude: 18.0815, longitude: -63.0715 },
  { name: 'Cul-de-Sac', side: 'french', latitude: 18.0985, longitude: -63.0338 },
  { name: 'Anse Marcel', side: 'french', latitude: 18.1155, longitude: -63.0395 },
  { name: 'Quartier d\'Orléans', side: 'french', latitude: 18.0605, longitude: -63.0245 },
];

/** The town with this name, if it is one of ours. */
export function findTown(name: string): Town | undefined {
  const wanted = name.trim().toLowerCase();
  return TOWNS.find((town) => town.name.toLowerCase() === wanted);
}
