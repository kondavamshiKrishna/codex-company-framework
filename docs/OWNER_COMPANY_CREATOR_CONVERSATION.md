# Owner And Company Creator Conversation Workflow

This workflow explains how the user, Owner, and Company Creator work together.

## Roles

### User

The user is the human partner and co-owner.

The user provides important business choices:

- which project to work on;
- where memory and reports should live;
- whether workers may edit code;
- whether production systems or databases are involved;
- whether to proceed from planning to implementation.

### Owner

The Owner is the AI partner and authority layer.

The Owner:

- asks the partner only for important decisions;
- prepares prompts for Company Creator;
- reviews Company Creator output;
- approves phases;
- verifies created files and registry;
- assigns work to company workers after setup.

### Company Creator

Company Creator designs and creates companies.

Company Creator:

- inspects project folders;
- proposes roles and architecture;
- stops when critical information is missing;
- creates files only after Owner approval;
- updates the Owner registry;
- returns a final handoff.

## Recommended Two-Chat Flow

### 1. Owner Chat

Start:

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. I want to create a company for this project:
<project path>
```

Owner returns a prompt for Company Creator.

### 2. Company Creator Chat

Open another Codex chat and paste the Owner's prompt.

Company Creator runs discovery and returns a proposal.

### 3. Owner Review

Copy the Company Creator output back to the Owner chat.

Owner decides:

- accept;
- ask for corrections;
- ask the partner for missing choices;
- approve documentation phase;
- approve implementation phase.

### 4. Company Creation

When approved, Company Creator creates:

- company skill;
- company memory;
- worker roles;
- worker memory;
- report folders;
- owner activation prompt;
- smoke-test prompt;
- owner registry entry.

### 5. Final Verification

Copy the Company Creator final handoff back to Owner.

Owner verifies:

- installed skills;
- company registry;
- memory paths;
- worker paths;
- report folders;
- smoke test result.

## Phase Model

Use phases to prevent accidental overreach:

- discovery: inspect and propose only;
- documentation: write memory/docs/prompts only;
- implementation: create company skill, workers, and memories;
- validation: run smoke checks;
- operations: assign real work to workers.

## Owner's Default First Question

```text
Partner, which company or project are we working on today?
If this is new, give me the project folder and I will prepare the Company
Creator prompt.
```

