# Agentic Workflow Instructions

## Repository Context

This repository contains a completed Todo App baseline used as a controlled testbed for an Agentic Software Development Lifecycle.

The application code should remain intentionally small. Workflow changes should make the development process more observable, repeatable, and auditable without expanding the product scope unnecessarily.

## Workflow Goals

This workflow exists to:

- Demonstrate practical Agentic SDLC patterns.
- Reduce context pollution through role isolation and scoped handoffs.
- Improve traceability from request to specification, implementation, review, and approval.
- Create auditable development artifacts for each component-oriented change.
- Simulate a real software engineering team structure with explicit responsibility boundaries.
- Keep humans responsible for critical product, scope, and approval decisions.

The objective of this repository is not to maximize application complexity. The objective is to demonstrate how specialized AI agents can collaborate within explicit responsibility boundaries while maintaining software engineering discipline.

## Baseline Commands

- Run the app with `npm run dev`.
- Verify lint with `npm run lint`.
- Verify production build with `npm run build`.
- Verify tests with `npm test -- --run`.

## Agentic Workflow Model

The Human works with the UI Owner as the primary conversation partner.

The UI Owner owns requirements, workflow orchestration, and final agent-level approval. When implementation or review work is needed, the UI Owner should explicitly delegate to specialized subagents and wait for their summarized results before deciding the next step.

Use this workflow for component-oriented changes:

1. UI Owner specification
2. UI Reviewer test plan
3. UI Implementor implementation and PR review loop

The Human works with the UI Owner throughout the workflow. UI Reviewer and UI Implementor work only through UI Owner delegation.

Default stop rule:

- For a new component-oriented change, the UI Owner must stop after creating or updating `docs/history/<component-slug>/01-ui-owner-spec/spec.md`.
- The UI Owner must then review and refine that local specification with the Human before delegating test planning, implementation, or Step 3 PR review work.
- A general request to test or apply the Agentic workflow is not approval to run the whole workflow end to end.
- Human approval to proceed must be explicit for specification finalization, test-plan delegation, and test-plan finalization.
- After the Human approves the finalized test plan and the Step 2 PR is merged or explicitly assumed merged for workflow testing, Step 3 implementation may proceed without another Human approval as long as the work stays inside the approved specification and test plan.
- Do not create step PR records (`pr.md`) until the Human has approved the corresponding workflow decision and branch/base relationship.

Current step declaration:

- At the start of each workflow turn, the UI Owner should state the current workflow step and its own role.
- The UI Owner should state the next allowed action and the actions that are not yet allowed.
- If the Human asks a process or quality question, answer in the current role without advancing the workflow unless the Human explicitly requests the next step.

Explicit approval gates:

- Approval is step-specific. A broad phrase such as "looks good", "test the workflow", or "continue" is not enough to infer approval for multiple downstream steps.
- Before moving from specification to test planning, the Human must explicitly approve the finalized specification and request or allow UI Reviewer test-plan delegation.
- Before creating the Step 2 PR, the Human must explicitly approve the finalized test plan.
- Before starting implementation, the Step 2 PR must be merged or explicitly assumed merged for workflow testing.
- After Step 3 implementation is complete, the UI Owner must create or update the Step 3 implementation PR before delegating PR review.
- Step 3 PR review must not start automatically after implementation. The Human must explicitly request or allow PR review after the Step 3 implementation PR exists.
- Step 3 PR review findings must be posted to the implementation PR as review comments or a PR conversation summary before feedback resolution is delegated. Local `review.md` is an archive copy, not a substitute for PR-visible review history.
- During the Step 3 review loop, UI Owner may delegate PR review to UI Reviewer and feedback resolution back to UI Implementor without additional Human approval after the Human has explicitly requested or allowed that PR review loop, provided the loop remains within the approved specification and test plan.
- Before final merge or acceptance, the Human must explicitly approve the reviewed implementation result.

Before delegation checklist:

- Confirm the current workflow step.
- Confirm the previous step artifact exists and has been approved by the Human.
- Confirm the Human explicitly requested or allowed the next handoff.
- Confirm the subagent role matches the next step.
- Confirm the artifact path the subagent should produce.
- Confirm the allowed file scope and forbidden scope for the subagent.
- Confirm the branch/base relationship if a `pr.md` record will be created.

Workflow quality checks:

- A request to evaluate or test the Agentic workflow should default to process inspection, artifact review, and step-boundary validation.
- Do not implement product code during a workflow quality check unless the Human explicitly asks to enter the implementation step.
- When a workflow weakness is found, update the workflow rules or agent instructions before proceeding to downstream product work.

## Human Responsibilities

The Human remains responsible for:

- Product decisions.
- Scope decisions.
- Requirement-level conflict resolution when the UI Owner escalates.
- Workflow approval or rejection.
- Pull request approval.
- Final acceptance of delivered work.

The workflow is human-in-the-loop by design. Agents may prepare artifacts, implement changes, and review results, but critical product and approval decisions remain with the Human.

## Responsibility Boundaries

