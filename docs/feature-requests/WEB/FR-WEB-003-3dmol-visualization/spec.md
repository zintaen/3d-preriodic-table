---
id: FR-WEB-003
title: "Molecular Visualization via 3Dmol.js"
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
depends_on: [FR-WEB-002]
blocks: [FR-WEB-004, FR-WEB-005]
source_pages:
  - docs/strategy.pdf
source_decisions:
  - DEC-003 (Use 3Dmol.js instead of custom WebGL primitives for molecules)
language: typescript
service: frontend
new_files:
  - src/components/MoleculeViewer.tsx
modified_files: []
allowed_tools: []
disallowed_tools: []
effort_hours: 4
sub_tasks:
  - "Integrate 3Dmol.js library"
  - "Create React wrapper component for rendering SDF"
  - "Implement user interaction controls (rotate, zoom)"
risk_if_skipped: "No ability to render complex organic chemistry molecular geometries."
---

## §1 — Description (BCP-14 normative)

1. The application MUST integrate the `3dmol` library to abstract complex WebGL primitives for molecular visualization.
2. A React component (`MoleculeViewer`) MUST be created to mount the 3Dmol.js canvas and inject the SDF spatial coordinates fetched from PubChem.
3. The component MUST support dynamic restyling between standard educational modes: stick, sphere (ball-and-stick), and cartoon (volumetric).
4. The viewer MUST instantiate intuitive mouse/touch controls for rotation, translation, and fluid zooming as natively provided by the library.
5. The component MUST safely dispose of its WebGL context when unmounted to prevent memory leaks and maintain browser performance.

## §2 — Why this design (rationale for humans)

**Why use 3Dmol.js? (§1 #1)** Attempting to build a bespoke rendering engine for VSEPR geometries from fundamental WebGL primitives is highly inefficient. 3Dmol.js is highly optimized and operates natively on WebGL.
**Why different styling modes? (§1 #3)** Different concepts require different abstractions. Wireframes show structure, ball-and-stick shows atoms clearly, while volumetric surfaces are needed for complex macromolecules.
**Why strict cleanup? (§1 #5)** WebGL contexts are heavy. If multiple molecules are viewed over a session, failing to unmount the viewer will quickly exhaust the browser's context limit and crash the application.

## §3 — API contract

```typescript
// src/components/MoleculeViewer.tsx
import React, { useEffect, useRef } from 'react';

export interface MoleculeViewerProps {
  sdfData: string;
  styleMode?: 'stick' | 'sphere' | 'cartoon';
}

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ sdfData, styleMode = 'stick' }) => {
  // Mount 3dmol GLViewer here
  return <div id="viewer-container" style={{ width: '100%', height: '100%' }}></div>;
};
```

## §4 — Acceptance criteria

1. **Mounting** — The `MoleculeViewer` MUST render a canvas element containing a 3D rendering of the provided SDF data.
2. **Styling** — Changing the `styleMode` prop MUST dynamically update the visualization style of the molecule without full remounting.
3. **Cleanup** — Unmounting the component MUST completely destroy the associated 3Dmol GLViewer instance.

## §5 — Verification

```typescript
// testing via Cypress or heavy integration testing due to WebGL limitations in Jest
import { mount } from '@cypress/react';
import { MoleculeViewer } from './MoleculeViewer';

it('renders canvas', () => {
  mount(<MoleculeViewer sdfData="fake-sdf-string" />);
  cy.get('canvas').should('exist');
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: FR-WEB-002
- Downstream: FR-WEB-004, FR-WEB-005

## §8 — Example payloads

N/A

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| Invalid SDF data | 3Dmol throws error | Blank canvas | Catch error, display "Invalid Molecule" |
| WebGL context limit | Browser console error | Black screen | Enforce strict `removeAllModels()` on unmount |
| Window resize bug | Canvas distorted | Stretched image | Bind resize observer to viewer `resize()` |
| React Strict Mode double-mount | Multiple viewers | Z-fighting | Clean up in `useEffect` return block |
| Unsupported style string | GLViewer fails to style | Default stick style | Strongly type the style prop |
| Memory leak | DevTools heap snapshot | Browser crash | Audit WebGL contexts and JS objects |
| Missing line breaks in SDF | Parser fails | Empty viewer | Sanitize SDF string before passing |
| Container has no height | CSS layout | Invisible canvas | Enforce minimum height/flex on wrapper |
| Touch events swallowed | Mobile UX broken | Can't scroll page | Configure touch event propagation |
| Library version conflict | `npm install` | Broken build | Pin `3dmol` version in package.json |

## §11 — Implementation notes

- 3Dmol.js requires a DOM element to attach to. `useRef` must be used to grab the div and instantiate `$3Dmol.createViewer()`.

*End of FR-WEB-003.*
