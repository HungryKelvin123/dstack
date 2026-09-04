import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = path.join(root, "plugins", "dstack");
const skillsRoot = path.join(pluginRoot, "skills");

async function filesUnder(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesUnder(target));
    else output.push(target);
  }
  return output;
}

test("every skill name matches its folder and invocation policy", async () => {
  const directories = (await fs.readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());
  const names = new Set(directories.map((entry) => entry.name));

  for (const entry of directories) {
    const skill = await fs.readFile(path.join(skillsRoot, entry.name, "SKILL.md"), "utf8");
    assert.equal(skill.match(/^name:\s*(.+)$/m)?.[1], entry.name);

    const policyPath = path.join(skillsRoot, entry.name, "agents", "openai.yaml");
    const policy = await fs.readFile(policyPath, "utf8");
    const expected = entry.name === "unslop" ? "true" : "false";
    assert.match(policy, new RegExp(`allow_implicit_invocation: ${expected}`));
  }

  const markdownFiles = (await filesUnder(skillsRoot)).filter((file) => file.endsWith(".md"));
  for (const file of markdownFiles) {
    const source = await fs.readFile(file, "utf8");
    for (const match of source.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g)) {
      if (/^[a-z]+:/i.test(match[1])) continue;
      const target = path.resolve(path.dirname(file), match[1]);
      await assert.doesNotReject(fs.access(target), `${file} links to missing ${match[1]}`);
    }
    for (const match of source.matchAll(/\$([a-z0-9-]+)/g)) {
      assert.ok(names.has(match[1]), `${file} references missing skill ${match[1]}`);
    }
  }
});

