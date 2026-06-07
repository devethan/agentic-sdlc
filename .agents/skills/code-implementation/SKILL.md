---
name: code-implementation
description: Use when the UI Implementor writes React, Next.js, TypeScript, or Zustand code from an approved UI Owner specification and UI Reviewer test plan. Do not use for requirement design, test planning, QA review, commits, or PR creation.
---

# Code Implementation

Use this skill to implement approved UI component work with the smallest defensible code change.

## Inputs

- Approved UI Owner specification.
- Approved UI Reviewer test plan.
- Relevant implementation files.
- Any UI Owner delegation notes.

## Implementation Guide

1. Restate the approved scope and test-plan obligations before editing.
2. Read only the files needed for the delegated implementation scope.
3. Preserve the existing Next.js App Router, React, TypeScript, Tailwind CSS, and Zustand patterns.
4. Keep container logic, state access, and presentational component boundaries clear.
5. Prefer small component props with explicit names and stable types.
6. Preserve existing user-visible behavior unless the specification explicitly changes it.
7. Avoid unrelated refactors, new dependencies, and broad file churn.
8. Prefer a TDD-oriented sequence when feasible: add or update the focused test first when the test intent is clear, implement the smallest code change, then refactor only within scope.

## Output

Return an implementation summary with:

- Changed files.
- Behavior implemented.
- Tests added or updated.
- Verification commands and results.
- Known risks or blockers.

