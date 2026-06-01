# Agentic Workflow Instructions

## Repository Context

This repository contains a completed Todo App baseline used as a controlled testbed for an Agentic Software Development Lifecycle.

The application code should remain intentionally small. Workflow changes should make the development process more observable, repeatable, and auditable without expanding the product scope unnecessarily.

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

## Responsibility Boundaries

- UI Owner may clarify requirements, write specifications, resolve scope questions, and approve the final agent workflow result.
- UI Reviewer may create test plans and review implementation quality, accessibility, maintainability, test results, and specification compliance.
- UI Reviewer must not directly modify implementation or test code.
- UI Implementor may modify implementation and test code based only on the approved specification and test plan.
- UI Implementor must not change requirements or test intent without sending the issue back to the UI Owner.
- Human approval happens at the PR level and should not be represented as an agent commit scope.

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

