# OpenSpec Conventions — bandy-bund.de

## Layout

```
openspec/
├── project.md                     # stack, conventions, glossary — read this first
├── AGENTS.md                      # this file
├── specs/<capability>/spec.md     # the CURRENT truth: what the system does today
└── changes/<change-id>/
    ├── proposal.md                # why + what changes + impact
    ├── design.md                  # technical approach and trade-offs
    ├── tasks.md                   # ordered implementation checklist
    └── specs/<capability>/spec.md # the DELTA against specs/ (ADDED / MODIFIED / REMOVED)
```

## Spec format

Every `specs/<capability>/spec.md` uses exactly this shape:

```markdown
# <capability> Specification

## Purpose
One paragraph. What this capability is responsible for, and what it is not.

## Requirements

### Requirement: <short imperative name>
The system SHALL <observable behaviour>.

#### Scenario: <name>
- **GIVEN** <precondition>
- **WHEN** <action>
- **THEN** <observable outcome>
```

Delta files under `changes/*/specs/` prefix requirement groups with a state header:

```markdown
## ADDED Requirements
## MODIFIED Requirements
## REMOVED Requirements
```

## Rules

1. A requirement is written from the outside in — observable behaviour, never implementation.
   "The system SHALL store the score in `games.score_home`" is wrong.
   "The system SHALL display the final score on the game page once the game status is `finished`" is right.
2. Every requirement has at least one scenario. A requirement without a scenario is a wish.
3. `SHALL` = mandatory. `SHOULD` = strong default, deviation must be justified in `design.md`.
   `MAY` = optional. Never use "must", "will", "can" — they are ambiguous in review.
4. Specs are updated in the same PR as the code. A merged PR that leaves `specs/` stale is a defect.
5. Run `openspec validate --strict` in CI. A failing spec blocks the merge.
6. When work is done: `/opsx:archive` moves the change folder to `changes/archive/YYYY-MM-DD-<id>/`
   and folds the delta into `specs/`.

## Workflow for a coding agent

1. Read `project.md`, then the `specs/` for every capability the task touches.
2. `/opsx:propose <idea>` — produce `proposal.md`, `design.md`, `tasks.md`, and spec deltas.
3. Wait for the product owner to approve the proposal. Do not write code before approval.
4. `/opsx:apply` — work the checklist in `tasks.md`, ticking items as they land.
5. `/opsx:archive` — fold deltas into `specs/`.
