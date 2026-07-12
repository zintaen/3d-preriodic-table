---
id: FR-WEB-001
title: "Project Scaffold and Tech Stack Initialization"
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
depends_on: []
blocks: [FR-WEB-002, FR-WEB-006]
source_pages:
  - docs/strategy.pdf
source_decisions:
  - DEC-001 (React + Vite tech stack chosen)
language: typescript
service: frontend
new_files:
  - package.json
  - vite.config.ts
  - src/main.tsx
  - src/App.tsx
modified_files: []
allowed_tools:
  - npm
  - npx
disallowed_tools: []
effort_hours: 2
sub_tasks:
  - "Init Vite React TS project"
  - "Add Tailwind CSS for Design Tokens"
  - "Configure Be Vietnam Pro font"
risk_if_skipped: "No foundation for the application to be built on."
---

## §1 — Description (BCP-14 normative)

1. The project MUST be initialized using Vite with the React and TypeScript template.
2. Tailwind CSS MUST be configured with the CyberSkill DESIGN.md anchors (`#45210E` Umber, `#F4BA17` Ochre).
3. The typography MUST be configured to use `Be Vietnam Pro` for UI text and `JetBrains Mono` for code blocks.
4. The project MUST support Vietnamese as a first-class language, ensuring line heights are configured to prevent diacritic clipping (min 1.5 for body, 1.35 for headings).
5. Code style MUST be enforced using ESLint and Prettier.

## §2 — Why this design (rationale for humans)

**Why Vite + React? (§1 #1)** React is required by the strategy document to support React Three Fiber for 3D visualization. Vite provides the fastest dev environment.
**Why Tailwind CSS with custom tokens? (§1 #2)** To easily adapt the design system tokens from DESIGN.md without writing massive raw CSS files.
**Why Be Vietnam Pro and specific line heights? (§1 #3, #4)** DESIGN.md mandates Vietnamese as a first-class language. The specified line heights are critical to prevent stacked diacritics from clipping.

## §3 — API contract

```typescript
// tailwind.config.js snippet
export default {
  theme: {
    extend: {
      colors: {
        umber: '#45210E',
        ochre: '#F4BA17',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
}
```

## §4 — Acceptance criteria

1. **Vite Init** — The application MUST start a dev server using `npm run dev` that renders a basic React page.
2. **Tailwind Config** — Tailwind classes for `text-umber` and `bg-ochre` MUST be available and apply the correct hex codes.
3. **Typography Support** — Text rendered in the app MUST use `Be Vietnam Pro` and the CSS must enforce line-heights of at least 1.5 for body text.

## §5 — Verification

```typescript
// App.test.tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app and typography', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toBeInTheDocument();
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: None
- Downstream: FR-WEB-002, FR-WEB-006

## §8 — Example payloads

N/A for scaffolding.

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| Vite fails to build | CI build step | Build error | Fix TS/Vite config |
| Tailwind classes not applied | Visual regression / CI | Unstyled UI | Verify postcss config |
| Fonts fail to load | Network tab | Fallback fonts | Check font URLs |
| Diacritic clipping | Manual visual test | Unreadable text | Fix line-height |
| ESLint fails | pre-commit hook | Commit blocked | Fix lint errors |
| Tests fail | `npm test` | CI fail | Fix test assertions |
| Port conflict | `npm run dev` | Server start fail | Use dynamic port |
| Node version mismatch | `npm install` | Install error | Use `.nvmrc` |
| TS strict mode error | `tsc --noEmit` | Build blocked | Fix types |
| Missing peer dependencies | `npm install` | Warning/Error | Install peers |

## §11 — Implementation notes

- Run `npx create-vite@latest . --template react-ts` to initialize.
- Install tailwindcss, postcss, and autoprefixer as dev dependencies.
- Add Google Fonts link in `index.html`.

*End of FR-WEB-001.*
