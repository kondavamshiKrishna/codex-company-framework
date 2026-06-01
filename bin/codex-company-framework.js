#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");

const repoRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const command = args[0] || "help";

function usage() {
  console.log(`Codex Company Framework

Usage:
  ccf setup                 Install global Owner and Company Creator skills
  ccf init-company          Create a project-specific company workspace
  ccf doctor                Verify framework installation
  ccf owner-prompt          Print the standard Owner activation prompt
  ccf company-prompt        Print the standard Company Creator prompt
  ccf creator-discovery     Print a Company Creator discovery prompt
  ccf help                  Show this help

Examples:
  npx codex-company-framework setup
  npx codex-company-framework setup --yes
  npx codex-company-framework setup --yes --drive E
  npx codex-company-framework init-company
  npx codex-company-framework init-company --project . --name "My App" --yes
  npx codex-company-framework init-company --project . --name "My App" --yes --force
  ccf doctor --codex-home "%USERPROFILE%\\.codex"
  ccf doctor
`);
}

function isWindows() {
  return process.platform === "win32";
}

function defaultCodexHome() {
  if (process.env.CODEX_HOME) {
    return process.env.CODEX_HOME;
  }
  return path.join(os.homedir(), ".codex");
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function getOption(name, defaultValue = "") {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const exactIndex = args.indexOf(exact);
  if (exactIndex >= 0 && args[exactIndex + 1]) {
    return args[exactIndex + 1];
  }
  const prefixed = args.find((arg) => arg.startsWith(prefix));
  if (prefixed) {
    return prefixed.slice(prefix.length);
  }
  return defaultValue;
}

function defaultCompanyRoot() {
  if (isWindows()) {
    const drive = recommendedExternalDrive();
    return drive ? companyRootForDrive(drive) : path.join(os.homedir(), "CodexCompanies");
  }
  return path.join(os.homedir(), "CodexCompanies");
}

function detectWindowsDrives() {
  if (!isWindows()) {
    return [];
  }
  const drives = [];
  for (let code = 65; code <= 90; code += 1) {
    const letter = String.fromCharCode(code);
    const root = `${letter}:\\`;
    try {
      if (fs.existsSync(root)) {
        drives.push({ letter, root });
      }
    } catch (_) {
      // Ignore drives that exist but cannot be accessed by the current user.
    }
  }
  return drives;
}

function recommendedExternalDrive() {
  const drives = externalMemoryDriveChoices();
  return drives[0] ? drives[0].letter : "";
}

function externalMemoryDriveChoices() {
  const drives = detectWindowsDrives();
  const nonSystem = drives.filter((d) => d.letter !== "C");
  return nonSystem.length > 0 ? nonSystem : [];
}

function normalizeDriveLetter(value) {
  const match = String(value || "").trim().match(/^([a-zA-Z])[:\\/]?$/);
  return match ? match[1].toUpperCase() : "";
}

function companyRootForDrive(letter) {
  return `${letter.toUpperCase()}:\\Codex\\Companies`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function directoryHasEntries(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory() && fs.readdirSync(dir).length > 0;
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source directory: ${src}`);
  }
  fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(src, dst, { recursive: true });
}

function writeIfMissing(file, content) {
  if (!fs.existsSync(file)) {
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, content, "utf8");
  }
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function rlInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, question, defaultValue) {
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  return new Promise((resolve) => {
    let settled = false;
    const onClose = () => {
      if (!settled) {
        settled = true;
        resolve(defaultValue || "");
      }
    };
    rl.once("close", onClose);
    rl.question(prompt, (answer) => {
      if (settled) return;
      settled = true;
      rl.removeListener("close", onClose);
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function explain(title, lines) {
  console.log("");
  console.log(title);
  for (const line of lines) {
    console.log(`  ${line}`);
  }
}

async function askExternalCompanyRoot(rl) {
  if (!isWindows()) {
    explain("External company/project memory root", [
      "This is where company-level documents, handoff memory, prompts, reports, and worker output are stored.",
      "Choose a folder with enough space and easy backup.",
    ]);
    return ask(rl, "External company/project memory root", defaultCompanyRoot());
  }

  const drives = externalMemoryDriveChoices();
  const recommended = recommendedExternalDrive();

  explain("External memory drive", [
    "This drive will store company documents, Owner project memory, worker reports, prompts, and evidence.",
    "The installer will create a Codex\\Companies folder on the selected drive.",
    "The system drive is not offered for external memory when another drive is available.",
    "Internal Codex skills and agent memory still stay under your normal Codex home unless you use --advanced.",
  ]);

  if (drives.length === 0) {
    return ask(rl, "No non-system external drives were auto-detected. Enter external company/project memory root", defaultCompanyRoot());
  }

  console.log("");
  console.log("Detected drives:");
  drives.forEach((drive, index) => {
    const note = drive.letter === recommended ? " (recommended)" : "";
    console.log(`  ${index + 1}. ${drive.root}${note}`);
  });
  console.log("  Or type a full custom path, for example <drive>:\\Codex\\Companies");

  const defaultIndex = Math.max(1, drives.findIndex((d) => d.letter === recommended) + 1);
  const answer = await ask(rl, "Which drive should be used for external company memory? Enter number, drive letter, or full custom path", String(defaultIndex));
  const trimmed = String(answer || "").trim();
  const numeric = Number(trimmed);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= drives.length) {
    return companyRootForDrive(drives[numeric - 1].letter);
  }
  const letter = normalizeDriveLetter(trimmed);
  if (letter) {
    if (letter === "C" && drives.length > 0) {
      console.log("C:\\ is the system drive and was skipped for external memory. Using the recommended non-system drive instead.");
      return companyRootForDrive(recommended);
    }
    return companyRootForDrive(letter);
  }
  return trimmed || defaultCompanyRoot();
}

function companyRootFromDriveOption() {
  const drive = normalizeDriveLetter(getOption("drive", ""));
  if (drive === "C" && recommendedExternalDrive()) {
    throw new Error("C: is the system drive. Choose a non-system drive with --drive, or pass an explicit --company-root.");
  }
  return drive ? companyRootForDrive(drive) : "";
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function escapeYamlDoubleQuoted(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ");
}

function yamlDoubleQuote(value) {
  return `"${escapeYamlDoubleQuoted(value)}"`;
}

function frameworkConfigPath(codexHome) {
  return path.join(codexHome, "codex-company-framework.yaml");
}

function writeFrameworkConfig(config) {
  const content = `# Codex Company Framework config
version: "1"
codex_home: ${yamlQuote(config.codexHome)}
owner_memory_root: ${yamlQuote(config.ownerMemoryRoot)}
agent_memory_root: ${yamlQuote(config.agentMemoryRoot)}
company_root: ${yamlQuote(config.companyRoot)}
worker_documents_root: ${yamlQuote(config.workerDocumentsRoot)}
default_owner_skill: "codex-owner-operator"
default_company_creator_skill: "codex-company-creator"
`;
  writeFile(frameworkConfigPath(config.codexHome), content);
}

function readFrameworkConfig(codexHome) {
  const file = frameworkConfigPath(codexHome);
  if (!fs.existsSync(file)) {
    return null;
  }
  const config = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch (_) {
        value = value.slice(1, -1);
      }
    }
    config[key] = value;
  }
  return {
    codexHome: config.codex_home || codexHome,
    ownerMemoryRoot: config.owner_memory_root || path.join(codexHome, "owner_memory"),
    agentMemoryRoot: config.agent_memory_root || path.join(codexHome, "agent_memory"),
    companyRoot: config.company_root || defaultCompanyRoot(),
    workerDocumentsRoot: config.worker_documents_root || config.company_root || defaultCompanyRoot(),
  };
}

function ownerProtocol() {
  return `# Owner Operating Protocol

The Owner is the permanent operating layer across projects.

Core behavior:
- treat the user as the human partner and co-owner;
- inspect real files/runtime before making operational claims;
- treat worker output as draft evidence;
- verify numbers, routes, and artifacts independently;
- separate facts, assumptions, unsupported claims, decisions, and next tasks;
- protect project boundaries and avoid wrong database/runtime usage;
- update memory only with durable, useful state.

Standard new-chat activation:

\`\`\`text
Use the codex-owner-operator skill.
Use the <company-skill-name> skill.

Act as Owner for <company name>. Read current company memory and continue from
the current next task.
\`\`\`
`;
}

function currentCompaniesHeader() {
  return `# Current Companies

This file is updated by Codex Company Framework when a new company is created.
`;
}

function ownerFirstPrompt() {
  return `Use the codex-owner-operator skill.

Act as Owner and my AI partner. I am opening this project in Codex IDE.

First read the framework config if it exists:
%USERPROFILE%\\.codex\\codex-company-framework.yaml

Use that config to know the selected external company memory root, worker
documents/report root, Owner memory root, and agent memory root.

First, check whether this project already has a company. If it does, tell me
which company skill to use and continue from its current memory.

If it does not have a company yet, ask me for the project folder if needed,
then prepare the first discovery prompt that I should paste into a separate
Company Creator chat.

Do not create files yet. Start by orienting me and telling me the next step.`;
}

function companyCreatorDiscoveryPrompt(projectPath = "<project path>") {
  return `Use the codex-company-creator skill.

You are Company Creator for a new Codex company.
Read framework config if it exists:
%USERPROFILE%\\.codex\\codex-company-framework.yaml

Use the configured company_root and worker_documents_root. Do not assume a
specific drive letter.

Project path:
${projectPath}

Owner request:
Design the company structure for this project.

Phase:
discovery only

Inspect the project and return:
- company name and company ID;
- project type and runtime;
- risks and protected routes;
- proposed worker roles;
- memory/report layout;
- missing questions;
- recommended next phase.

Do not create files yet.`;
}

function printSetupNextSteps(codexHome, companyRoot) {
  const promptFile = path.join(codexHome, "owner_memory", "FIRST_OWNER_PROMPT.md");
  const creatorPromptFile = path.join(codexHome, "owner_memory", "COMPANY_CREATOR_DISCOVERY_PROMPT_TEMPLATE.md");
  writeFile(promptFile, `# First Owner Prompt

\`\`\`text
${ownerFirstPrompt()}
\`\`\`
`);
  writeFile(creatorPromptFile, `# Company Creator Discovery Prompt Template

\`\`\`text
${companyCreatorDiscoveryPrompt()}
\`\`\`
`);

  console.log("\nWhat to do next");
  console.log("1. Open Codex IDE.");
  console.log("2. Open the project folder you want to work on.");
  console.log("3. Start a new chat and paste this first Owner prompt:");
  console.log("");
  console.log(ownerFirstPrompt());
  console.log("");
  console.log("The Owner will act as your AI partner. If the project has no company yet,");
  console.log("the Owner will give you a Company Creator prompt to paste into another chat.");
  console.log("");
  console.log("Saved prompt files:");
  console.log(`  Owner prompt:           ${promptFile}`);
  console.log(`  Company Creator prompt: ${creatorPromptFile}`);
  console.log(`  Company root:           ${companyRoot}`);
}

function installSkills(codexHome) {
  const skillsRoot = path.join(codexHome, "skills");
  ensureDir(skillsRoot);
  for (const skill of ["codex-owner-operator", "codex-company-creator"]) {
    copyDir(path.join(repoRoot, "skills", skill), path.join(skillsRoot, skill));
  }
}

async function setup() {
  const yes = hasFlag("yes");
  const advanced = hasFlag("advanced");
  if (yes) {
    const codexHome = getOption("codex-home", defaultCodexHome());
    const ownerMemoryRoot = getOption("owner-memory-root", path.join(codexHome, "owner_memory"));
    const agentMemoryRoot = getOption("agent-memory-root", path.join(codexHome, "agent_memory"));
    const companyRoot = getOption("company-root", companyRootFromDriveOption() || defaultCompanyRoot());
    const workerDocumentsRoot = getOption("worker-documents-root", companyRoot);

    ensureDir(codexHome);
    ensureDir(ownerMemoryRoot);
    ensureDir(agentMemoryRoot);
    ensureDir(companyRoot);
    ensureDir(workerDocumentsRoot);
    installSkills(codexHome);
    writeIfMissing(path.join(ownerMemoryRoot, "OWNER_OPERATING_PROTOCOL.md"), ownerProtocol());
    writeIfMissing(path.join(ownerMemoryRoot, "CURRENT_COMPANIES.md"), currentCompaniesHeader());
    writeFrameworkConfig({ codexHome, ownerMemoryRoot, agentMemoryRoot, companyRoot, workerDocumentsRoot });

    console.log("Setup complete.");
    console.log(`Config: ${frameworkConfigPath(codexHome)}`);
    printSetupNextSteps(codexHome, companyRoot);
    return;
  }

  const rl = rlInterface();
  try {
    const defaultHome = defaultCodexHome();
    const codexHome = advanced ? await ask(rl, "Codex home", defaultHome) : defaultHome;
    const ownerMemoryRoot = advanced
      ? await ask(rl, "Owner memory root", path.join(codexHome, "owner_memory"))
      : path.join(codexHome, "owner_memory");
    const agentMemoryRoot = advanced
      ? await ask(rl, "Agent memory root", path.join(codexHome, "agent_memory"))
      : path.join(codexHome, "agent_memory");

    console.log("\nInternal Codex paths will use defaults:");
    console.log(`  Codex home:        ${codexHome}`);
    console.log(`  Owner memory:      ${ownerMemoryRoot}`);
    console.log(`  Agent memory:      ${agentMemoryRoot}`);
    console.log("  Use --advanced only if you intentionally want to change these.");

    const companyRoot = await askExternalCompanyRoot(rl);

    explain("Worker documents/reports root", [
      "This is where worker-generated reports, evidence, drafts, and final documents are stored.",
      "For most users this should be the same as the company memory root.",
      "Choose a different path only if you want reports on another drive.",
    ]);
    const workerDocumentsRoot = await ask(rl, "Worker documents/reports root", companyRoot);

    ensureDir(codexHome);
    ensureDir(ownerMemoryRoot);
    ensureDir(agentMemoryRoot);
    ensureDir(companyRoot);
    ensureDir(workerDocumentsRoot);
    installSkills(codexHome);

    writeIfMissing(path.join(ownerMemoryRoot, "OWNER_OPERATING_PROTOCOL.md"), ownerProtocol());
    writeIfMissing(path.join(ownerMemoryRoot, "CURRENT_COMPANIES.md"), currentCompaniesHeader());
    writeFrameworkConfig({ codexHome, ownerMemoryRoot, agentMemoryRoot, companyRoot, workerDocumentsRoot });

    console.log("\nSetup complete.");
    console.log(`Config: ${frameworkConfigPath(codexHome)}`);
    console.log(`Owner memory: ${ownerMemoryRoot}`);
    console.log(`Company root: ${companyRoot}`);
    printSetupNextSteps(codexHome, companyRoot);
  } finally {
    rl.close();
  }
}

function createCompanySkill({ codexHome, companyId, companyName, companyRoot, projectPath, workers }) {
  const skillName = `${companyId}-company`;
  const skillRoot = path.join(codexHome, "skills", skillName);
  const workerList = workers.map((w) => `- ${w}`).join("\n");
  const skillBody = `---
name: ${skillName}
description: ${yamlDoubleQuote(`Use for ${companyName} project work, company memory, worker coordination, project-specific reports, owner review, and runtime-aware audits. Trigger when the user mentions ${companyName}, ${companyId}, this company, or asks to continue this company's workflow.`)}
---

# ${companyName} Company

Project path:

\`\`\`text
${projectPath}
\`\`\`

Company root:

\`\`\`text
${companyRoot}
\`\`\`

## Startup

1. Read \`memory/CURRENT_STATE.md\`.
2. Confirm the project path exists.
3. Inspect real files/runtime before claims.
4. Use workers only when useful.
5. Write reports under this company root.

## Workers

${workerList}

Each worker must return evidence checked, findings, assumptions, unsupported
claims, recommended next task, and memory-update notes.

## Owner Review

Treat worker output as draft evidence. Verify critical claims before accepting.
`;
  const openaiYaml = `interface:
  display_name: ${yamlDoubleQuote(`${companyName} Company`)}
  short_description: ${yamlDoubleQuote(`Coordinates ${companyName} workers.`)}
  default_prompt: ${yamlDoubleQuote(`Use the codex-owner-operator skill. Use the ${skillName} skill. Act as Owner for ${companyName}. Read current company memory and continue from the current next task.`)}
`;
  writeFile(path.join(skillRoot, "SKILL.md"), skillBody);
  writeFile(path.join(skillRoot, "agents", "openai.yaml"), openaiYaml);
  return skillName;
}

function copyCompanyTemplates(companyRoot) {
  const templateRoot = path.join(repoRoot, "templates", "company");
  fs.cpSync(templateRoot, companyRoot, { recursive: true, force: true });
  for (const dir of [
    "reports/owner_review",
    "reports/cross_agent",
    "reports/final",
    "reports/archive",
    "prompts",
    "company_skill",
    "installer",
  ]) {
    ensureDir(path.join(companyRoot, dir));
  }
}

function writeCompanyMemory({ companyRoot, companyName, companyId, projectPath, skillName, workers }) {
  writeFile(
    path.join(companyRoot, "memory", "CURRENT_STATE.md"),
    `# Current State

Company: ${companyName}
Company ID: ${companyId}
Project: ${projectPath}
Company skill: ${skillName}
Last updated: ${new Date().toISOString()}

## Current Goal

Inspect the project, validate the company setup, and define the first useful task.

## Active Workers

${workers.map((w) => `- ${w}`).join("\n")}

## Current Next Task

Run the company smoke test, then ask the Owner to decide the first project task.
`
  );
  writeFile(
    path.join(companyRoot, "memory", "ARCHITECTURE.md"),
    `# Company Architecture

## Project Identity

- Company: ${companyName}
- Company ID: ${companyId}
- Project path: ${projectPath}
- Company skill: ${skillName}

## Worker Roles

${workers.map((w) => `- ${w}`).join("\n")}

## Memory Layout

- Company memory: ${path.join(companyRoot, "memory")}
- Reports: ${path.join(companyRoot, "reports")}
- Agent workspaces: ${path.join(companyRoot, "agents")}
`
  );
}

function appendCurrentCompany(ownerMemoryRoot, details) {
  const file = path.join(ownerMemoryRoot, "CURRENT_COMPANIES.md");
  writeIfMissing(file, currentCompaniesHeader());
  const startMarker = `<!-- ccf-company:start ${details.companyId} -->`;
  const endMarker = `<!-- ccf-company:end ${details.companyId} -->`;
  const entry = `
${startMarker}
## ${details.companyName}

Company ID:

\`\`\`text
${details.companyId}
\`\`\`

Company skill:

\`\`\`text
${details.skillName}
\`\`\`

Project path:

\`\`\`text
${details.projectPath}
\`\`\`

Company memory:

\`\`\`text
${path.join(details.companyRoot, "memory")}
\`\`\`

Workers:
${details.workers.map((w) => `- ${w}`).join("\n")}

Activation:

\`\`\`text
Use the codex-owner-operator skill.
Use the ${details.skillName} skill.

Act as Owner for ${details.companyName}. Read current company memory and continue from the current next task.
\`\`\`
${endMarker}
`;
  const current = fs.readFileSync(file, "utf8");
  const escapedStart = startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existingBlock = new RegExp(`\\n?${escapedStart}[\\s\\S]*?${escapedEnd}\\n?`, "g");
  const next = current.replace(existingBlock, "").replace(/\s+$/u, "");
  fs.writeFileSync(file, `${next}\n${entry}`, "utf8");
}

async function initCompany() {
  const yes = hasFlag("yes");
  if (yes) {
    const codexHome = getOption("codex-home", defaultCodexHome());
    const config = readFrameworkConfig(codexHome) || {
      codexHome,
      ownerMemoryRoot: path.join(codexHome, "owner_memory"),
      agentMemoryRoot: path.join(codexHome, "agent_memory"),
      companyRoot: defaultCompanyRoot(),
      workerDocumentsRoot: defaultCompanyRoot(),
    };
    const projectPath = getOption("project", process.cwd());
    const companyName = getOption("name", titleCase(path.basename(path.resolve(projectPath))) || "New Project");
    const companyId = getOption("id", slugify(companyName));
    const companyRoot = getOption("company-root", path.join(config.companyRoot, companyId));
    const workerAnswer = getOption("workers", "product-manager,backend-engineer,frontend-engineer,qa-test-engineer,documentation-writer,independent-validation-agent");
    const workers = workerAnswer.split(",").map((w) => slugify(w)).filter(Boolean);
    return createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers, force: hasFlag("force") });
  }

  const rl = rlInterface();
  try {
    const codexHome = hasFlag("advanced") ? await ask(rl, "Codex home", defaultCodexHome()) : defaultCodexHome();
    const config = readFrameworkConfig(codexHome) || {
      codexHome,
      ownerMemoryRoot: path.join(codexHome, "owner_memory"),
      agentMemoryRoot: path.join(codexHome, "agent_memory"),
      companyRoot: defaultCompanyRoot(),
      workerDocumentsRoot: defaultCompanyRoot(),
    };

    console.log("\nUsing framework config:");
    console.log(`  Codex home:     ${codexHome}`);
    console.log(`  Company root:   ${config.companyRoot}`);
    console.log(`  Agent memory:   ${config.agentMemoryRoot}`);
    console.log("  Use --advanced only if you intentionally want a different Codex home.");

    explain("Project folder to turn into a company", [
      "This is the real app/repo folder the Company Creator will inspect.",
      "Example: <drive>:\\Projects\\MyApp",
    ]);
    const projectPath = await ask(rl, "Project folder to turn into a company", process.cwd());
    const defaultName = titleCase(path.basename(path.resolve(projectPath))) || "New Project";
    explain("Company name", [
      "This is the human-readable name the Owner will use for this project.",
      "Example: Video Editor V2, Trading Advisor, CRM Dashboard.",
    ]);
    const companyName = await ask(rl, "Company name", defaultName);
    explain("Company ID", [
      "This is the safe folder/skill prefix for the company.",
      "Use lowercase words with hyphens. The default is usually correct.",
    ]);
    const companyId = await ask(rl, "Company ID", slugify(companyName));
    explain("Company memory/report root", [
      "This is where this company's memory, reports, prompts, and worker output folders are created.",
      "It should normally be inside the external company root chosen during setup.",
    ]);
    const companyRoot = await ask(rl, "Company memory/report root", path.join(config.companyRoot, companyId));
    const defaultWorkers = "product-manager,backend-engineer,frontend-engineer,qa-test-engineer,documentation-writer,independent-validation-agent";
    explain("Worker roles", [
      "These are the specialist roles this company starts with.",
      "You can add domain-specific roles, for example media-pipeline-engineer for VideoNut.",
      "Separate roles with commas.",
    ]);
    const workerAnswer = await ask(rl, "Worker roles, comma separated", defaultWorkers);
    const workers = workerAnswer.split(",").map((w) => slugify(w)).filter(Boolean);

    createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers, force: hasFlag("force") });
  } finally {
    rl.close();
  }
}

function createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers, force = false }) {
  if (directoryHasEntries(companyRoot) && !force) {
    throw new Error(`Company root already exists and is not empty: ${companyRoot}. Use --force only when you intentionally want to regenerate framework files for this company.`);
  }
  ensureDir(companyRoot);
  copyCompanyTemplates(companyRoot);
  for (const worker of workers) {
    ensureDir(path.join(companyRoot, "agents", worker, "reports"));
    ensureDir(path.join(companyRoot, "agents", worker, "evidence"));
    ensureDir(path.join(companyRoot, "agents", worker, "drafts"));
    ensureDir(path.join(companyRoot, "agents", worker, "handoff"));
    const memDir = path.join(config.agentMemoryRoot, companyId, worker);
    ensureDir(memDir);
    writeIfMissing(path.join(memDir, "MEMORY.md"), `# Worker Memory

Company: ${companyName}
Worker: ${worker}
Last updated: ${new Date().toISOString()}

## Durable Role Findings

## Repeated Validation Patterns

## Mistakes To Avoid

## Future Follow-Up Tasks
`);
  }

  const skillName = createCompanySkill({ codexHome, companyId, companyName, companyRoot, projectPath, workers });
  copyDir(path.join(codexHome, "skills", skillName), path.join(companyRoot, "company_skill", skillName));
  writeCompanyMemory({ companyRoot, companyName, companyId, projectPath, skillName, workers });
  appendCurrentCompany(config.ownerMemoryRoot, { companyName, companyId, skillName, projectPath, companyRoot, workers });

  const promptFile = path.join(companyRoot, "prompts", "OWNER_ACTIVATION_PROMPT.md");
  const creatorPromptFile = path.join(companyRoot, "prompts", "COMPANY_CREATOR_DISCOVERY_PROMPT.md");
  writeFile(promptFile, `# Owner Activation Prompt

\`\`\`text
Use the codex-owner-operator skill.
Use the ${skillName} skill.

Act as Owner for ${companyName}. Read current company memory and continue from the current next task.
\`\`\`
`);
  writeFile(creatorPromptFile, `# Company Creator Discovery Prompt

\`\`\`text
${companyCreatorDiscoveryPrompt(projectPath)}
\`\`\`
`);

  console.log("\nCompany created.");
  console.log(`Company root: ${companyRoot}`);
  console.log(`Company skill: ${skillName}`);
  console.log(`Owner prompt: ${promptFile}`);
  console.log(`Company Creator discovery prompt: ${creatorPromptFile}`);
  console.log("\nWhat to do next");
  console.log("1. Open Codex IDE.");
  console.log(`2. Open this project folder: ${projectPath}`);
  console.log("3. Start a new Owner chat and paste this:");
  console.log("");
  console.log(`Use the codex-owner-operator skill.
Use the ${skillName} skill.

Act as Owner for ${companyName}. Read current company memory and continue from the current next task.`);
  console.log("");
  console.log("4. If the Owner asks for worker/company output, open the requested worker or");
  console.log("   Company Creator chat, paste the Owner's prompt there, then copy the result");
  console.log("   back to the Owner for review.");
  return { companyRoot, skillName };
}

