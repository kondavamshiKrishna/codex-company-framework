# Codex Company Framework

Codex Company Framework is a reusable local workflow for running Codex as an
owner-led software company.

It separates:

- Owner: permanent project-control and review mindset.
- Company Creator: creates project-specific companies and worker teams.
- Workers: project-specific specialist agents.

The framework is designed for local Codex Desktop/CLI-style environments where
skills live under:

```text
%USERPROFILE%\.codex\skills
```

## Install

### From npm

After the package is published to the npm registry:

```powershell
npx codex-company-framework setup
```

Until then, install directly from GitHub through npm:

```powershell
npx github:kondavamshiKrishna/codex-company-framework setup
```

The setup command asks for:

- Codex home;
- Owner memory root;
- Agent memory root;
- external company/project memory root;
- worker documents/reports root.

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

## New Chat Usage

Continue an existing company:

```text
Use the codex-owner-operator skill.
Use the <company-skill-name> skill.

Act as Owner for <company name>. Read current company memory and continue from
the current next task.
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

## What This Repository Must Not Contain

Do not publish:

- API keys, tokens, passwords, cookies, or private keys;
- private project reports;
- database dumps;
- user-specific local memory;
- confidential customer/project data.

## License

MIT.
