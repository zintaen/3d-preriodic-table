---
id: FR-WEB-002
title: "PubChem PUG REST API Integration for Chemical Data"
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
depends_on: [FR-WEB-001]
blocks: [FR-WEB-003]
source_pages:
  - docs/strategy.pdf
source_decisions:
  - DEC-002 (PubChem as primary data source)
language: typescript
service: frontend
new_files:
  - src/services/pubchem.ts
modified_files: []
allowed_tools: []
disallowed_tools: []
effort_hours: 4
sub_tasks:
  - "Implement PUG REST fetch for periodic table CSV"
  - "Implement SDF coordinate fetch by name"
  - "Add caching layer for API responses"
risk_if_skipped: "Application will not have any chemical data to display."
---

## §1 — Description (BCP-14 normative)

1. The application MUST integrate with the PubChem PUG REST API to fetch comprehensive periodic table data in CSV format.
2. The periodic table payload MUST be parsed into structured TypeScript objects containing identifiers, physical, chemical, and categorical data.
3. The specific "Period" property MUST be appended programmatically based on atomic numbers to correctly map the 118 elements geometrically, as the raw PubChem data omits this.
4. The application MUST support querying chemical compounds by name to retrieve Structure-Data File (SDF) formatting containing Cartesian coordinates for 3D molecular rendering.
5. A client-side caching mechanism SHOULD be implemented to reduce network overhead for identical compound fetches.

## §2 — Why this design (rationale for humans)

**Why use PubChem PUG REST? (§1 #1)** Hardcoding 118 elements' data and infinite molecules is prone to obsolescence and bloat. PubChem provides authoritative, real-time data without SOAP envelope overhead.
**Why append the Period manually? (§1 #3)** The raw dataset from PubChem contains 17 columns but explicitly lacks the "Period" value required to draw the standard geometric grid.
**Why SDF coordinates? (§1 #4)** SDF provides strict Cartesian spatial coordinates alongside complex covalent bonding information, which is critical for accurate WebGL representation.

## §3 — API contract

```typescript
// src/services/pubchem.ts
export interface ElementData {
  AtomicNumber: number;
  Symbol: string;
  Name: string;
  AtomicMass: number;
  AtomicRadius?: number;
  Electronegativity?: number;
  Period: number;
}

export const fetchPeriodicTable = async (): Promise<ElementData[]> => {
  // fetch from https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON
};

export const fetchCompoundSDF = async (name: string): Promise<string> => {
  // fetch from https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/SDF
};
```

## §4 — Acceptance criteria

1. **Periodic Table Fetch** — The `fetchPeriodicTable` function MUST successfully download and parse the 118 elements.
2. **Period Property Appended** — Every returned `ElementData` object MUST contain a valid `Period` number (1-7) accurately derived from its `AtomicNumber`.
3. **SDF Fetch** — The `fetchCompoundSDF` function MUST return the raw SDF text payload for a valid compound name like "glucose".

## §5 — Verification

```typescript
import { fetchPeriodicTable, fetchCompoundSDF } from './pubchem';

test('fetches elements and appends period', async () => {
  const data = await fetchPeriodicTable();
  expect(data.length).toBeGreaterThanOrEqual(118);
  const hydrogen = data.find(e => e.Symbol === 'H');
  expect(hydrogen?.Period).toBe(1);
});

test('fetches SDF', async () => {
  const sdf = await fetchCompoundSDF('water');
  expect(sdf).toContain('V2000'); // Standard SDF format marker
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: FR-WEB-001
- Downstream: FR-WEB-003

## §8 — Example payloads

N/A

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| PubChem API down | HTTP 5xx | App shows error | Retry with backoff / Use static fallback |
| CORS policy blocks fetch | Browser console | Network Error | Proxy request (PubChem usually supports CORS) |
| Compound not found | HTTP 404 | Error modal | Display "Compound not found" to user |
| Invalid JSON/CSV structure | Parsing error | Broken state | Validate schema strictly |
| Network timeout | Promise rejection | UI hangs | Implement abort controller and timeout |
| Caching memory bloat | High RAM usage | Slow browser | LRU cache with eviction policy |
| Period logic breaks | UI grid broken | Table skewed | Add strict tests for Period calculation |
| Rate limiting (429) | HTTP 429 | Fetch blocked | Implement rate limiter on client |
| Partial payload | Truncated SDF | Rendering fails | Validate SDF integrity |
| Name disambiguation | Multiple isomers | Wrong molecule | Prompt user to select isomer |

## §11 — Implementation notes

- PubChem JSON payload for periodic table is nested heavily under `Table.Row`. A mapping layer will be required to flatten this into the `ElementData` interface.
- SDF text must be preserved with exact line breaks, as parsers (like 3Dmol.js) rely on strict formatting.

*End of FR-WEB-002.*
