## Loop 1 — 2026-06-13
### Scope & method
- Protocol: AUDIT.md — AUTONOMOUS AUDIT & IMPROVEMENT PROTOCOL — v1.3.0 | Mode: gated | Depth: standard | Severity floor: High | Vectors: Architecture, Performance, Security, Maintainability, Testing
- Benchmark basis: none — INTERNAL TARGETs only per config
### Benchmark table
| Metric | Baseline | Target | Verify command |
|---|---|---|---|
| Three.js Dependency Count | 2 versions | INTERNAL TARGET — no external citation | `npm ls three` |
| Three.js Runtime Warnings | "Multiple instances of Three.js being imported." present in test output | INTERNAL TARGET — no external citation | `npm run test -- --run` |

```bash
$ npm ls three
temp-app@0.0.0 /Users/stephencheng/Projects/Personal/3d-preriodic-table
├─┬ @react-three/drei@10.7.7
│ ├─┬ @monogrid/gainmap-js@3.4.0
│ │ └── three@0.184.0 deduped
│ ├─┬ camera-controls@3.1.2
│ │ └── three@0.184.0 deduped
│ ├─┬ maath@0.10.8
│ │ └── three@0.184.0 deduped
│ ├─┬ meshline@3.3.1
│ │ └── three@0.184.0 deduped
│ ├─┬ stats-gl@2.4.2
│ │ └── three@0.170.0
│ ├─┬ three-mesh-bvh@0.8.3
│ │ └── three@0.184.0 deduped
│ ├─┬ three-stdlib@2.36.1
│ │ └── three@0.184.0 deduped
│ ├── three@0.184.0 deduped
│ └─┬ troika-three-text@0.52.4
│   ├── three@0.184.0 deduped
│   └─┬ troika-three-utils@0.52.4
│     └── three@0.184.0 deduped
├─┬ @react-three/fiber@9.6.1
│ └── three@0.184.0 deduped
└── three@0.184.0
```

```bash
$ npm run test -- --run
> temp-app@0.0.0 test
> vitest run --run

 RUN  v4.1.8 /Users/stephencheng/Projects/Personal/3d-preriodic-table

 ✓ src/services/pubchem.test.ts (3 tests) 2ms
 ✓ src/store/gameStore.test.ts (3 tests) 2ms
stderr | src/components/OrbitalViewer.test.tsx > OrbitalViewer > renders R3F canvas container
<ambientLight /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <ambientLight> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<bufferAttribute /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <bufferAttribute> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<bufferGeometry /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <bufferGeometry> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<pointsMaterial /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <pointsMaterial> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
Received `true` for a non-boolean attribute `transparent`.

If you want to write it to the DOM, pass a string instead: transparent="true" or transparent={value.toString()}.
React does not recognize the `depthWrite` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `depthwrite` instead. If you accidentally passed it from a parent component, remove it from the DOM element.
The tag <points> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.

 ✓ src/components/OrbitalViewer.test.tsx (1 test) 32ms
 ✓ src/components/MoleculeViewer.test.tsx (1 test) 15ms
 ✓ src/components/GlassCard.test.tsx (1 test) 17ms
 ✓ src/components/AtomBuilder.test.tsx (1 test) 28ms
stderr | src/App.test.tsx
THREE.WARNING: Multiple instances of Three.js being imported.

stderr | src/App.test.tsx > App > renders app and typography classes
An update to ElementSearch inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to PeriodicTable inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/App.test.tsx > App > renders app and typography classes
An update to ElementDetails inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to DashboardLayout inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/App.test.tsx > App > renders app and typography classes
An update to DashboardLayout inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 ✓ src/App.test.tsx (1 test) 19ms

 Test Files  7 passed (7)
      Tests  11 passed (11)
   Start at  02:36:13
   Duration  1.26s (transform 309ms, setup 413ms, import 1.25s, tests 114ms, environment 3.71s)
```

### Task table
| ID | Sev | Status | Vector | Description + expected delta | Verify command |
|---|---|---|---|---|---|
| L1-T1 | High | OPEN | Performance | Force single version of Three.js using npm `overrides` to prevent multi-instance bundle bloat and runtime bugs (expect: `npm ls three` shows 1 instance, test output no longer shows THREE.WARNING) | `npm ls three && npm run test -- --run` |
