# BACKLOG

| ID | Title | Status | Priority | Depends On | Blocks |
|---|---|---|---|---|---|
| TASK-WEB-001 | Project Scaffold | done | MUST | none | TASK-WEB-002, TASK-WEB-006 |
| TASK-WEB-002 | PubChem API Integration | done | MUST | TASK-WEB-001 | TASK-WEB-003 |
| TASK-WEB-003 | 3Dmol.js Visualization | done | MUST | TASK-WEB-002 | TASK-WEB-005 |
| TASK-WEB-004 | Quantum Orbital Rendering | done | SHOULD | TASK-WEB-003 | TASK-WEB-005 |
| TASK-WEB-005 | Gamified Sandbox | done | MUST | TASK-WEB-003, TASK-WEB-004 | TASK-WEB-006 |
| TASK-WEB-006 | UI and Design System | done | MUST | TASK-WEB-001, TASK-WEB-005 | none |
`

## Conventions (CyberOS)

One backlog for both classes: rows are `- [status] TASK-ID-slug - title`;
`class: improvement` rows carry an `(improvement)` suffix, product rows are untagged.
task frontmatter `status` is the record of truth; this file is the index.
