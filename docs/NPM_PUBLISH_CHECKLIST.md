# npm Publish Checklist

Package name:

```text
codex-company-framework
```

Current package version:

```text
0.1.2
```

## Pre-Publish Checks

Run:

```powershell
node --check bin\codex-company-framework.js
npm pack --dry-run
```

Optional temporary install flow:

```powershell
node bin\codex-company-framework.js setup --yes --codex-home .\.tmp-codex-home
node bin\codex-company-framework.js init-company --yes --codex-home .\.tmp-codex-home --project . --name "Sample Project"
```

Remove temporary folders before committing.

## Publish

Log in:

```powershell
npm login
npm whoami
```

Publish:

```powershell
npm publish --access public
```

## Use Before npm Registry Publish

Users can still run through npm from GitHub:

```powershell
npx github:kondavamshiKrishna/codex-company-framework setup
npx github:kondavamshiKrishna/codex-company-framework init-company
```
