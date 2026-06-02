---
name: codex-company-creator
description: Create project-specific Codex companies with worker roles, company skills, memory folders, report folders, prompts, installer guidance, and smoke tests. Use when the user asks to make a new company, design agents/workers for a project, convert a project into a company workflow, or prepare a reusable open-source company framework.
---

# Codex Company Creator

Use this skill to design and create project-specific Codex companies. A company
is a reusable operating structure for a project: company skill, worker roles,
memory layout, report folders, prompts, and validation.

The Company Creator works for the Owner. It should produce proposals, ask for
missing decisions, create files only in an approved phase, and report the final
company registry details back to the Owner.

Before choosing paths, read the framework config when available:

```text
%USERPROFILE%\.codex\codex-company-framework.yaml
```

Use `company_root`, `worker_documents_root`, `owner_memory_root`, and
`agent_memory_root` from that config. Also read configured runtime expectations
such as `max_threads`, `max_depth`, and `job_max_runtime_seconds` when present.
Never assume a specific drive letter.

## Company Creation Workflow

1. Read the Owner request and phase.
2. Inspect the project folder before designing roles.
3. Identify project type, runtime, data stores, risk areas, and user goals.
4. Propose the company name and company skill name.
5. Propose worker roles only where they create useful separation.
6. Define worker behavior, permission boundaries, refusal rules, escalation
   rules, memory rules, and report layout.
7. Define runtime, DB, API, and environment routing rules.
8. Define worker permission levels and which roles may edit code, run tests,
   use web search, inspect databases, or touch runtime state.
9. Stop and ask if any required path, permission, runtime route, or business goal is missing.
10. Create company skill and worker persona templates only after Owner approval.
11. Create smoke-test prompts.
12. Validate worker roster, worker folders, role files, per-agent memory, and report/evidence folders.
13. Run one controlled smoke test when allowed.
14. Return the final handoff and Owner registry entry.

## Phase Rules

The Owner should specify the phase.

- discovery: inspect and propose only; do not write files;
- documentation: write memory/docs/prompts only;
- implementation: create company skill, workers, memories, and report folders;
- repair: fix an existing company's registry, skill path, memory root, report root, or activation prompt without doing project work;
- validation: run smoke checks and verify activation;
- operations: prepare first worker task.

If the phase is missing, default to discovery and do not create files.

## Questions To Ask

Ask only what cannot be inferred safely from the project.

Minimum questions:

- What project folder should become the company?
- Where should external company memory and reports be stored?
- Should the default Codex home be used for skills and agent memory?
- Should workers start read-only, or can engineering workers edit after owner approval?
- Are there live databases, Docker stacks, APIs, customer data, secrets, or production systems?
- What is the first business goal for this company?

If the user is unsure, propose defaults and explain the tradeoff briefly.

## Stop And Ask Rules

Stop and ask the Owner before creating files if any of these are unclear:

- project path;
- company root;
- Codex home;
- owner memory root;
- agent memory root;
- worker report/document root;
- whether workers may edit code;
- whether the project touches production systems;
- database/runtime route protection;
- whether the user wants documentation-only or full implementation.

Do not invent production routes, database names, or secret locations.

If the request is to repair an existing company, do only company-framework
repair work. Do not continue the product/project task until the Owner confirms
that registry, skill, memory, report, worker roster, worker folders, role files,
and per-agent memories are consistent.

## Default Company Layout

Use this external project-document layout unless the user provides a different
root:

```text
<company-root>\
  memory\
    README.md
    CURRENT_STATE.md
    ARCHITECTURE.md
    OWNER_REVIEW_PROTOCOL.md
    PROMPT_DESIGN_PROTOCOL.md
    OBSERVATIONS_AND_BACKLOG.md
  agents\
    <agent_name>\
      reports\
      evidence\
      drafts\
      handoff\
  reports\
    owner_review\
    cross_agent\
    final\
    archive\
  prompts\
  company_skill\
  installer\
```

## Agent Memory Layout

Keep durable agent memory in Codex home, not in project report folders:

```text
<agent_memory_root>\<company_id>\<agent_name>\MEMORY.md
```

Project documents, evidence, and reports belong in the company root.

## Worker Role Template

Each worker needs:

- role name;
- responsibilities;
- allowed actions;
- forbidden actions;
- required memory path;
- allowed report/evidence paths;
- verification expectations;
- escalation rules;
- output format.

Every worker role must explicitly state that the worker can say no, warn the
Owner, ask for clarification, and escalate when the task is unsafe,
under-specified, outside its role, or unsupported by evidence. Workers should
think professionally across edge cases, risks, missing tests, hidden
dependencies, and alternate explanations. They should not act as final
decision-makers; their output is draft evidence for Owner review.

Company repair must create or verify every worker has:

- `<company-root>\agents\<worker>\ROLE.md`;
- `<company-root>\agents\<worker>\reports`;
- `<company-root>\agents\<worker>\evidence`;
- `<company-root>\agents\<worker>\drafts`;
- `<company-root>\agents\<worker>\handoff`;
- `<agent_memory_root>\<company_id>\<worker>\MEMORY.md`.

## Permission Model

Assign permissions by role:

- auditor: read files, run read-only commands, write reports;
- QA/test engineer: run tests, write test reports, propose fixes;
- backend/frontend engineer: edit relevant code only after owner-approved task;
- researcher: use web/search when needed, cite sources, write research notes;
- documentation writer: write docs/reports, avoid code changes unless asked;
- devops/runtime engineer: inspect containers/logs/config, avoid destructive state changes unless approved.

For long-running or nested company work, record the expected runtime capacity
from framework config. If the requested worker plan requires more parallelism,
deeper nesting, or longer runs than configured, report that as a setup gap to
the Owner before creating the company.

## Company Skill Requirements

Every company skill should include:

- project identity;
- exact repo paths;
- exact DB/runtime routing;
- approved output folders;
- worker list;
- memory rules;
- owner-review standard;
- common activation prompts;
- smoke-test checklist.

## Owner Update Requirement

After creating a company, update the Owner registry:

```text
<owner_memory_root>\CURRENT_COMPANIES.md
```

The Owner must be able to discover:

- what companies exist;
- which company skill to use;
- where company memory lives;
- what workers exist;
- how to prompt those workers.

Return this exact handoff block to the Owner:

```text
Company created:
Company name:
Company ID:
Company skill:
Project path:
Company memory:
Owner registry updated:
Workers:
Activation prompt:
Smoke-test report:
Missing follow-ups:
```

If the Owner registry cannot be updated, state that clearly and provide the
exact registry entry for the Owner to apply.

## Smoke Test Checklist

A new company is not ready until a smoke test verifies:

- current user/profile;
- Codex home;
- company skill visibility;
- worker persona files;
- agent memory folders;
- project folder exists;
- required runtime or DB route works, if applicable;
- report output path is writable;
- no private secrets are included in generated public files.

## References

Use these templates when creating real company files:

```text
references\company-template.md
references\worker-role-template.md
references\memory-layout-template.md
```
