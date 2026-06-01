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
  npx codex-company-framework init-company
  npx codex-company-framework init-company --project . --name "My App" --yes
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
  if (isWindows() && fs.existsSync("V:\\")) {
    return "V:\\Codex\\Companies";
  }
  return path.join(os.homedir(), "CodexCompanies");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
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
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
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

function installSkills(codexHome) {
  const skillsRoot = path.join(codexHome, "skills");
  ensureDir(skillsRoot);
  for (const skill of ["codex-owner-operator", "codex-company-creator"]) {
    copyDir(path.join(repoRoot, "skills", skill), path.join(skillsRoot, skill));
  }
}

async function setup() {
  const yes = hasFlag("yes");
  if (yes) {
    const codexHome = getOption("codex-home", defaultCodexHome());
    const ownerMemoryRoot = getOption("owner-memory-root", path.join(codexHome, "owner_memory"));
    const agentMemoryRoot = getOption("agent-memory-root", path.join(codexHome, "agent_memory"));
    const companyRoot = getOption("company-root", defaultCompanyRoot());
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
    return;
  }

  const rl = rlInterface();
  try {
    const codexHome = await ask(rl, "Codex home", defaultCodexHome());
    const ownerMemoryRoot = await ask(rl, "Owner memory root", path.join(codexHome, "owner_memory"));
    const agentMemoryRoot = await ask(rl, "Agent memory root", path.join(codexHome, "agent_memory"));
    const companyRoot = await ask(rl, "External company/project memory root", defaultCompanyRoot());
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
    console.log("\nOpen a new Codex chat and use:");
    printCompanyPrompt();
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
description: Use for ${companyName} project work, company memory, worker coordination, project-specific reports, owner review, and runtime-aware audits. Trigger when the user mentions ${companyName}, ${companyId}, this company, or asks to continue this company's workflow.
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
  display_name: "${companyName} Company"
  short_description: "Coordinates ${companyName} workers."
  default_prompt: "Use the codex-owner-operator skill. Use the ${skillName} skill. Act as Owner for ${companyName}. Read current company memory and continue from the current next task."
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
  const entry = `
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
`;
  fs.appendFileSync(file, entry, "utf8");
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
    return createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers });
  }

  const rl = rlInterface();
  try {
    const codexHome = await ask(rl, "Codex home", defaultCodexHome());
    const config = readFrameworkConfig(codexHome) || {
      codexHome,
      ownerMemoryRoot: path.join(codexHome, "owner_memory"),
      agentMemoryRoot: path.join(codexHome, "agent_memory"),
      companyRoot: defaultCompanyRoot(),
      workerDocumentsRoot: defaultCompanyRoot(),
    };

    const projectPath = await ask(rl, "Project folder to turn into a company", process.cwd());
    const defaultName = titleCase(path.basename(path.resolve(projectPath))) || "New Project";
    const companyName = await ask(rl, "Company name", defaultName);
    const companyId = await ask(rl, "Company ID", slugify(companyName));
    const companyRoot = await ask(rl, "Company memory/report root", path.join(config.companyRoot, companyId));
    const defaultWorkers = "product-manager,backend-engineer,frontend-engineer,qa-test-engineer,documentation-writer,independent-validation-agent";
    const workerAnswer = await ask(rl, "Worker roles, comma separated", defaultWorkers);
    const workers = workerAnswer.split(",").map((w) => slugify(w)).filter(Boolean);

    createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers });
  } finally {
    rl.close();
  }
}

function createCompany({ codexHome, config, projectPath, companyName, companyId, companyRoot, workers }) {
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
  writeFile(promptFile, `# Owner Activation Prompt

\`\`\`text
Use the codex-owner-operator skill.
Use the ${skillName} skill.

Act as Owner for ${companyName}. Read current company memory and continue from the current next task.
\`\`\`
`);

  console.log("\nCompany created.");
  console.log(`Company root: ${companyRoot}`);
  console.log(`Company skill: ${skillName}`);
  console.log(`Owner prompt: ${promptFile}`);
  console.log("\nOpen a new Codex chat and use:");
  console.log(`Use the codex-owner-operator skill.
Use the ${skillName} skill.

Act as Owner for ${companyName}. Read current company memory and continue from the current next task.`);
  return { companyRoot, skillName };
}

function doctor() {
  const codexHome = defaultCodexHome();
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
  console.log(`Use the codex-owner-operator skill.

Act as Owner and my AI partner. Check whether this project already has a
company. If not, ask me for the project folder and prepare the first prompt for
the Company Creator. Verify evidence before claims and tell me the next task.`);
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
  console.log(`Use the codex-company-creator skill.

You are Company Creator for a new Codex company.
Project path:
${project}

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

Do not create files yet.`);
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