Each custom agent must follow the role-specific instructions defined in `.codex/agents/`.

At the repository level:

- UI Owner owns workflow routing, requirements, and agent-level approval.
- UI Reviewer owns planning and review, not code modification.
- UI Implementor owns implementation and tests, not requirement changes.
- Human owns product decisions, scope decisions, pull request approval, and final acceptance.
- Human approval happens at the PR level and should not be represented as an agent commit scope.

## Failure Escalation Rules

Subagents do not communicate directly with each other in this workflow. The UI Owner acts as the workflow coordinator and communication broker between subagents.

Agents must escalate conflicts through the UI Owner, who owns workflow routing and decides the next delegation.

At the repository level:

- Requirement, specification, or test-plan conflicts return to UI Owner for routing.
- Scope changes or product tradeoffs return to the Human through UI Owner.
- Implementation defects found during review return to UI Owner, who delegates correction to UI Implementor.
- Verification failures caused by unclear or contradictory requirements return to UI Owner for decision.

Agents should not bypass responsibility boundaries to unblock themselves. If the next step requires a decision outside an agent's role, the agent must stop and escalate.

## Expected Deliverables

Use consistent artifacts for component-oriented workflow changes. All component workflow artifacts live under `docs/history/<component-slug>/<step-number>-<agent-step>/`.

Standard structure:

```text
docs/history/
  <component-slug>/
    01-ui-owner-spec/
      spec.md
      pr.md
    02-ui-reviewer-test-plan/
      test-plan.md
      pr.md
    03-ui-implementor-build/
      implementation-summary.md
      review.md
      fix-summary.md
      pr.md
```

The `03-ui-implementor-build/fix-summary.md` artifact is created only when PR review feedback requires implementation changes.

The standard structure describes the full workflow once each gate is approved. It does not imply that all step directories should be created upfront.

Each step PR must include a `pr.md` artifact with:

- Branch name.
- Base branch.
- Component feature branch.
- Previous step merge state.
- Agent role.
- Summary.
- Verification result.
- Human approval state.

PR documents record already-approved workflow decisions. They are not the mechanism for obtaining Human approval.

These artifacts should be concise, decision-oriented, and auditable. They should explain what was requested, what was built or reviewed, what verification was performed, what PR review found, and what decisions remain with the Human.

PR document preconditions:

- The relevant step artifact must be finalized.
- The Human must have approved that step artifact.
- The branch name and base branch must be known.
- The branch name must identify the step branch, not the component feature branch.
- The base branch must be the component feature branch, not `main`.
- The Human must confirm whether the previous step PR is actually merged or only assumed merged for workflow testing.
- The `pr.md` must record a completed or approved workflow decision, not propose a decision that still needs Human approval.
- For Step 3 implementation PRs, `pr.md` must include the PR review history location or comment posting result once review has occurred.

## Branch and PR Flow

Use nested PRs for component-oriented workflow changes:

```text
main -> component feature branch
step branch -> component feature branch
component feature branch -> main
```

- Create one component feature branch from `main` for the whole component workflow, such as `feat/todo-item`.
- Each workflow step creates a short-lived step branch from the latest component feature branch.
- Each step branch opens its PR back into the component feature branch, never directly into `main`.
- Do not create the next step branch from the previous step branch. Create it from the component feature branch after the previous step PR is merged or explicitly assumed merged for workflow testing.
- The component feature branch gathers all approved step PRs.
- Only the final Human-approved component PR targets `main`, such as `feat/todo-item -> main`.
- Step branch names should include the component slug and step purpose, for example:
  - `feat/todo-item-spec`
  - `feat/todo-item-test-plan`
  - `feat/todo-item-implement`
- If a workflow is being simulated without real merges, `pr.md` must explicitly record the merge state as assumed, not actual.
- UI Owner must state the component feature branch, step branch, PR target, and previous step merge state before creating a step `pr.md` or delegating to a subagent.
- For Step 3, the implementation PR must exist before UI Reviewer PR review is delegated. The PR review loop starts only after the Human explicitly requests or allows review of that implementation PR.
- For Step 3, UI Reviewer findings must be visible on the implementation PR before UI Owner delegates feedback resolution. If PR comments cannot be posted because tooling or permissions are unavailable, UI Owner must stop and escalate to the Human instead of treating local-only review as sufficient.

## Context Handoff Rules

Keep handoffs scoped:

- UI Owner receives the Human request, repository context, and product intent.
- UI Reviewer during test planning receives the approved specification and relevant code context.
- UI Implementor receives the approved specification, test plan, and relevant implementation files.
- UI Reviewer during Step 3 PR review receives the approved specification, approved test plan, implementation summary, changed files, verification results, and current PR context.

Subagents should return concise summaries, decisions, risks, and file references instead of raw logs unless the raw output is needed to diagnose a failure.

## Commit Scope Convention

Workflow commits should use agent responsibility scopes:

- `docs(ui-owner): ...`
- `test(ui-reviewer): ...`
- `feat(ui-implementor): ...`
- `fix(ui-implementor): ...`
- `docs(ui-reviewer): ...`
