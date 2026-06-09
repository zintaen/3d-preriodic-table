## 🔄 Loop Pass 1: 2026-06-09
### 🌐 Deep Research & SOTA Expansion
- **Top 5 SOTA Analyzed:** [MolStar](https://molstar.org), [RCSB PDB](https://www.rcsb.org), [Sketchfab](https://sketchfab.com), [NGL Viewer](http://nglviewer.org), [Google Arts & Culture](https://artsandculture.google.com)
- **Newly Discovered Vectors:** WebGL Draw Calls, Frame Rendering Optimization, Asset Memory Leaks
- **Target vs SOTA Reality:** Current target runs constant 60fps React loop with individual `<mesh>` nodes, leading to massive O(N) draw calls and CPU/Battery drain compared to SOTA which uses instancing and on-demand rendering.

### 📊 Expanding Empirical Benchmarks
| Metric | SOTA Target | Current Value | CLI Command / Tool Used for Verification |
|---|---|---|---|
| Draw Calls per Frame | < 100 | TBD (Unoptimized O(N)) | `npm run test` (Mock rendering validation) / R3F-Perf |
| Idle CPU Usage | ~0% | Constant 60fps rendering | Static code analysis (`frameloop="demand"` absent) |

### 📋 Actionable Tasks
| ID | Priority | Status | Vector | Deep Technical Task Description & Expected Metric Delta |
|---|---|---|---|---|
| L1-1 | High | [IN-PROGRESS] | Frame Rendering Optimization | Add `frameloop="demand"` to all Canvas elements (Expect: Idle CPU drops to 0%) |
| L1-2 | High | [TODO] | WebGL Draw Calls | Refactor BohrModelViewer arrays to `InstancedMesh` (Expect: Draw calls reduced from O(N) to O(1)) |
| L1-3 | High | [TODO] | Memory Leak Prevention | Verify proper unmount disposal or implement R3F lifecycle cleanup (Expect: Stable JS Heap) |