function doctor() {
  const codexHome = getOption("codex-home", defaultCodexHome());
  const checks = [
    ["Codex home", codexHome],
    ["Owner skill", path.join(codexHome, "skills", "codex-owner-operator", "SKILL.md")],
    ["Company Creator skill", path.join(codexHome, "skills", "codex-company-creator", "SKILL.md")],
    ["Owner memory", path.join(codexHome, "owner_memory")],
    ["Agent memory", path.join(codexHome, "agent_memory")],
    ["Framework config", frameworkConfigPath(codexHome)],
  ];
  let ok = true;
  for (const [label, target] of checks) {
    const exists = fs.existsSync(target);
    ok = ok && exists;
    console.log(`${exists ? "PASS" : "FAIL"} ${label}: ${target}`);
  }
  process.exitCode = ok ? 0 : 1;
}

function printOwnerPrompt() {
  console.log(ownerFirstPrompt());
}

function printCompanyPrompt() {
  console.log(`Use the codex-owner-operator skill.
Use the codex-company-creator skill.

Create a new Codex company for:
<project path>

Inspect first. Then propose workers, memory layout, report layout, activation
prompts, and smoke tests.`);
}

function printCreatorDiscoveryPrompt() {
  const project = getOption("project", "<project path>");
  console.log(companyCreatorDiscoveryPrompt(project));
}

(async () => {
  try {
    if (command === "setup") await setup();
    else if (command === "init-company") await initCompany();
    else if (command === "doctor") doctor();
    else if (command === "owner-prompt") printOwnerPrompt();
    else if (command === "company-prompt") printCompanyPrompt();
    else if (command === "creator-discovery") printCreatorDiscoveryPrompt();
    else usage();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
})();
