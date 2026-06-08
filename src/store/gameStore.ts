import { create } from 'zustand';

export interface GameState {
  protons: number;
  neutrons: number;
  electrons: number;
  addProton: () => void;
  addNeutron: () => void;
  addElectron: () => void;
  reset: () => void;
  getNetCharge: () => number;
  getAtomicMass: () => number;
  isStable: () => boolean;
  setElement: (atomicNumber: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  protons: 1,
  neutrons: 0,
  electrons: 1,
  addProton: () => set((state) => ({ protons: Math.min(118, state.protons + 1) })),
  addNeutron: () => set((state) => ({ neutrons: state.neutrons + 1 })),
  addElectron: () => set((state) => ({ electrons: state.electrons + 1 })),
  reset: () => set({ protons: 1, neutrons: 0, electrons: 1 }),
  getNetCharge: () => get().protons - get().electrons,
  getAtomicMass: () => get().protons + get().neutrons,
  isStable: () => {
    const { protons, neutrons } = get();
    // Rough approximation for educational purposes:
    // N/Z ratio ~ 1 for light elements (Z <= 20)
    // N/Z ratio ~ 1.5 for heavy elements
    if (protons === 1 && (neutrons === 0 || neutrons === 1)) return true; // H-1, H-2
    if (protons === 6 && (neutrons === 6 || neutrons === 7)) return true; // C-12, C-13
    
    const ratio = neutrons / (protons || 1);
    if (protons <= 20 && ratio >= 0.9 && ratio <= 1.2) return true;
    if (protons > 20 && ratio >= 1.2 && ratio <= 1.6) return true;
    return false;
  },
  setElement: (atomicNumber) => {
    // A stable-ish baseline: Set protons = atomicNumber
    // Approximate neutrons to get a stable isotope, electrons = protons for neutral atom
    let neutrons;
    if (atomicNumber === 1) neutrons = 0;
    else if (atomicNumber > 1 && atomicNumber <= 20) neutrons = atomicNumber;
    else neutrons = Math.round(atomicNumber * 1.5);
    
    set({ protons: atomicNumber, neutrons, electrons: atomicNumber });
  }
}));
