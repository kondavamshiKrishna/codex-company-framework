param(
    [string]$CodexHome = "$env:USERPROFILE\.codex",
    [switch]$All,
    [switch]$Yes
)

$ErrorActionPreference = "Stop"

$InstallerDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $InstallerDir
$Cli = Join-Path $RepoRoot "bin\codex-company-framework.js"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is required to run the framework uninstall command."
}

if (-not (Test-Path -LiteralPath $Cli)) {
    throw "Missing CLI entrypoint: $Cli"
}

$NodeArgs = @($Cli, "uninstall", "--codex-home", $CodexHome)

if ($All) {
    $NodeArgs += "--all"
}

if ($Yes) {
    $NodeArgs += "--yes"
}

& node @NodeArgs
exit $LASTEXITCODE
