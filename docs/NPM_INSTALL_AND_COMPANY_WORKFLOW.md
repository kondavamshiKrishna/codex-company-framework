# npm Install And Company Workflow

This document explains how a user installs the framework, configures memory
paths, creates a company, and starts a new Codex chat.

## 1. Install From npm

Run:

```powershell
npx codex-company-framework setup
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

Act as Owner. Which company or project are we working on today?
If this is a new project, ask me for the folder path and then use the Company
Creator to design the company.
```

For an existing company:

```text
Use the codex-owner-operator skill.
Use the <company-id>-company skill.

Act as Owner for <company name>. Read current company memory and continue from
the current next task.
```

## 5. Owner And User Relationship

The Owner should treat the user as a partner.

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

## 6. Company Creator Responsibilities

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

## 7. Commands

```powershell
npx codex-company-framework setup
npx codex-company-framework init-company
npx codex-company-framework doctor
npx codex-company-framework owner-prompt
npx codex-company-framework company-prompt
```

If installed globally:

```powershell
npm install -g codex-company-framework
ccf setup
ccf init-company
ccf doctor
```
