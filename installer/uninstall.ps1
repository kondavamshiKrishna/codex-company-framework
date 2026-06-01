param(
    [string]$CodexHome = "$env:USERPROFILE\.codex"
)

$ErrorActionPreference = "Stop"

$SkillNames = @(
    "codex-owner-operator",
    "codex-company-creator"
)

foreach ($SkillName in $SkillNames) {
    $Target = Join-Path $CodexHome "skills\$SkillName"
    if (Test-Path -LiteralPath $Target) {
        Remove-Item -LiteralPath $Target -Recurse -Force
        Write-Host "Removed skill: $SkillName"
    }
}

Write-Host "Uninstall complete. Owner memory and agent memory were not removed."

