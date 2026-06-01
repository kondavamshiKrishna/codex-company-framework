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

On Windows, setup detects available drives and asks which drive should be used
for external company memory. It skips the system drive when another drive is
available. It creates:

```text
<selected-drive>:\Codex\Companies
```

For scripted setup:

```powershell
npx codex-company-framework setup --yes --drive E
```

After setup, copy the first Owner prompt printed in the terminal, open Codex IDE
in your project folder, and paste that prompt into a new chat.

## Validate

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\validate.ps1
```

## Use In A New Chat

```text
Use the codex-owner-operator skill.

Act as Owner and my AI partner. I am opening this project in Codex IDE.

First, check whether this project already has a company. If it does, tell me
which company skill to use and continue from its current memory.

If it does not have a company yet, ask me for the project folder if needed,
then prepare the first discovery prompt that I should paste into a separate
Company Creator chat.

Do not create files yet. Start by orienting me and telling me the next step.
```
