# Todo Item UI Reviewer Test Plan

## Workflow Context

- Component slug: `todo-item`
- Workflow step: Step 2, UI Reviewer test planning
- Artifact path: `docs/history/todo-item/02-ui-reviewer-test-plan/test-plan.md`
- Spec status: Step 1 finalized and Human-approved
- Previous step merge state: Step 1 PR merged into `feat/todo-item`
- Component feature branch: `feat/todo-item`
- Current step branch: `feat/todo-item-test-plan`

## Verification Scope

Verify extraction of the inline todo row into `src/components/todo-item.tsx` while preserving the existing Todo App behavior, visual density, and accessibility.

The primary test scope is the `TodoItem` component itself. Parent-owned behavior such as creating todos, list ordering, remaining count, and Zustand store shape should be treated as Todo App regression checks, not as responsibilities of `TodoItem`.

In scope:

- Rendering one incomplete todo item.
- Rendering one completed todo item.
- Toggling completion through the item control.
- Deleting through the item delete control.
- Accessible names and keyboard reachability for completion and delete controls.
- Long-title layout resilience without horizontal overflow.
- Minimal Todo App regression checks where needed to confirm the extraction did not break existing parent-owned behavior.

Out of scope:

- Persistence.
- Routing.
- Filtering.
- Editing.
- Drag and drop.
- Due dates.
- Priorities.
- Tags.
- Bulk actions.
- New global state shape unless strictly necessary.
- Visual redesign.

## Test Scenarios

### 1. Incomplete Todo Item Rendering

Success conditions:

- A todo with `completed: false` renders its title.
- The completion control is unchecked.
- The title does not use completed styling such as line-through or muted text.
- Row styling remains consistent with the existing app: white background, border, compact spacing, and small-radius shape.

Failure conditions:

- The title is missing or altered.
- The checkbox renders checked for an incomplete item.
- The row uses a redesigned layout or materially different spacing.
- The component requires unrelated props or global state access.

### 2. Completed Todo Item Rendering

Success conditions:

- A todo with `completed: true` renders its title.
- The completion control is checked.
- The title retains completed visual treatment: line-through and muted text.
- The row remains visually consistent with incomplete rows except for completion styling.

Failure conditions:

- Completed state is not visually distinguishable.
- Checkbox state and text styling disagree.
- Completed item layout shifts unexpectedly compared with incomplete items.

### 3. Completion Toggle Behavior

Success conditions:

- Activating the checkbox calls the provided toggle callback for the target todo.
- Keyboard activation works through the native control behavior.
- Todo App-level toggle, count, and ordering behavior remain parent-owned and are not moved into `TodoItem`.

Failure conditions:

- Toggle callback is not called.
- Toggle callback is called with the wrong todo identity or ambiguous data.
- `TodoItem` directly mutates global state, owns list ordering, or changes unrelated todos.

### 4. Delete Behavior

Success conditions:

- Activating the delete control calls the provided delete callback for the target todo.
- Keyboard activation works through the native button behavior.
- Todo App-level deletion and remaining-count updates remain parent-owned and are not moved into `TodoItem`.

Failure conditions:

- Delete callback is not called.
- Delete callback is called with the wrong todo identity or ambiguous data.
- `TodoItem` directly mutates global state or deletes from the parent list itself.
- Delete control is not keyboard reachable.

### 5. Accessible Names And Keyboard Access

Success conditions:

- Completion control is reachable with keyboard navigation.
- Delete control is reachable with keyboard navigation.
- Completion control exposes an accessible name that identifies the target todo and action/state, such as marking the named todo complete or incomplete.
- Delete control exposes a clear accessible name or visible label identifying the delete action for the target todo.
- Focus states remain visible and consistent with the app.

Failure conditions:

- Controls have missing or generic accessible names such as only `checkbox` or `button`.
- Multiple todo rows produce indistinguishable accessible names.
- Keyboard users cannot reach or operate either control.
- Focus indication is removed or visually hidden.

### 6. Long Title Layout Resilience

Success conditions:

- Long todo titles wrap within the row.
- The row does not cause horizontal page overflow on mobile-width viewports.
- Toggle and delete controls remain visible and usable.
- Text wrapping does not overlap controls.

Failure conditions:

- Long text forces horizontal scrolling.
- Text overlaps the checkbox or delete control.
- Delete control is pushed off-screen.
- Row height or wrapping breaks surrounding list layout.

### 7. TodoApp Regression Preservation

Success conditions:

- Existing create, toggle, delete, and active count workflows still pass where covered by existing or focused regression tests.
- Todo ordering remains parent-owned and unchanged by the extraction.
- Zustand state shape is unchanged unless the implementor documents a necessary reason.
- No unsupported product features are introduced.

Failure conditions:

- Existing app behavior regresses after extraction.
- `TodoItem` owns list ordering, remaining-count calculation, global state, or other app-level concerns.
- New product scope appears in UI or state.

## Recommended Test Coverage

The Step 3 implementor should add or update focused tests using the existing Vitest and React Testing Library setup.

Recommended unit/component coverage:

- `TodoItem` renders incomplete state.
- `TodoItem` renders completed state.
- `TodoItem` calls `onToggle` when the completion control is activated.
- `TodoItem` calls `onDelete` when the delete control is activated.
- Accessible queries can locate completion and delete controls by meaningful names.
- A long-title case renders without losing the checkbox or delete control.

Recommended Todo App regression coverage:

- Existing `TodoApp` create, toggle, delete, and count behavior remains covered where practical.
- If current tests cover inline row behavior, update them to validate the same behavior through the extracted component rather than weakening assertions.
- Do not add broad Todo App integration tests solely because of this extraction unless the implementation changes parent-owned behavior.

## Manual Review Checklist

- Inspect `src/components/todo-item.tsx` for narrow component responsibility.
- Confirm props represent only todo identity, title, completed state, toggle callback, and delete callback.
- Confirm no persistence, routing, filtering, editing, drag-and-drop, or extra product features were added.
- Confirm styling preserves the existing row density, border, white background, spacing, and small-radius appearance.
- Confirm mobile layout does not horizontally overflow with a long title.
- Confirm focus states are visible for checkbox and delete controls.

## Verification Commands

The Step 3 implementor should run:

```bash
npm run lint
npm run build
npm test -- --run
```

Success conditions:

- All commands complete successfully.
- Test changes are focused on the approved extraction and preservation behavior.
- No snapshots or broad assertions are updated merely to accept regressions.

Failure conditions:

- Any verification command fails.
- Tests are removed or weakened without clear justification.
- Build succeeds only by bypassing TypeScript, lint, or accessibility-related failures.

## Step 3 Implementor Guidance

Create `src/components/todo-item.tsx` and update `src/components/todo-app.tsx` to render it. Keep the item component presentational and callback-driven. Preserve existing behavior and styling first; do not introduce product scope beyond the approved component separation.

Prefer native form controls for checkbox and button semantics. Use accessible labels that remain unique per todo row. Keep layout resilient for long titles with wrapping text and fixed reachable controls.
