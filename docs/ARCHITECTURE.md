# Architecture

Codex Company Framework has three layers.

## Owner

The Owner is project-independent. It controls the workflow, verifies evidence,
supervises workers, rejects weak claims, and decides next tasks.

Installed skill:

```text
%USERPROFILE%\.codex\skills\codex-owner-operator
```

## Company Creator

The Company Creator creates a project-specific company: company skill, worker
roles, memory layout, reports, prompts, and smoke tests.

Installed skill:

```text
%USERPROFILE%\.codex\skills\codex-company-creator
```

## Workers

Workers are project-specific. They can be backend engineers, QA engineers,
analysts, documentation writers, researchers, or any other role needed by the
project.

Workers should have bounded responsibilities, memory, output folders, evidence
rules, and escalation rules.

