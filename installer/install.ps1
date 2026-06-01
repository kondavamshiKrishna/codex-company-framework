param(
    [string]$CodexHome = "$env:USERPROFILE\.codex"
)

$ErrorActionPreference = "Stop"

$InstallerDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $InstallerDir
$SourceSkills = Join-Path $RepoRoot "skills"
$TargetSkills = Join-Path $CodexHome "skills"
$OwnerMemory = Join-Path $CodexHome "owner_memory"
$AgentMemory = Join-Path $CodexHome "agent_memory"

Write-Host "Codex Company Framework installer"
Write-Host "Repo:       $RepoRoot"
Write-Host "CodexHome:  $CodexHome"

if (-not (Test-Path -LiteralPath $SourceSkills)) {
    throw "Missing source skills folder: $SourceSkills"
}

New-Item -ItemType Directory -Force -Path $TargetSkills | Out-Null
New-Item -ItemType Directory -Force -Path $OwnerMemory | Out-Null
New-Item -ItemType Directory -Force -Path $AgentMemory | Out-Null

$SkillNames = @(
    "codex-owner-operator",
    "codex-company-creator"
)

foreach ($SkillName in $SkillNames) {
    $Source = Join-Path $SourceSkills $SkillName
    $Target = Join-Path $TargetSkills $SkillName

    if (-not (Test-Path -LiteralPath $Source)) {
        throw "Missing skill source: $Source"
    }

    if (Test-Path -LiteralPath $Target) {
        Remove-Item -LiteralPath $Target -Recurse -Force
    }

    Copy-Item -LiteralPath $Source -Destination $Target -Recurse
    Write-Host "Installed skill: $SkillName"
}

$OwnerProtocol = Join-Path $OwnerMemory "OWNER_OPERATING_PROTOCOL.md"
if (-not (Test-Path -LiteralPath $OwnerProtocol)) {
@"
# Owner Operating Protocol

The Owner is the permanent operating layer across projects.

Core behavior:
- inspect real files/runtime before making operational claims;
- treat worker output as draft evidence;
- verify numbers, routes, and artifacts independently;
- separate facts, assumptions, unsupported claims, decisions, and next tasks;
- protect project boundaries and avoid wrong database/runtime usage;
- update memory only with durable, useful state.
"@ | Set-Content -LiteralPath $OwnerProtocol -Encoding UTF8
    Write-Host "Created owner memory: $OwnerProtocol"
}

$Report = Join-Path $CodexHome "codex-company-framework-install-report.txt"
@"
Codex Company Framework install report
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
CodexHome: $CodexHome
Installed skills:
- codex-owner-operator
- codex-company-creator
Owner memory: $OwnerMemory
Agent memory: $AgentMemory

Next prompt:
Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a new Codex company for:
<project path>

Inspect first. Then propose workers, memory layout, report layout, activation prompts, and smoke tests.
"@ | Set-Content -LiteralPath $Report -Encoding UTF8

Write-Host ""
Write-Host "Install complete."
Write-Host "Report: $Report"
Write-Host ""
Write-Host "Next prompt:"
Write-Host "Use the codex-owner-operator skill."
Write-Host "Use the codex-company-creator skill."

