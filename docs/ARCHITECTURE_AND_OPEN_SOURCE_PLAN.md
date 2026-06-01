# Codex Company Framework - Architecture And Open Source Plan

Status: Draft plan
Date: 2026-06-01

## 1. Purpose

The Codex Company Framework is a reusable way to run Codex as an owner-led
software company inside local projects.

It separates three layers:

1. Owner
2. Company Creator
3. Workers

The goal is to make the owner mindset reusable across every project, while
allowing each project to have its own company, roles, memories, reports, and
workflow.

## 2. Core Architecture

### Owner

The Owner is the permanent operating mind.

The Owner does not belong to one project. The Owner is responsible for:

- understanding the user's intent;
- inspecting real files, runtime, database, logs, and artifacts before making claims;
- challenging worker outputs;
- rejecting weak evidence;
- defining next tasks;
- protecting project boundaries;
- deciding when to spawn workers;
- verifying reports before accepting them;
- updating durable memory after meaningful decisions.

The Owner should be implemented as a global Codex skill:

```text
C:\Users\<user>\.codex\skills\codex-owner-operator
```

Suggested activation:

```text
Use the codex-owner-operator skill.
Act as the Owner for this project. Inspect current memory and continue from the current task.
```

### Company Creator

The Company Creator designs a new project-specific company.

It is responsible for:

- inspecting a project folder;
- identifying required worker roles;
- creating company-specific skills;
- creating worker agent persona templates;
- creating memory/report folder structure;
- defining DB/runtime routing rules;
- writing smoke-test prompts;
- generating owner-review protocols;
- preparing install scripts and documentation.

The Company Creator should be implemented as a global Codex skill:

```text
C:\Users\<user>\.codex\skills\codex-company-creator
```

Suggested activation:

```text
Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a company structure for:
<project path>

First inspect the project, then propose roles, memory layout, report folders,
activation prompts, and validation steps. Do not modify code until approved.
```

### Workers

Workers are project-specific specialist agents.

Examples:

- backend engineer
- frontend engineer
- QA/test engineer
- data engineer
- product manager
- documentation writer
- security reviewer
- profitability analyst
- independent validation agent

Workers are not permanent across all projects. A trading project needs different
workers from a video-generation project or SaaS project.

Each worker should have:

- a role/persona file;
- a clear permission model;
- its own memory file;
- its own report/evidence/draft folders;
- a rule to return evidence, assumptions, and memory-update notes to the Owner.

## 3. Folder Model

### Global Codex Home

Installed global skills and owner memory:

```text
C:\Users\<user>\.codex\skills\codex-owner-operator
C:\Users\<user>\.codex\skills\codex-company-creator
C:\Users\<user>\.codex\owner_memory
```

### Project Company Root

Each project gets its own company workspace under a configurable external root.
For this machine the default root is:

```text
V:\Codex\Companies
```

Example:

```text
V:\Codex\Companies\sample-project-company
```

Suggested structure:

```text
company-root\
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

### Agent Memory

Agent memory should live inside Codex home, not inside project reports:

```text
C:\Users\<user>\.codex\agent_memory\<company_id>\<agent_name>\MEMORY.md
```

This keeps agent identity durable while keeping project documents separate.

## 4. Open Source Package Design

The public repository should contain framework templates, not private project
data.

Suggested repository name:

```text
codex-company-framework
```

Suggested public repo structure:

```text
codex-company-framework\
  README.md
  LICENSE
  docs\
    ARCHITECTURE.md
    QUICK_START_WINDOWS.md
    OWNER_WORKFLOW.md
    COMPANY_CREATOR_WORKFLOW.md
    WORKER_DESIGN.md
  skills\
    codex-owner-operator\
      SKILL.md
      agents\
        openai.yaml
    codex-company-creator\
      SKILL.md
      agents\
        openai.yaml
      references\
        company-template.md
        worker-role-template.md
        memory-layout-template.md
  templates\
    company\
      memory\
      agents\
      reports\
      prompts\
    worker\
      MEMORY.md
      ROLE.md
  installer\
    install.ps1
    install.bat
    uninstall.ps1
    validate.ps1
  examples\
    konda-style-company-example\
      README.md
