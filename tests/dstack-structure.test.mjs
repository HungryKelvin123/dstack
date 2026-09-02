import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");

async function filesUnder(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesUnder(target));
    else output.push(target);
  }
  return output;
}

test("every skill is namespaced and internally consistent", async () => {
  const directories = (await fs.readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());
  const names = new Set(directories.map((entry) => entry.name));

  for (const entry of directories) {
    assert.match(entry.name, /-dstack$/);
    const skill = await fs.readFile(path.join(skillsRoot, entry.name, "SKILL.md"), "utf8");
    assert.equal(skill.match(/^name:\s*(.+)$/m)?.[1], entry.name);

    const policyPath = path.join(skillsRoot, entry.name, "agents", "openai.yaml");
    const policy = await fs.readFile(policyPath, "utf8");
    const expected = entry.name === "unslop-dstack" ? "true" : "false";
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

test("DStack contains no active PStack or Poteto instructions", async () => {
  const files = [
    ...await filesUnder(skillsRoot),
    ...await filesUnder(path.join(root, "hooks")),
  ].filter((file) => /\.(?:md|json|mjs|yaml)$/i.test(file));
  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    assert.doesNotMatch(source, /pstack|poteto/i, file);
  }
});

test("Roblox Studio MCP is context-only and never used for playtesting", async () => {
  const contract = await fs.readFile(path.join(root, "references", "roblox-engineering.md"), "utf8");
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode-dstack", "SKILL.md"), "utf8");

  assert.match(contract, /Roblox Studio MCP is context-only/i);
  assert.match(contract, /Never invoke its playtesting controls/i);
  assert.match(contract, /The user performs Studio playtesting/i);
  assert.match(davidMode, /Never use Roblox Studio MCP playtest controls/i);
});

test("David Mode preflights Studio once and fails safely", async () => {
  const davidMode = await fs.readFile(path.join(skillsRoot, "david-mode-dstack", "SKILL.md"), "utf8");

  assert.match(davidMode, /`list_roblox_studios`/i);
  assert.match(davidMode, /call it once/i);
  assert.match(davidMode, /continuing with repository-only context/i);
  assert.match(davidMode, /Do not retry during the same turn/i);
  assert.match(davidMode, /correctness depends on an unresolved Studio-only fact, stop/i);
  assert.match(davidMode, /Sticky turns reuse the result/i);
  assert.match(davidMode, /never starts, stops, or controls a playtest/i);
});