test("repository uses one nested cross-client plugin with two marketplace surfaces", async () => {
  const codexMarketplace = JSON.parse(await fs.readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"));
  const claudeMarketplace = JSON.parse(await fs.readFile(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"));
  const codexManifest = JSON.parse(await fs.readFile(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"));
  const claudeManifest = JSON.parse(await fs.readFile(path.join(pluginRoot, ".claude-plugin", "plugin.json"), "utf8"));
  const claudeHooks = JSON.parse(await fs.readFile(path.join(pluginRoot, "hooks", "claude-hooks.json"), "utf8"));

  assert.equal(codexMarketplace.plugins[0].source.path, "./plugins/dstack");
  assert.equal(claudeMarketplace.plugins[0].source, "./plugins/dstack");
  assert.equal(codexMarketplace.plugins[0].name, "dstack");
  assert.equal(claudeMarketplace.plugins[0].name, "dstack");
  assert.equal(codexManifest.name, "dstack");
  assert.equal(claudeManifest.name, "dstack");
  assert.equal(codexManifest.version, claudeManifest.version);
  assert.equal(codexManifest.version, (await fs.readFile(path.join(root, "VERSION"), "utf8")).trim());
  assert.equal(claudeMarketplace.plugins[0].version, codexManifest.version);
  assert.match(codexManifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(claudeManifest.agents, undefined);
  const pluginFiles = await filesUnder(pluginRoot);
  assert.ok(!pluginFiles.some((file) => file.startsWith(path.join(pluginRoot, "agents") + path.sep)), "No alternate worker profiles may be auto-discovered");
  assert.equal(claudeManifest.hooks, "./hooks/claude-hooks.json");
  assert.equal(codexManifest.skills, "./skills/");
  assert.equal(claudeManifest.skills, "./skills/");
  assert.match(claudeHooks.hooks.SessionStart[0].hooks[0].command, /CLAUDE_PLUGIN_ROOT/);
  assert.match(claudeHooks.hooks.UserPromptSubmit[0].hooks[0].command, /david-mode-state\.mjs/);
});

test("Codex prompt shims cover the explicit skill surface", async () => {
  const directories = (await fs.readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("principle-"))
    .map((entry) => entry.name)
    .sort();
  const promptsRoot = path.join(pluginRoot, ".codex-plugin", "prompts");
  const prompts = (await fs.readdir(promptsRoot)).filter((file) => file.endsWith(".md")).map((file) => file.slice(0, -3)).sort();
  assert.deepEqual(prompts, directories);

  for (const name of prompts) {
    const prompt = await fs.readFile(path.join(promptsRoot, `${name}.md`), "utf8");
    assert.match(prompt, new RegExp(`^name: ${name}$`, "m"));
    assert.match(prompt, /disable-model-invocation: true/);
    assert.match(prompt, new RegExp("Invoke the `" + name + "` skill", "i"));
  }
});

test("DStack contains no active PStack or Poteto instructions", async () => {
  const files = [
    ...await filesUnder(skillsRoot),
    ...await filesUnder(path.join(pluginRoot, "hooks")),
  ].filter((file) => /\.(?:md|json|mjs|yaml)$/i.test(file));
  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    assert.doesNotMatch(source, /pstack|poteto/i, file);
  }
});

test("Roblox Studio MCP has a guarded write fallback and never playtests", async () => {
  const contract = await fs.readFile(path.join(pluginRoot, "references", "roblox-engineering.md"), "utf8");
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode", "SKILL.md"), "utf8");

  assert.match(contract, /Repository mode \(preferred\)/i);
  assert.match(contract, /Studio fallback mode/i);
  assert.match(contract, /all non-playtest MCP operations/i);
  assert.match(contract, /Inspect before mutating/i);
  assert.match(contract, /Full MCP fallback does not override/i);
  assert.match(contract, /never invokes its playtesting controls/i);
  assert.match(contract, /The user performs Studio playtesting/i);
  assert.match(davidMode, /Studio fallback mode permits scoped non-playtest MCP reads and writes/i);
  assert.match(davidMode, /Never use Roblox Studio MCP playtest controls/i);
});

test("Roblox Studio MCP setup distinguishes missing from closed and pauses for restart", async () => {
  const contract = await fs.readFile(path.join(pluginRoot, "references", "roblox-engineering.md"), "utf8");
  const setup = await fs.readFile(path.join(pluginRoot, "references", "roblox-mcp-setup.md"), "utf8");
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode", "SKILL.md"), "utf8");

  assert.match(contract, /roblox-mcp-setup\.md/i);
  assert.match(setup, /official Roblox Studio MCP connection guide/i);
  assert.match(setup, /Configured but not open/i);
  assert.match(setup, /Missing or unconfigured/i);
  assert.match(setup, /Do not infer installation failure from.*no connected Studio/i);
  assert.match(setup, /stop the current turn immediately after asking/i);
  assert.match(setup, /most accurate, most efficient.*highest-quality/i);
  assert.match(setup, /Reply \*\*yes\*\*/i);
  assert.match(setup, /\*\*no\*\* to continue without MCP/i);
  assert.match(setup, /Quick connect/i);
  assert.match(setup, /JSON configuration/i);
  assert.match(setup, /CLI command/i);
  assert.match(setup, /cmd\.exe \/c %LOCALAPPDATA%\\\\Roblox\\\\mcp\.bat/i);
  assert.match(setup, /StudioMCP/i);
  assert.match(setup, /restart the agent client\/Codex/i);
  assert.match(setup, /End the turn/i);
  assert.match(setup, /hard ban.*playtest/i);
  assert.match(davidMode, /stop this turn and ask/i);
  assert.match(davidMode, /successful.*setup.*ends the turn/i);
});

test("client worker metadata pins native routes without replacing the parent", async () => {
  const models = JSON.parse(await fs.readFile(path.join(pluginRoot, "models.json"), "utf8"));

  assert.equal(models.schemaVersion, 3);
  assert.equal(models.orchestrator.model, "user-selected-parent");
  assert.equal(models.orchestrator.reasoningEffort, "highest-supported");
  assert.deepEqual(models.orchestrator.owns, ["planning", "architecture", "difficult-implementation", "worker-review", "integration", "final-verification"]);
  assert.deepEqual(models.workers, {
    codex: { model: "gpt-5.6-luna", reasoningEffort: "max", fallback: "sequential-parent" },
    claude: { model: "haiku", effort: "max", fallback: "sequential-parent" },
  });
  assert.deepEqual(models.delegation, { defaultMaxConcurrentWorkers: 2, maxConcurrentWorkers: 3, maxWorkerRevisions: 1, allowNestedDelegation: false });
  assert.deepEqual(models.riskPolicy, { local: 1, crossModule: 2, securityDataMonetization: 3, critical: 4 });
  assert.equal(models.worker, undefined);
  assert.equal(models.claude, undefined);
  assert.equal(models.codex, undefined);
});

test("delegating workflows resolve one shared runtime and worker brief", async () => {
  const runtimePath = path.join(skillsRoot, "david-mode", "references", "agent-runtime.md");
  const linksFrom = async (file) => {
    const source = await fs.readFile(file, "utf8");
    return [...source.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g)]
      .filter((match) => !/^[a-z]+:/i.test(match[1]))
      .map((match) => path.resolve(path.dirname(file), match[1]));
  };
  for (const skill of ["david-mode", "architect", "arena", "swarm", "interrogate", "reflect", "show-me-your-work", "setup-dstack", "teach", "recall", "automate-me", "figure-it-out", "principle-guard-the-context-window", "principle-build-the-lever", "principle-make-operations-idempotent", "principle-never-block-on-the-human"]) {
    const links = await linksFrom(path.join(skillsRoot, skill, "SKILL.md"));
    assert.ok(links.includes(runtimePath), `${skill} must link the shared delegation contract`);
  }
  const runtimeLinks = await linksFrom(runtimePath);
  assert.ok(runtimeLinks.includes(path.join(pluginRoot, "models.json")));
  assert.ok(runtimeLinks.includes(path.join(skillsRoot, "david-mode", "references", "worker-brief.md")));
  const runtime = await fs.readFile(runtimePath, "utf8");
  assert.match(runtime, /workers\.codex/);
  assert.match(runtime, /workers\.claude/);
  assert.match(runtime, /native Agent\/subagent route/i);
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");
  assert.match(readme, /Claude Code subagents use .*native `haiku` route/i);
  const panelLinks = await linksFrom(path.join(skillsRoot, "interrogate", "references", "interrogate-panel.md"));
  assert.ok(panelLinks.includes(path.join(pluginRoot, "models.json")));
});

test("David Mode preflights Studio once and fails safely", async () => {
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode", "SKILL.md"), "utf8");

  assert.match(davidMode, /`list_roblox_studios`/i);
  assert.match(davidMode, /call it once/i);
  assert.match(davidMode, /continuing with repository-only context/i);
  assert.match(davidMode, /Do not retry during the same turn/i);
  assert.match(davidMode, /correctness depends on an unresolved Studio-only fact, stop/i);
  assert.match(davidMode, /Sticky turns reuse the result/i);
  assert.match(davidMode, /never starts, stops, or controls a playtest/i);
});

test("David Mode gates architecture by boundary depth", async () => {
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode", "SKILL.md"), "utf8");
  const featurePlaybook = await fs.readFile(path.join(skillsRoot, "david-mode", "playbooks", "feature.md"), "utf8");

  assert.match(davidMode, /two or more modules or services/i);
  assert.match(davidMode, /Skip it for a local edit with one clear owner/i);
  assert.match(featurePlaybook, /two or more modules or services/i);
  assert.match(featurePlaybook, /Skip it for a local change with one clear owner/i);
});

test("David Mode uses direct phases and evidence-based questions", async () => {
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode", "SKILL.md"), "utf8");

  assert.match(davidMode, /Start with a bounded workflow/i);
  for (const phase of ["Ground", "Route", "Shape", "Implement", "Verify", "Report"]) {
    assert.match(davidMode, new RegExp(`\\*\\*${phase}\\*\\*`, "i"));
  }
  assert.match(davidMode, /inspect or probe it instead of asking the user/i);
  assert.match(davidMode, /Stop and ask only for an unresolved decision/i);
  assert.match(davidMode, /playbooks\/prototype\.md.*disposable local experiment/i);
  assert.match(davidMode, /Do not claim runtime success/i);
});

test("Architect is rigorous without making arena mandatory", async () => {
  const architect = await fs.readFile(path.join(skillsRoot, "architect", "SKILL.md"), "utf8");
  const runnerPrompt = await fs.readFile(path.join(skillsRoot, "architect", "references", "runner-prompt.md"), "utf8");

  assert.match(architect, /Choose the depth/i);
  assert.match(architect, /caller's intended usage/i);
  assert.match(architect, /two or more modules or services/i);
  assert.match(architect, /Use `\$arena` only when/i);
  assert.match(architect, /Never run it for a Local change/i);
  assert.match(architect, /contract's Repository mode or Studio fallback mode/i);
  assert.match(architect, /user performs Studio playtesting/i);
  assert.match(architect, /Scrap when the architecture is wrong/i);
  assert.match(runnerPrompt, /Caller-facing Luau usage/i);
  assert.match(runnerPrompt, /Do not implement production code/i);
});
