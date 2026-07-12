---
id: FR-WEB-004
title: "Quantum Orbital Rendering via React Three Fiber"
module: WEB
priority: SHOULD
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
depends_on: [FR-WEB-003]
blocks: [FR-WEB-005]
source_pages:
  - docs/strategy.pdf
source_decisions:
  - DEC-004 (React Three Fiber for orbital geometry)
language: typescript
service: frontend
new_files:
  - src/components/OrbitalViewer.tsx
modified_files: []
allowed_tools: []
disallowed_tools: []
effort_hours: 6
sub_tasks:
  - "Setup React Three Fiber Canvas"
  - "Implement spherical harmonics mesh for s, p, d orbitals"
  - "Add volumetric shaders for electron probability density"
risk_if_skipped: "Limits educational value by omitting subatomic geometries."
---

## §1 — Description (BCP-14 normative)

1. The application MUST provide a secondary 3D viewer (`OrbitalViewer`) powered by `react-three-fiber` and `three` to render quantum mechanical probability clouds (atomic orbitals).
2. The viewer MUST accurately represent the geometries of $s$, $p$, and $d$ orbitals using spherical harmonic functions or pre-computed mesh geometries.
3. The orbitals MUST be rendered using custom volumetric or transparent shaders to simulate electron probability density rather than solid opaque plastic.
4. The component MUST accept standard quantum numbers ($n$, $l$, $m_l$) as props to dynamically select and render the correct orbital shape.

## §2 — Why this design (rationale for humans)

**Why React Three Fiber instead of 3Dmol.js for this? (§1 #1)** 3Dmol.js is optimized for molecules (balls and sticks). It cannot natively render complex arbitrary volumes like $d_{z^2}$ orbitals. React Three Fiber provides raw access to Three.js primitives and custom GLSL shaders needed for probability clouds.
**Why volumetric shaders? (§1 #3)** An orbital is not a solid object; it's a probability distribution. Rendering it as a solid mesh is educationally inaccurate. Transparency and fresnel effects are required.

## §3 — API contract

```typescript
// src/components/OrbitalViewer.tsx
import { Canvas } from '@react-three/fiber';
import React from 'react';

export interface OrbitalViewerProps {
  n: number;
  l: number; // 0=s, 1=p, 2=d
  ml: number;
}

export const OrbitalViewer: React.FC<OrbitalViewerProps> = ({ n, l, ml }) => {
  return (
    <Canvas>
      {/* Orbital meshes and lights */}
    </Canvas>
  );
};
```

## §4 — Acceptance criteria

1. **R3F Canvas** — The component MUST render a valid Three.js canvas using `@react-three/fiber`.
2. **Prop Dependency** — Passing $l=0$ MUST render a spherical shape, while $l=1$ MUST render a dumbbell shape.
3. **Shader Execution** — The material applied to the orbital MUST utilize transparency and additive blending to look "cloud-like".

## §5 — Verification

```typescript
// integration test
import { render } from '@testing-library/react';
import { OrbitalViewer } from './OrbitalViewer';

test('renders R3F canvas element', () => {
  const { container } = render(<OrbitalViewer n={1} l={0} ml={0} />);
  expect(container.querySelector('canvas')).toBeInTheDocument();
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: FR-WEB-003
- Downstream: FR-WEB-005

## §8 — Example payloads

N/A

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| Invalid quantum numbers | Prop validation | Fallback to 1s | Clamp inputs to valid ranges |
| Shader compilation fails | WebGL error | Magenta fallback | Provide standard mesh material |
| Z-fighting with axes | Visual glitch | Flickering | Apply polygon offset / tweak depth |
| Canvas scaling blur | High DPI screen | Blurry render | Set `pixelRatio` to window.devicePixelRatio |
| Excessive polycount | Low FPS | Stuttering | Optimize geometries (LOD) |
| Missing Three.js peer deps | npm install | Build error | Install explicitly |
| Touch rotation broken | Mobile usage | Stuck model | Add `OrbitControls` |
| Overlapping orbitals opaque | Visual testing | Looks solid | Enable `depthWrite=false` |
| Memory leak | Unmounting | Slow browser | R3F handles most, check textures |
| Conflicting contexts | With 3Dmol viewer | Crash | Separate DOM trees strictly |

## §11 — Implementation notes

- To save time, predefined parametric geometries for $p$ and $d$ orbitals can be approximated if complex spherical harmonic math in GLSL takes too long to write.

*End of FR-WEB-004.*
