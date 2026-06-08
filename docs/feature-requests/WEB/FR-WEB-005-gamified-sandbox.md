---
id: FR-WEB-005
title: "Constructivist Gamified Sandbox"
module: WEB
priority: MUST
status: ready_to_implement
verify: T
phase: P1
milestone: P1 · slice 1
slice: 1
owner: AI
created: 2026-06-08
shipped: null
memory_chain_hash: null
related_frs: []
depends_on: [FR-WEB-003, FR-WEB-004]
blocks: [FR-WEB-006]
source_pages:
  - docs/strategy.pdf
source_decisions:
  - DEC-005 (Implement constructivist loop for gamification)
language: typescript
service: frontend
new_files:
  - src/components/AtomBuilder.tsx
  - src/store/gameStore.ts
modified_files: []
allowed_tools: []
disallowed_tools: []
effort_hours: 5
sub_tasks:
  - "Create global Zustand store for user progress"
  - "Implement Atom Builder logic (drag-and-drop protons/neutrons/electrons)"
  - "Add dynamic feedback for stability and charge"
risk_if_skipped: "The application fails to meet the core educational gamification requirement."
---

## §1 — Description (BCP-14 normative)

1. The application MUST implement an interactive "Atom Builder" sandbox where users can incrementally add protons, neutrons, and electrons.
2. The state of this sandbox MUST be managed globally (e.g., via Zustand) to track the current composed element, its net charge, and its isotope stability.
3. The UI MUST provide immediate feedback when a composed element matches a known real element, triggering the `OrbitalViewer` and `MoleculeViewer` with relevant data.
4. The system MUST validate physical laws (e.g., rejecting an element with 5 protons and 0 neutrons as wildly unstable) and display educational error messages.

## §2 — Why this design (rationale for humans)

**Why a sandbox? (§1 #1)** As per the strategy, "Constructivist mechanics" require users to build knowledge by doing. Building atoms from subatomic particles teaches atomic theory inherently.
**Why global state? (§1 #2)** The constructed atom dictates what the entire rest of the dashboard (the orbitals, the data panel, the molecules) displays.
**Why physical validation? (§1 #4)** If users can build nonsense without feedback, the educational value is negative.

## §3 — API contract

```typescript
// src/store/gameStore.ts
import { create } from 'zustand';

interface GameState {
  protons: number;
  neutrons: number;
  electrons: number;
  addProton: () => void;
  addNeutron: () => void;
  addElectron: () => void;
  reset: () => void;
  getNetCharge: () => number;
  getAtomicMass: () => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  protons: 1,
  neutrons: 0,
  electrons: 1,
  addProton: () => set((state) => ({ protons: state.protons + 1 })),
  addNeutron: () => set((state) => ({ neutrons: state.neutrons + 1 })),
  addElectron: () => set((state) => ({ electrons: state.electrons + 1 })),
  reset: () => set({ protons: 1, neutrons: 0, electrons: 1 }),
  getNetCharge: () => get().protons - get().electrons,
  getAtomicMass: () => get().protons + get().neutrons,
}));
```

## §4 — Acceptance criteria

1. **State mutation** — The Zustand store MUST correctly track subatomic particles and compute derived properties (charge, mass).
2. **UI Controls** — The user MUST be able to click buttons to add subatomic particles, which instantly updates the global state.
3. **Feedback loop** — Constructing Carbon-12 (6p, 6n, 6e) MUST yield a stable indicator.

## §5 — Verification

```typescript
// src/store/gameStore.test.ts
import { useGameStore } from './gameStore';

test('store tracks particles and charge', () => {
  const store = useGameStore.getState();
  store.addProton();
  expect(useGameStore.getState().protons).toBe(2);
  expect(useGameStore.getState().getNetCharge()).toBe(1); // 2p, 1e
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: FR-WEB-003, FR-WEB-004
- Downstream: FR-WEB-006

## §8 — Example payloads

N/A

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| Unstable isotope logic wrong | Unit testing | Misinformation | Hardcode standard stable isotopes |
| Store hydration fails | Next.js/SSR | State mismatch | Disable SSR for this store |
| Infinite render loop | React re-renders | Browser crash | Use shallow selectors in Zustand |
| Negative particle counts | UI spamming | Math breaks | Clamp counts to >= 0 |
| Exceeding element 118 | UI | Breaks PubChem map | Restrict protons <= 118 |
| Missing element data | Derived lookup | UI crash | Provide unknown element fallback |
| Poor animation performance | Drag/drop | Jittery UI | Use CSS transforms / Framer Motion |
| Gamification too punitive | Playtesting | User quits | Keep error messages constructive |
| Missing atomic mass decimals | Data mismatch | Confusion | Explain isotopes vs average mass |
| Reset button broken | QA | Stuck state | Ensure strict reset function |

## §11 — Implementation notes

- Start with simple buttons before building complex drag-and-drop visuals.

*End of FR-WEB-005.*