```

Do not publish:

- private memory;
- project DB data;
- trading reports;
- API keys;
- Docker secrets;
- user names from this machine;
- local absolute private paths except as examples with placeholders.

## 5. Install Workflow

The open-source install should support a beginner-friendly Windows path.

### Option A: One Command

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\install.ps1
```

### Option B: Double Click

```text
installer\install.bat
```

The installer should:

1. detect the current Windows user;
2. locate Codex home:

```text
%USERPROFILE%\.codex
```

3. create missing folders:

```text
%USERPROFILE%\.codex\skills
%USERPROFILE%\.codex\owner_memory
%USERPROFILE%\.codex\agent_memory
```

4. copy global skills:

```text
skills\codex-owner-operator
skills\codex-company-creator
```

5. validate skills with Codex skill validation when available;
6. create a small install report;
7. print the next activation prompt.

## 6. Owner Workflow

Default Owner loop:

1. Identify project/company context.
2. Read current company memory.
3. Inspect real files/runtime before claims.
4. Decide whether workers are needed.
5. Spawn or instruct workers with exact scope.
6. Review worker output as draft, not truth.
7. Verify key claims with evidence.
8. Accept, reject, or refine.
9. Decide next task.
10. Update memory.

The Owner must always separate:

- facts;
- assumptions;
- unsupported claims;
- decisions;
- next actions.

## 7. Company Creator Workflow

Default Company Creator loop:

1. Inspect the project folder.
2. Identify project type and risk areas.
3. Identify required worker roles.
4. Define company folder layout.
5. Define memory and report rules.
6. Define runtime/DB/environment routing rules.
7. Create company skill.
8. Create worker role templates.
9. Create smoke-test prompt.
10. Ask Owner to review before production use.

## 8. Standard New Chat Activation

### Continue Existing Company

```text
Use the codex-owner-operator skill.
Use the <company-skill-name> skill.

Act as Owner for <company name>.
Read current company memory and continue from the current next task.
```

### Create New Company

```text
Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a new Codex company for:
<project path>

Inspect first. Then propose workers, memory layout, report layout,
activation prompts, and smoke tests.
```

### Run Worker Task

```text
Use the codex-owner-operator skill.
Use the <company-skill-name> skill.

Spawn these workers:
- <worker_a>
- <worker_b>
- <worker_c>

Task:
<exact task>

Every worker must return:
- evidence checked;
- findings;
- assumptions;
- recommended next task;
- memory-update notes.

Owner must verify before accepting.
```

## 9. Validation Plan

Before publishing:

1. Create `codex-owner-operator` skill.
2. Create `codex-company-creator` skill.
3. Validate both skills with `quick_validate.py`.
4. Create installer scripts.
5. Test install into a temporary Codex home.
6. Create one sample company from a test folder.
7. Verify new-chat activation works.
8. Verify no private Konda/PR208 data is included.
9. Add README and license.
10. Push to GitHub only after final owner review.

## 10. License Recommendation

Recommended license:

```text
MIT
```

Reason:
- simple;
- beginner-friendly;
- allows free use, modification, and redistribution;
- good for a workflow/framework project.

Final license should be confirmed before publishing.

## 11. Immediate Next Steps

Phase 1 - Document and agree:

- Review this architecture.
- Confirm names:
  - `codex-owner-operator`
  - `codex-company-creator`
  - `codex-company-framework`
- Confirm default company root:
  - `V:\Codex\Companies`
- Confirm license:
  - MIT recommended.

Phase 2 - Build local framework:

- Create the two global skills.
- Create owner memory folder.
- Create company template.
- Create worker template.
- Create install/validate scripts.

Phase 3 - Test locally:

- Validate skills.
- Create a dummy company.
- Create a Konda company adapter from current structure.
- Smoke-test new chat activation.

Phase 4 - Prepare GitHub:

- Remove private paths and private data.
- Add README.
- Add LICENSE.
- Add setup screenshots or command examples.
- Create Git repo.
- Commit.
- Push to public GitHub repository.
