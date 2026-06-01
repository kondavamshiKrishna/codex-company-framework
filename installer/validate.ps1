param(
    [string]$CodexHome = "$env:USERPROFILE\.codex"
)

$ErrorActionPreference = "Stop"

$Required = @(
    (Join-Path $CodexHome "skills\codex-owner-operator\SKILL.md"),
    (Join-Path $CodexHome "skills\codex-owner-operator\agents\openai.yaml"),
    (Join-Path $CodexHome "skills\codex-company-creator\SKILL.md"),
    (Join-Path $CodexHome "skills\codex-company-creator\agents\openai.yaml"),
    (Join-Path $CodexHome "owner_memory"),
    (Join-Path $CodexHome "agent_memory")
)

$Missing = @()
foreach ($Path in $Required) {
    if (-not (Test-Path -LiteralPath $Path)) {
        $Missing += $Path
    }
}

if ($Missing.Count -gt 0) {
    Write-Host "Validation failed. Missing paths:" -ForegroundColor Red
    $Missing | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
    exit 1
}

Write-Host "Validation passed."
Write-Host "CodexHome: $CodexHome"
Write-Host "Skills:"
Write-Host "- codex-owner-operator"
Write-Host "- codex-company-creator"

