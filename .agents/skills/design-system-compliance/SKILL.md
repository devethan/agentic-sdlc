---
name: design-system-compliance
description: Use when the UI Implementor must keep React or Next.js UI changes visually consistent with the existing Todo App interface. Treat existing Tailwind CSS conventions as the local design system. Do not use for redesigns or new brand direction.
---

# Design System Compliance

This project does not have a separate formal design system. Treat the existing Todo App UI conventions as the design system.

## Compliance Guide

- Preserve the current visual language: restrained layout, compact cards, stone background, emerald primary action, subtle borders, and modest shadow.
- Reuse existing Tailwind CSS patterns for spacing, typography, border radius, color, focus rings, and responsive behavior.
- Keep component extraction visually neutral: the screen should look the same unless the approved specification requires a visible change.
- Do not introduce new color systems, layout systems, animation styles, or dependencies.
- Keep controls sized consistently with the existing input, checkbox, and button patterns.
- Maintain readable text wrapping for todo titles and responsive form/list layout.

## Output

In the implementation summary, state whether the change preserves existing UI conventions and call out any approved visual differences.

