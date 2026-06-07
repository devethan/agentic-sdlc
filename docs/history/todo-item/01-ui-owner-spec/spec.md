# Todo Item UI Owner Specification

## Workflow Context

- Component slug: `todo-item`
- Component feature branch: `feat/todo-item`
- Current step branch: `feat/todo-item-spec`
- Current workflow step: Step 1, UI Owner specification
- Step 1 artifact: `docs/history/todo-item/01-ui-owner-spec/spec.md`
- Specification status: finalized and Human-approved
- Next allowed action after Human approval: delegate Step 2 test planning to UI Reviewer
- Not yet allowed: implementation, executable test creation, Step 2 PR record, Step 3 build work

## Human Request

Start the first Agentic workflow for the Todo App by branching from `main` into `feat/todo-item`, then creating the Step 1 branch `feat/todo-item-spec`.

The initial component target is `todo-item`.

The Human clarified that the existing Todo App behavior must not change. The goal of this workflow is to apply the Agentic workflow to a focused component separation: extract the current inline todo row into a dedicated component while preserving behavior and product scope.

## Existing Product Context

The Todo App baseline currently supports:

- Creating todos from the input form.
- Marking todos complete or incomplete.
- Deleting todos.
- Showing the remaining active todo count.
- Keeping state in memory through the Zustand store.

The todo item UI currently lives inline inside `src/components/todo-app.tsx` as each rendered `<li>` in the todo list. There is no separate `TodoItem` component yet.

## Proposed Component Scope

Create a dedicated Todo Item component that represents one todo row in the existing Todo App list.

This is a component extraction task, not a product feature expansion.

The component should preserve the current product behavior:

- Show the todo title.
- Show completion state visually.
- Allow the user to toggle completion.
- Allow the user to delete the todo.
- Preserve the current ordering and list behavior owned by the parent Todo App.

The component should preserve the current product constraints:

- No persistence changes.
- No routing changes.
- No filtering, editing, drag-and-drop, due dates, priorities, tags, or bulk actions.
- No new global state shape unless implementation proves it is necessary for this component boundary.
- No visual redesign beyond what is needed to keep the extracted component consistent with the existing UI.

## Component Responsibilities

`TodoItem` should own presentation and user interaction for a single todo item.

Expected inputs:

- Todo identity.
- Todo title.
- Todo completed state.
- Completion toggle callback.
- Delete callback.

Expected behavior:

- The checkbox reflects the current completed state.
- Activating the checkbox requests a completion toggle for the item.
- The delete control requests deletion for the item.
- Completed todos retain line-through styling and muted text treatment.
- Long todo titles wrap without breaking the row layout.

## Accessibility Requirements

- The completion control must remain keyboard reachable.
- The delete control must remain keyboard reachable.
- The completion control must expose an accessible name that identifies the target todo and the action state.
- The delete control must expose a clear accessible name or visible label.
- Focus states must remain visible and consistent with the existing app.

## Design Requirements

- Keep the existing restrained Todo App visual language.
- Preserve the current row density, border, white background, spacing, and small-radius styling.
- Keep mobile behavior functional without horizontal overflow.
- Do not introduce marketing-style layout, decorative artwork, or additional page sections.

## Verification Expectations For Later Steps

The UI Reviewer test plan should cover:

- Rendering an incomplete todo item.
- Rendering a completed todo item.
- Toggling completion through the checkbox.
- Deleting through the delete control.
- Accessible names for controls.
- Long-title layout resilience where practical in component tests.

The UI Implementor should run the repository baseline checks after implementation:

- `npm run lint`
- `npm run build`
- `npm test -- --run`

## Open Decisions For Human Review

All Step 1 scope decisions are resolved.

- The existing Todo App behavior must not change.
- The workflow target is component separation only.
- The extracted component should live in `src/components/todo-item.tsx`.

## UI Owner Recommendation

Approve a narrow extraction scope:

- Add a dedicated `src/components/todo-item.tsx`.
- Preserve the visible `Delete` button text for readability and minimal product change.
- Keep `TodoApp` responsible for list state, ordering, empty state, and remaining count.
- Do not introduce new Todo App behavior during this workflow.

This keeps the first workflow focused on responsibility separation and auditability rather than expanding Todo App product scope.
