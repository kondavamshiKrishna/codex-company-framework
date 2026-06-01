# npm Install And Company Workflow

This document explains how a user installs the framework, configures memory
paths, creates a company, and starts a new Codex chat.

## 1. Install From npm

After publishing to the npm registry, run:

Run:

```powershell
npx codex-company-framework setup
```

Before npm registry publishing, run from GitHub through npm:

```powershell
npx github:kondavamshiKrishna/codex-company-framework setup
```

For default non-interactive setup:

```powershell
npx codex-company-framework setup --yes
```

With explicit paths:

```powershell
npx codex-company-framework setup --yes `
  --codex-home "C:\Users\<user>\.codex" `
  --company-root "V:\Codex\Companies" `
  --worker-documents-root "V:\Codex\Companies"
```

The setup wizard asks:

```text
Codex home
Owner memory root
Agent memory root
External company/project memory root
Worker documents/reports root
```

Recommended Windows defaults:

```text
Codex home:                    C:\Users\<user>\.codex
Owner memory root:             C:\Users\<user>\.codex\owner_memory
Agent memory root:             C:\Users\<user>\.codex\agent_memory
External company memory root:  V:\Codex\Companies
Worker documents/reports root: V:\Codex\Companies
```

If the user does not have a `V:` drive, use:

```text
C:\Users\<user>\CodexCompanies
```

The setup command creates:

```text
C:\Users\<user>\.codex\skills\codex-owner-operator
C:\Users\<user>\.codex\skills\codex-company-creator
C:\Users\<user>\.codex\owner_memory
C:\Users\<user>\.codex\agent_memory
C:\Users\<user>\.codex\codex-company-framework.yaml
```

By default, setup installs the two permanent global agents as Codex skills:

```text
codex-owner-operator
codex-company-creator
```

The Owner is the user's AI partner and project authority. The Company Creator is
called by the Owner when a new project needs a company structure.

## 2. Config YAML

The framework writes this file:

```text
C:\Users\<user>\.codex\codex-company-framework.yaml
```

Example:

```yaml
version: "1"
codex_home: "C:\\Users\\<user>\\.codex"
owner_memory_root: "C:\\Users\\<user>\\.codex\\owner_memory"
agent_memory_root: "C:\\Users\\<user>\\.codex\\agent_memory"
company_root: "V:\\Codex\\Companies"
worker_documents_root: "V:\\Codex\\Companies"
default_owner_skill: "codex-owner-operator"
default_company_creator_skill: "codex-company-creator"
```

This YAML belongs to the framework. Codex skills are still installed under the
normal Codex skills directory.

## 3. Create A Company

Run:

```powershell
npx codex-company-framework init-company
```

GitHub fallback:

```powershell
npx github:kondavamshiKrishna/codex-company-framework init-company
```

For non-interactive company creation:

```powershell
npx codex-company-framework init-company --yes `
  --project "D:\Projects\MyApp" `
  --name "My App" `
  --workers "product-manager,backend-engineer,qa-test-engineer,documentation-writer"
```

The wizard asks:

```text
Codex home
Project folder to turn into a company
Company name
Company ID
Company memory/report root
Worker roles
```

It creates:

```text
<company-root>\memory
<company-root>\agents
<company-root>\reports
<company-root>\prompts
<company-root>\company_skill
C:\Users\<user>\.codex\skills\<company-id>-company
C:\Users\<user>\.codex\agent_memory\<company-id>\<worker-name>\MEMORY.md
```

It also updates:

```text
C:\Users\<user>\.codex\owner_memory\CURRENT_COMPANIES.md
```

## 4. Start The Owner In A New Chat

After setup, use:

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. Which company or project are we working on today?
If this is a new project, ask me for the folder path, prepare the first Company
Creator prompt, review the Company Creator output, and approve creation only
after evidence and paths are clear.
```

For an existing company:

```text
Use the codex-owner-operator skill.
Use the <company-id>-company skill.

Act as Owner for <company name>. Read current company memory and continue from
the current next task.
```

## 5. Owner And User Relationship

The Owner should treat the user as a partner. The user and Owner are co-owners
of the company. The Owner should reduce the user's manual burden and ask only
for important decisions.

The Owner should ask:

```text
Which company are we working on today?
What is the main goal?
Do we already have a company for this project?
Should workers start read-only or can they edit after approval?
Are there live databases, Docker stacks, APIs, or production systems to protect?
```

The Owner should not ask unnecessary questions when the project can be inferred
from the current workspace or existing company registry.

## 6. Two-Chat Company Creation Workflow

Use this when creating a new company.

### Chat 1: Owner

User starts:

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. I want to create a company for this project:
<project path>
```

Owner responds with a Company Creator prompt.

### Chat 2: Company Creator

User opens a second chat and pastes the Owner's prompt:

```text
Use the codex-company-creator skill.

You are Company Creator for a new Codex company.
Project path:
<project path>

Phase:
discovery only

Inspect the project and return the proposed company design.
Do not create files yet.
```

Company Creator returns a proposal. User copies that output back to the Owner.

### Back To Chat 1: Owner Review

Owner reviews:

```text
Verdict:
Accepted:
Corrections needed:
Missing decisions:
Approved phase:
Next prompt for Company Creator:
```

If approved, the Owner gives the user the implementation prompt for Company
Creator. Company Creator creates the company, updates the Owner registry, and
returns the final handoff.

### Final Owner Verification

User copies the final Company Creator handoff back to Owner. Owner verifies:

- company skill exists;
- company memory exists;
- owner registry is updated;
- worker memories exist;
- report folders exist;
- activation prompt is correct;
- smoke test passes or has a clear blocker.

## 7. Company Creator Responsibilities

The Company Creator should:

1. inspect the project folder;
2. infer project type and risk areas;
3. propose workers;
4. define memory and reports;
5. define runtime/DB/API routing;
6. create company files;
7. create the company skill;
8. update the Owner registry;
9. write a smoke-test prompt;
10. tell the user what to paste in a new chat.

## 8. Commands

```powershell
npx codex-company-framework setup
npx codex-company-framework init-company
npx codex-company-framework doctor
npx codex-company-framework owner-prompt
npx codex-company-framework company-prompt
npx codex-company-framework creator-discovery --project "D:\Projects\MyApp"
```

If installed globally:

```powershell
npm install -g codex-company-framework
ccf setup
ccf init-company
ccf doctor
```

## 9. Publishing To npm

Publishing requires an npm account login on the machine:

```powershell
npm login
npm whoami
npm publish --access public
```

Before publishing:

```powershell
npm pack --dry-run
node --check bin\codex-company-framework.js
node bin\codex-company-framework.js setup --yes --codex-home .\.tmp-codex-home
```
