---
name: test-plan-implementation
description: Use when the UI Implementor converts a UI Reviewer-owned test-plan.md into executable Vitest and React Testing Library tests. Do not use to create test plans, change test intent, or perform QA review.
---

# Test Plan Implementation

Use this skill to turn the approved `test-plan.md` into executable tests.

## Ownership Boundary

The UI Reviewer owns test intent. The UI Implementor only converts the approved test plan into test code.

Do not add, remove, or reinterpret test scenarios unless the UI Owner explicitly delegates that change after resolving it with the UI Reviewer or Human.

## Testing Guide

1. Read the approved `test-plan.md` and identify scenarios, success conditions, failure conditions, and verification scope.
2. Convert reviewer-owned scenarios into Vitest and React Testing Library tests.
3. Prefer user-visible behavior over implementation details.
4. Use accessible roles, labels, names, and visible text where practical.
5. Keep tests focused on the delegated component scope and existing behavior.
6. If the test plan is missing, contradictory, or impossible to implement, report the blocker to UI Owner instead of changing the plan.
7. Run targeted tests when available and summarize results.

## Output

Return test implementation details in the implementation summary:

- Test files added or updated.
- Test-plan scenarios covered.
- Verification command and result.
- Any blocker caused by missing or unclear test intent.

