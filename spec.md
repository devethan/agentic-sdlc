# TodoItem Component Extraction Specification

## Owner

UI Owner

## Human Request

Separate the Todo App into components using the Agentic workflow. Start with exactly one smallest component, `TodoItem`, refine the workflow on that single unit, then expand the strategy later.

## Scope

Extract the repeated todo row UI from `src/components/todo-app.tsx` into a dedicated `TodoItem` component.

This specification covers only the `TodoItem` component boundary. It does not approve broader Todo App restructuring.

## Goals

- Establish the first small, auditable Agentic workflow unit.
- Keep product behavior unchanged.
- Make the todo row responsibility explicit before implementation.
- Create a pattern that can be reused for later component-oriented workflow changes.

## Current Behavior

Each todo item is rendered inside `TodoApp` as a list item with:

- A checkbox that toggles completion.
- A text label showing the todo title.
- Completed todo styling with muted text and line-through.
- A delete button that removes the todo.
- An accessible checkbox label that changes between marking the item complete and incomplete.

## Required Component

Create a `TodoItem` component responsible for rendering one todo row.

Expected file:

- `src/components/todo-item.tsx`

Expected import usage:

- `TodoApp` should render `TodoItem` inside the existing todo list mapping.

## Component Responsibilities

`TodoItem` must own:

- The `<li>` row markup for a single todo.
- The checkbox UI for completion.
- The todo title display.
- Completed versus incomplete visual styling.
- The delete button UI.
- Accessible checkbox labeling based on todo title and completion state.

`TodoItem` must not own:

- Todo collection state.
- Zustand store access.
- Adding todos.
- Filtering or sorting todos.
- Empty-list rendering.
- Remaining-count calculation.
- Product copy outside the row.

## Props Contract

`TodoItem` should receive all data and actions from `TodoApp`.

Required props:

- `todo`: the todo item object.
- `onToggle`: callback invoked when the checkbox changes.
- `onDelete`: callback invoked when the delete button is clicked.

The implementation may type `todo` using the existing `Todo` type from `src/stores/todo-store.ts`.

## Behavior Requirements

- Toggling a checkbox must call the parent-provided toggle callback for that todo.
- Clicking delete must call the parent-provided delete callback for that todo.
- Completed todos must continue to render muted, line-through title styling.
- Incomplete todos must continue to render normal title styling.
- Checkbox checked state must reflect `todo.completed`.
- Checkbox accessible label must preserve the existing complete/incomplete intent.
- Row spacing, border, background, and button styling should remain visually equivalent to the baseline.

## Out of Scope

- Changing todo data shape.
- Changing Zustand store behavior.
- Adding edit, filter, persistence, drag-and-drop, or batching features.
- Changing page layout, header, form, empty state, or remaining-count behavior.
- Introducing a design system or shared generic list item abstraction.
- Changing commit scope conventions.

## Acceptance Criteria

- `TodoItem` exists as a separate component.
- `TodoApp` no longer contains the full todo row JSX inline inside `todos.map`.
- Existing add, toggle, delete, empty-state, and remaining-count behavior remains unchanged.
- Existing accessibility intent for the checkbox remains intact.
- Relevant verification commands pass:
  - `npm run lint`
  - `npm run build`
  - `npm test -- --run`

## Next Delegation

After this specification is accepted, UI Owner should delegate to UI Reviewer to produce `test-plan.md` for this exact scope.
