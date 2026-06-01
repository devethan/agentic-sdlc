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

1. Human Request
2. UI Owner specification
3. UI Reviewer test plan
4. UI Implementor implementation and tests
5. UI Reviewer QA review
6. UI Implementor feedback resolution when needed
7. UI Owner final report
8. Human PR approval

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

Use consistent artifacts for component-oriented workflow changes:

- UI Owner specification: `spec.md`.
- UI Reviewer test plan: `test-plan.md`.
- UI Implementor implementation summary: `implementation-summary.md`.
- UI Reviewer QA review: `qa-review.md`.
- UI Implementor feedback resolution: updated `implementation-summary.md`.
- UI Owner final approval report: `final-report.md`.

These artifacts should be concise, decision-oriented, and auditable. They should explain what was requested, what was built or reviewed, what verification was performed, and what decisions remain with the Human.

## Context Handoff Rules

Keep handoffs scoped:

- UI Owner receives the Human request, repository context, and product intent.
- UI Reviewer during test planning receives the approved specification and relevant code context.
- UI Implementor receives the approved specification, test plan, and relevant implementation files.
- UI Reviewer during QA receives the approved specification, implementation summary, changed files, and verification results.

Subagents should return concise summaries, decisions, risks, and file references instead of raw logs unless the raw output is needed to diagnose a failure.

## Commit Scope Convention

Workflow commits should use agent responsibility scopes:

- `docs(ui-owner): ...`
- `test(ui-reviewer): ...`
- `feat(ui-implementor): ...`
- `fix(ui-implementor): ...`
- `docs(ui-reviewer): ...`
