# Codex Company Framework

Codex Company Framework is a reusable local workflow for running Codex as an
owner-led software company.

It separates:

- Owner: permanent project-control and review mindset; the user's AI partner.
- Company Creator: creates project-specific companies and worker teams.
- Workers: project-specific specialist agents.

The framework is designed for local Codex Desktop/CLI-style environments where
skills live under:

```text
%USERPROFILE%\.codex\skills
```

## Install

### From npm

Install from the npm registry:

```powershell
npx codex-company-framework setup
```

Development fallback, if you need to run the current GitHub source before a new
npm version is published:

```powershell
npx github:kondavamshiKrishna/codex-company-framework setup
```

The setup command asks for:

- external memory drive.
- whether to configure Codex runtime for company workflows.

By default, internal Codex paths are automatic:

```text
%USERPROFILE%\.codex
%USERPROFILE%\.codex\owner_memory
%USERPROFILE%\.codex\agent_memory
```

Use `--advanced` only if you intentionally want to change those internal paths.

On Windows, setup detects available drives and asks which drive should hold
external company memory. It skips the system drive when another drive is
available. It then creates:

```text
<selected-drive>:\Codex\Companies
```

That folder stores company documents, Owner project memory, worker reports,
prompts, and evidence.

By default, setup also updates:

```text
%USERPROFILE%\.codex\config.toml
```

with company-workflow runtime capacity:

```toml
model_reasoning_effort = "high"
max_threads = 20
max_depth = 20
job_max_runtime_seconds = 3600
```

This gives workers and nested worker chains enough room for long audits. Setup
does not force a model or full-access sandbox mode because those are
account/system-specific. To opt out:

```powershell
npx codex-company-framework setup --no-runtime-config
```

To set a specific model or sandbox mode intentionally:

```powershell
npx codex-company-framework setup --yes --model "<your-model>" --sandbox-mode "<your-sandbox-mode>"
```

Normal setup uses the selected drive for both company memory and worker reports.
Use `--advanced` or `--worker-documents-root` only if you intentionally want a
different report root.

After setup, the terminal prints the exact first prompt to paste into Codex IDE.
It also saves prompt files under:

```text
%USERPROFILE%\.codex\owner_memory\FIRST_OWNER_PROMPT.md
%USERPROFILE%\.codex\owner_memory\COMPANY_CREATOR_DISCOVERY_PROMPT_TEMPLATE.md
```

If existing companies point at an old drive or missing memory folder, setup and
`doctor` print company-integrity warnings. Repair those before starting project
work.

After setup, create a company from a project folder:

```powershell
npx codex-company-framework init-company
```

GitHub fallback:

```powershell
npx github:kondavamshiKrishna/codex-company-framework init-company
```

### From Git Clone

From this repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\install.ps1
```

Or double-click:

```text
installer\install.bat
```

The clone installer delegates to the same setup command used by npm, so it
creates the framework config, Owner prompt files, memory roots, and global
skills.

## New Chat Usage

Start with the Owner:

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. Which company or project are we working on today?
```

If this is a new project, the Owner prepares the first prompt for a separate
Company Creator chat. The Company Creator proposes the company. The user copies
that output back to the Owner. The Owner reviews, corrects, and only then
approves company creation.

Recommended first prompt after setup:

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. I am opening this project in Codex IDE.

First, run the company integrity gate. If this project already has a company,
tell me which company skill to use only after registry, skill, memory, report,
project, worker roster, worker folders, role files, and agent-memory paths are
internally consistent.

If any company path, registry, skill, worker, or memory check fails, do not
continue project work. Report the mismatch and give the Company Creator repair
prompt first.

If it does not have a company yet, ask me for the project folder if needed,
then prepare the first discovery prompt that I should paste into a separate
Company Creator chat.

Do not create files yet. Start by orienting me and telling me the next step.
```

Continue an existing company:

```text
Use the codex-owner-operator skill.
Use the <company-skill-name> skill.

Act as Owner for <company name>. Run the company integrity gate first. If
registry, skill, memory, report, project, worker roster, worker folders, role
files, or agent-memory paths disagree, stop and report the Company Creator
repair prompt before doing project work. If integrity passes, read current
company memory and continue from the current next task.
```

Create a new company:

```text
Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a new Codex company for:
<project path>

Inspect first. Then propose workers, memory layout, report layout, activation
prompts, and smoke tests.
```

If a company root already exists, `init-company` stops instead of overwriting
memory. Use `--force` only when you intentionally want to regenerate framework
files for that company.

## Remove A Company

To remove one project/company install:

```powershell
npx codex-company-framework remove-company --id video-nut
```

The first run is a dry run. It prints the company skill, registry entry,
company root, and per-agent memory that would be removed. To confirm:

```powershell
npx codex-company-framework remove-company --id video-nut --yes
```

This does not delete the source project folder. It removes only framework
artifacts for that company.

## Uninstall Framework

Dry run for the global Owner and Company Creator install:

```powershell
npx codex-company-framework uninstall
```

Confirm removal of global Owner/Company Creator skills and framework config:

```powershell
npx codex-company-framework uninstall --yes
```

To remove framework config, Owner memory, and all agent memory too:

```powershell
npx codex-company-framework uninstall --all --yes
```

## What This Repository Contains

```text
skills\codex-owner-operator
skills\codex-company-creator
templates\company
templates\worker
installer
docs
examples
```

## Worker Behavior Standard

Generated workers are professional specialists. They can say no, warn the
Owner, ask for clarification, and escalate unsafe or unsupported tasks. Worker
outputs are draft evidence; the Owner verifies critical claims before accepting
them.

## What This Repository Must Not Contain

Do not publish:

- API keys, tokens, passwords, cookies, or private keys;
- private project reports;
- database dumps;
- user-specific local memory;
- confidential customer/project data.

## License

MIT.
