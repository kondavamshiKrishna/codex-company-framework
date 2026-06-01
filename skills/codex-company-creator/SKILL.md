---
name: codex-company-creator
description: Create project-specific Codex companies with worker roles, company skills, memory folders, report folders, prompts, installer guidance, and smoke tests. Use when the user asks to make a new company, design agents/workers for a project, convert a project into a company workflow, or prepare a reusable open-source company framework.
---

# Codex Company Creator

Use this skill to design and create project-specific Codex companies. A company
is a reusable operating structure for a project: company skill, worker roles,
memory layout, report folders, prompts, and validation.

## Company Creation Workflow

1. Inspect the project folder before designing roles.
2. Identify project type, runtime, data stores, risk areas, and user goals.
3. Propose the company name and company skill name.
4. Propose worker roles only where they create useful separation.
5. Define memory and report layout.
6. Define runtime, DB, API, and environment routing rules.
7. Define worker permission levels.
8. Create company skill and worker persona templates after owner approval.
9. Create smoke-test prompts.
10. Validate files and run one controlled smoke test.

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
C:\Users\<user>\.codex\agent_memory\<company_id>\<agent_name>\MEMORY.md
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

## Permission Model

Assign permissions by role:

- auditor: read files, run read-only commands, write reports;
- QA/test engineer: run tests, write test reports, propose fixes;
- backend/frontend engineer: edit relevant code only after owner-approved task;
- researcher: use web/search when needed, cite sources, write research notes;
- documentation writer: write docs/reports, avoid code changes unless asked;
- devops/runtime engineer: inspect containers/logs/config, avoid destructive state changes unless approved.

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
C:\Users\<user>\.codex\owner_memory\CURRENT_COMPANIES.md
```

The Owner must be able to discover:

- what companies exist;
- which company skill to use;
- where company memory lives;
- what workers exist;
- how to prompt those workers.

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
