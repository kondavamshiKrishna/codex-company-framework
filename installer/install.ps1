param(
    [string]$CodexHome = "",
    [string]$CompanyRoot = "",
    [string]$WorkerDocumentsRoot = "",
    [string]$Drive = "",
    [switch]$Yes
)

$ErrorActionPreference = "Stop"

$InstallerDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $InstallerDir
$Cli = Join-Path $RepoRoot "bin\codex-company-framework.js"

Write-Host "Codex Company Framework installer"
Write-Host "Repo: $RepoRoot"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is required. Install Node.js 18 or newer, then rerun this installer."
}

if (-not (Test-Path -LiteralPath $Cli)) {
    throw "Missing CLI entrypoint: $Cli"
}

$NodeArgs = @($Cli, "setup")

if ($Yes -or $CodexHome -or $CompanyRoot -or $WorkerDocumentsRoot -or $Drive) {
    $NodeArgs += "--yes"
}

if ($CodexHome) {
    $NodeArgs += @("--codex-home", $CodexHome)
}

if ($CompanyRoot) {
    $NodeArgs += @("--company-root", $CompanyRoot)
}

if ($WorkerDocumentsRoot) {
    $NodeArgs += @("--worker-documents-root", $WorkerDocumentsRoot)
}

if ($Drive) {
    $NodeArgs += @("--drive", $Drive)
}

& node @NodeArgs
exit $LASTEXITCODE
