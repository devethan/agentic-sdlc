---
name: accessibility-compliance
description: Use when the UI Implementor changes Todo App UI components and must preserve accessible semantics, names, keyboard behavior, and focus states. Do not use for standalone QA review.
---

# Accessibility Compliance

Use this skill to preserve accessibility while implementing approved UI component changes.

## Compliance Guide

- Preserve semantic HTML for forms, lists, list items, buttons, and checkboxes.
- Keep form controls associated with labels or accessible names.
- Preserve checkbox checked state and its accessible label for marking todos complete or incomplete.
- Keep delete actions as buttons with clear accessible names.
- Preserve keyboard operability for input, submit, checkbox, and delete actions.
- Preserve visible focus styles or equivalent focus indication.
- Do not replace native controls with custom controls unless explicitly required and fully accessible.
- Prefer tests that query user-facing roles, labels, and names where practical.

## Output

In the implementation summary, mention accessibility-sensitive elements touched and whether accessible names, keyboard behavior, and focus states were preserved.

