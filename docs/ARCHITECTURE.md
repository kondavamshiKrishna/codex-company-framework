# Architecture

Codex Company Framework has three layers.

## Owner

The Owner is project-independent. It controls the workflow, verifies evidence,
supervises workers, rejects weak claims, and decides next tasks.

Before project work, the Owner runs an integrity gate: framework config,
runtime capacity, registry, company skill, memory paths, project path, worker
roster, worker folders, role files, and per-agent memory.

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

Workers are not blind executors. A worker can say no, warn the Owner, ask for
clarification, and escalate when the task is unsafe, under-specified, outside
role, or unsupported by evidence. Worker output is draft evidence for Owner
review.

## Runtime Capacity

Setup can update the user's Codex `config.toml` for company workflows:

```toml
model_reasoning_effort = "high"
max_threads = 20
max_depth = 20
job_max_runtime_seconds = 3600
```

This supports parallel workers, nested worker chains, and 45-60 minute agent
runs. The framework does not force a model or sandbox mode unless the user
passes those values explicitly.
