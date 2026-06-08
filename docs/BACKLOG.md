# Enterprise Refactoring Backlog

## Testing & CI Integrity
- [x] High | DONE | Fix `App.test.tsx`: Mock global `fetch` to resolve invalid URL (`/api/pubchem/...`) and wrap state updates in `act(...)`.
- [x] High | DONE | Fix `AtomBuilder.test.tsx`: Configure i18next mock for tests so translation keys resolve properly.
- [x] High | DONE | Fix `OrbitalViewer.test.tsx`: Wrap R3F hooks rendering within a `<Canvas>` provider in tests.
- [x] High | DONE | Fix `pubchem.test.ts`: Ensure `vi.fn()` mock is properly setup and reset for fetch calls.
- [x] High | DONE | Fix `package.json`: Add `"test": "vitest run"` script so that standard `npm test` works.

## Static Analysis & Code Quality
- [x] Medium | DONE | Fix `react-hooks/purity` in `BohrModelViewer.tsx`: Move `Math.random()` out of render and into `useMemo` or state to maintain component purity.
- [x] Medium | DONE | Fix `react-hooks/set-state-in-effect` in `ElementSearch.tsx`: Refactor effect to avoid synchronous state updates or rewrite using derived state.
- [x] Medium | DONE | Fix `react-hooks/exhaustive-deps` in `MoleculeViewer.tsx`: Properly cache `containerRef.current` in effect cleanup function.
- [x] Low | DONE | Remove unused variables across `OrbitalViewer.tsx`, `gameStore.ts`, `spectra.ts`.

## Strict Typing (Type Safety)
- [x] Medium | DONE | Replace `any` types with strong types in `MoleculeViewer.tsx`.
- [x] Medium | DONE | Replace `any` types with strong types in `OrbitalViewer.test.tsx`.
- [x] Medium | DONE | Replace `any` types with strong types in `ReactionSandbox.tsx`.
- [x] Medium | DONE | Replace `any` types with strong types in `services/pubchem.ts`.
- [x] Medium | DONE | Replace `any` types with strong types in `supabase/functions/gemini-reaction/index.ts`.

## Benchmark & Performance Baseline
- [x] Medium | DONE | Create a benchmark script `scripts/benchmark.js` to measure build time, chunk sizes, and type checking time to serve as an empirical baseline.
