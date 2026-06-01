# agentic-sdlc

`agentic-sdlc` explores a human-in-the-loop Agentic Software Development Lifecycle using a simple Todo app as a controlled testbed.

## Todo App Baseline

This repository currently contains the Phase 1 Todo app baseline implemented with Next.js App Router, TypeScript, Tailwind CSS, Zustand, and Vitest configuration.

Run the app:

```bash
npm run dev
```

Verify the project:

```bash
npm run lint
npm run build
npm test -- --run
```

The baseline supports creating todos, marking todos complete, deleting todos, and showing the remaining todo count. State is kept in memory only.

The Todo app is intentionally small. Its purpose is to keep the product domain simple while making the development process observable, repeatable, and auditable.

## Overview

Modern AI-assisted development introduces new engineering questions:

- How should responsibilities be divided between humans and AI agents?
- How can requirements, implementation, QA, and approval be separated clearly?
- How can context be scoped so that each agent receives only the information it needs?
- How can TDD and review workflows be preserved when agents participate in development?
- How can Git history show not only code changes, but also the decision process behind them?

This repository uses a Todo application to experiment with those questions in a concrete, inspectable environment.

## Goals

The project focuses on the software development lifecycle around the app rather than the complexity of the app itself.

Primary goals:

- Design a human-in-the-loop development process
- Define clear AI Agent roles and responsibilities
- Prevent context pollution through scoped information access
- Apply TDD-based implementation practices
- Establish QA and review checkpoints
- Preserve an auditable development trail through Git history and workflow artifacts

## Development Strategy

### Phase 1: Traditional Todo App Baseline

The first phase implements a minimal Todo app without the full agent workflow.

Minimum scope:

- Create a Todo
- Mark a Todo as complete
- Delete a Todo
- Add basic tests

This baseline provides a reference point before introducing the structured Agentic SDLC process.

### Phase 2: Agentic Workflow

The second phase introduces explicit agent roles, scoped context, workflow artifacts, and review checkpoints around component development.

Each component is developed through a repeatable process:

```text
Human Request
  ↓
UI Owner
  ↓
UI Reviewer
  ↓
UI Implementor
  ↓
UI Reviewer
  ↓
UI Implementor
  ↓
UI Owner
  ↓
Human PR Approval
```

## Human Role

The Human acts as the workflow orchestrator and final PR approval authority.

The Human does not appear as a commit scope in the Agent workflow. Commit scopes represent Agent responsibilities, while Human approval is handled at the PR level.

Responsibilities:

- Define the initial request
- Start the workflow
- Resolve requirement-level conflicts
- Review the final Agent artifacts
- Approve or reject the PR for merge

This keeps Git history focused on Agent execution while preserving the human-in-the-loop control point before merge.

## Agent Roles

### UI Owner

The UI Owner owns UI requirements, component specifications, and final approval within the Agent workflow.

Responsibilities:

- Clarify requirements
- Design component behavior and UI expectations
- Write component specifications
- Resolve requirement-level questions with the human
- Approve the final result within the Agent workflow

Artifacts:

- `spec.md`
- `final-report.md`

### UI Implementor

The UI Implementor owns UI implementation and test code based on the approved specification and test plan.

Responsibilities:

- Implement based on `spec.md`
- Write and maintain test code based on `test-plan.md`
- Follow a TDD-oriented development process
- Address QA feedback without changing requirements

Artifacts:

- `implementation-summary.md`
- Implementation code
- Test code

### UI Reviewer

The UI Reviewer owns test planning, verification, and review for UI implementation work.

Responsibilities:

- Define the test plan before implementation begins, similar to how QA prepares test scenarios before validating a feature
- Verify test results
- Check specification compliance
- Review code quality
- Inspect accessibility and maintainability concerns
- Provide feedback without directly modifying implementation or test code

Artifacts:

- `test-plan.md`
- `qa-review.md`

## Context Management

Context management is treated as a first-class part of the workflow.

Each agent receives only the context required for its role:

- UI Owner: requirements and overall UI design context
- UI Reviewer during test planning: approved specification and expected behavior
- UI Implementor: approved specification and test plan
- UI Reviewer during QA review: approved specification, implementation result, and test results

Responsibility boundaries are intentionally strict:

- UI Reviewer defines the test plan and reviews results but does not implement fixes.
- UI Implementor implements and writes test code but does not change requirements or test intent.
- UI Owner owns requirement decisions and Agent workflow approval.
- Human owns final PR approval before merge.

This separation keeps decisions traceable and reduces the risk of context pollution between planning, implementation, and review.

## Component Workflow

### Step 1: Specification

Owner: UI Owner

Artifact:

- `spec.md`

Contents:

- Purpose
- Requirements
- Acceptance Criteria
- UI definition
- State definition

### Step 2: Test Planning

Owner: UI Reviewer

Artifact:

- `test-plan.md`

Contents:

- Test scenarios
- Success conditions
- Failure conditions
- Verification scope

### Step 3: Implementation

Owner: UI Implementor

Artifacts:

- Implementation code
- Test code
- `implementation-summary.md`

Principles:

- TDD-oriented implementation
- Test code should be based on `test-plan.md`
- All relevant tests must pass

### Step 4: QA Review

Owner: UI Reviewer

Artifact:

- `qa-review.md`

Review items:

- Test results
- Specification compliance
- Code quality
- Accessibility
- Maintainability

### Step 5: Feedback Resolution

Owner: UI Implementor

Artifact:

- Updated implementation summary

### Step 6: Final Approval

Owner: UI Owner

Artifact:

- `final-report.md`

Contents:

- Requirement fulfillment
- Agent workflow approval result
- Completion summary

## Git Commit Strategy

Each workflow step should be represented as a separate commit.

Example for `PR #2 - TodoItem Component`:

```text
docs(ui-owner): define TodoItem specification
test(ui-reviewer): define TodoItem test plan
feat(ui-implementor): implement TodoItem component
docs(ui-reviewer): review TodoItem implementation
fix(ui-implementor): address review feedback
docs(ui-owner): finalize TodoItem report
```

The Git history is expected to show both implementation progress and the workflow that produced it.

## PR Approval Strategy

Commit scopes represent Agent responsibilities. Human approval is intentionally handled at the PR level, not as a commit scope.

Before merge, the Human reviews:

- UI Owner final report
- UI Reviewer QA review
- Test results
- Requirement fulfillment

The PR can be merged only after Human approval.

## Future Expansion

Current stage:

- Local Agent workflow
- Human-orchestrated Agent roles

Future directions:

- GitHub Actions integration
- Automated Agent execution
- PR-based Agent workflow
- Automatic context handoff between Agents
- Agent-based review automation
