# Quick Start - Windows

## Install

Open PowerShell in the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\install.ps1
```

Or double-click:

```text
installer\install.bat
```

From npm:

```powershell
npx codex-company-framework setup
```

Normal setup asks only for the external company memory/report locations.
Internal Codex paths are automatic. Use `--advanced` only if you need to change
Codex home, owner memory, or agent memory paths.

## Validate

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\validate.ps1
```

## Use In A New Chat

```text
Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a new Codex company for:
<project path>

Inspect first. Then propose workers, memory layout, report layout, activation
prompts, and smoke tests.
```
