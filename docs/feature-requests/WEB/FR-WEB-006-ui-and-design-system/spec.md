---
id: FR-WEB-006
title: "Liquid Glass Interface & Design System Integration"
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
depends_on: [FR-WEB-001, FR-WEB-005]
blocks: []
source_pages:
  - docs/strategy.pdf
  - DESIGN.md
source_decisions:
  - DEC-006 (Liquid Glass UI motif, Vietnamese i18n)
language: typescript
service: frontend
new_files:
  - src/components/DashboardLayout.tsx
  - src/components/GlassCard.tsx
modified_files: []
allowed_tools: []
disallowed_tools: []
effort_hours: 6
sub_tasks:
  - "Implement Glassmorphism CSS utilities"
  - "Create Dashboard grid layout"
  - "Integrate gamification state into UI readouts"
  - "Add i18n support for English/Vietnamese"
risk_if_skipped: "Application will not meet the aesthetic requirements of the client or the CyberSkill design system."
---

## §1 — Description (BCP-14 normative)

1. The application MUST implement the "Liquid Glass" aesthetic utilizing CSS backdrop-filters, subtle borders, and soft shadows over a dynamic background.
2. The overarching layout MUST be a responsive dashboard utilizing CSS Grid to house the periodic table, 3D viewers, and the atom builder interface.
3. The UI components MUST strictly utilize the `Be Vietnam Pro` font and adhere to the contrast tokens (`Umber`, `Ochre`) established in `DESIGN.md`.
4. The application MUST support i18n natively, allowing users to toggle between English and Vietnamese, with Vietnamese layouts extensively tested for word length and diacritic vertical spacing.

## §2 — Why this design (rationale for humans)

**Why Liquid Glass? (§1 #1)** The strategy document asks for a modern, futuristic aesthetic. Glassmorphism provides this while allowing background elements (like orbital clouds) to show through the UI.
**Why Vietnamese testing? (§1 #4)** `DESIGN.md` explicitly mandates Vietnamese as a first-class language. Vietnamese words have different wrapping characteristics than English and require taller line-heights.

## §3 — API contract

```tsx
// src/components/GlassCard.tsx
import React from 'react';

export const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div className={`backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl ${className || ''}`}>
      {children}
    </div>
  );
};
```

## §4 — Acceptance criteria

1. **Aesthetics** — The `GlassCard` MUST render with a backdrop blur and semi-transparent background.
2. **Layout** — The `DashboardLayout` MUST arrange its children without overlapping on desktop displays.
3. **Typography** — All text within the UI MUST visually match the `Be Vietnam Pro` font family.
4. **i18n** — Toggling a language state MUST translate key UI strings (e.g., "Protons" -> "Proton").

## §5 — Verification

```typescript
// src/components/GlassCard.test.tsx
import { render } from '@testing-library/react';
import { GlassCard } from './GlassCard';

test('applies glassmorphism classes', () => {
  const { container } = render(<GlassCard>Content</GlassCard>);
  const div = container.firstChild as HTMLDivElement;
  expect(div.className).toContain('backdrop-blur');
});
```

## §6 — Implementation skeleton

(API contract above is the skeleton.)

## §7 — Dependencies

- Upstream: FR-WEB-001, FR-WEB-005
- Downstream: None

## §8 — Example payloads

N/A

## §9 — Open questions

All resolved.

## §10 — Failure modes inventory

| Failure | Detection | Outcome | Recovery |
|---|---|---|---|
| Backdrop-filter unsupported | Old browser | Fallback color | Provide a solid rgba() fallback |
| Poor contrast | Lighthouse a11y | Unreadable text | Check WCAG ratios against background |
| Grid breaks on mobile | Resize window | Horizontal scroll | Implement strict flex-col breakpoints |
| Diacritics clipped | Visual check | Typo | Enforce line-height: 1.5+ |
| Missing translation key | i18n runtime | Raw key shown | Fallback to English string |
| CSS bundle bloat | Build output | Slow load | PurgeCSS / Tailwind JIT handles this |
| Z-index wars | UI layers overlap | Modals hidden | Establish strict z-index scale |
| Animations jitter | Profiler | Low FPS | Use `transform` not `top/left` |
| Font fails to load | Network | System font used | Preload critical font faces |
| Light mode toggle | User pref | Unreadable | Force dark mode or adapt glass colors |

## §11 — Implementation notes

- Tailwind CSS makes glassmorphism trivial (`backdrop-blur-md bg-white/10`).

*End of FR-WEB-006.*
