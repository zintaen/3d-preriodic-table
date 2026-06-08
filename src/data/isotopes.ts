export interface Isotope {
  atomicNumber: number;
  massNumber: number;
  symbol: string;
  abundance: number; // percentage 0-100
  halfLife: string; // 'Stable' or string representation like '5730 years'
  decayMode: string | null;
}

export const ISOTOPES: Isotope[] = [
  // Hydrogen
  { atomicNumber: 1, massNumber: 1, symbol: 'H-1', abundance: 99.9885, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 1, massNumber: 2, symbol: 'H-2 (Deuterium)', abundance: 0.0115, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 1, massNumber: 3, symbol: 'H-3 (Tritium)', abundance: 0, halfLife: '12.32 years', decayMode: 'Beta-' },
  // Helium
  { atomicNumber: 2, massNumber: 3, symbol: 'He-3', abundance: 0.000137, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 2, massNumber: 4, symbol: 'He-4', abundance: 99.999863, halfLife: 'Stable', decayMode: null },
  // Carbon
  { atomicNumber: 6, massNumber: 12, symbol: 'C-12', abundance: 98.9, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 6, massNumber: 13, symbol: 'C-13', abundance: 1.1, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 6, massNumber: 14, symbol: 'C-14', abundance: 0.0000000001, halfLife: '5730 years', decayMode: 'Beta-' },
  // Oxygen
  { atomicNumber: 8, massNumber: 16, symbol: 'O-16', abundance: 99.76, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 8, massNumber: 17, symbol: 'O-17', abundance: 0.038, halfLife: 'Stable', decayMode: null },
  { atomicNumber: 8, massNumber: 18, symbol: 'O-18', abundance: 0.205, halfLife: 'Stable', decayMode: null },
  // Uranium
  { atomicNumber: 92, massNumber: 235, symbol: 'U-235', abundance: 0.72, halfLife: '703.8 million years', decayMode: 'Alpha' },
  { atomicNumber: 92, massNumber: 238, symbol: 'U-238', abundance: 99.2745, halfLife: '4.468 billion years', decayMode: 'Alpha' }
];

export const getIsotopesByProtons = (protons: number): Isotope[] => {
  return ISOTOPES.filter(iso => iso.atomicNumber === protons);
};
