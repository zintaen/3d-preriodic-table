import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('tracks particles and charge', () => {
    const store = useGameStore.getState();
    store.addProton();
    expect(useGameStore.getState().protons).toBe(2);
    expect(useGameStore.getState().getNetCharge()).toBe(1);
    expect(useGameStore.getState().getAtomicMass()).toBe(2);
  });

  it('limits protons to 118', () => {
    const store = useGameStore.getState();
    for(let i=0; i<150; i++) store.addProton();
    expect(useGameStore.getState().protons).toBe(118);
  });

  it('checks stability', () => {
    const store = useGameStore.getState();
    // 1p, 0n -> H-1 -> stable
    expect(store.isStable()).toBe(true);
    
    // add 6 protons, 6 neutrons -> C-12 -> stable
    store.reset();
    for(let i=0; i<5; i++) store.addProton();
    for(let i=0; i<6; i++) store.addNeutron();
    expect(useGameStore.getState().protons).toBe(6);
    expect(useGameStore.getState().neutrons).toBe(6);
    expect(useGameStore.getState().isStable()).toBe(true);

    // add 10 more neutrons to Carbon -> unstable
    for(let i=0; i<10; i++) store.addNeutron();
    expect(useGameStore.getState().isStable()).toBe(false);
  });
});
