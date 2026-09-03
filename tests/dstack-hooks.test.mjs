import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { classifyPrompt, handleHook } from "../plugins/dstack/hooks/scripts/david-mode-state.mjs";

function input(prompt) {
  return {
    hook_event_name: "UserPromptSubmit",
    session_id: "dstack-test-session",
    cwd: "C:/workspace/roblox-game",
    prompt,
  };
}

test("David Mode requires an explicit leading invocation", () => {
  assert.equal(classifyPrompt("$david-mode fix it"), "activate");
  assert.equal(classifyPrompt("/dstack:david-mode fix it"), "activate");
  assert.equal(classifyPrompt("mention $david-mode"), "inactive");
  assert.equal(classifyPrompt("disable $david-mode"), "disable");
  assert.equal(classifyPrompt("disable /dstack:david-mode"), "disable");
});

test("unslop is injected for every user prompt", async (t) => {
  const pluginData = await fs.mkdtemp(path.join(os.tmpdir(), "dstack-hooks-"));
  t.after(() => fs.rm(pluginData, { recursive: true, force: true }));

  const ordinary = await handleHook(input("inspect this module"), { pluginData, now: 1_000 });
  assert.match(ordinary.hookSpecificOutput.additionalContext, /\$unslop/);

  const activation = await handleHook(input("$david-mode inspect this module"), { pluginData, now: 2_000 });
  assert.match(activation.hookSpecificOutput.additionalContext, /\$david-mode/);
  assert.match(activation.hookSpecificOutput.additionalContext, /\$unslop/);

  const later = await handleHook(input("continue"), { pluginData, now: 3_000 });
  assert.match(later.hookSpecificOutput.additionalContext, /\$david-mode/);
  assert.match(later.hookSpecificOutput.additionalContext, /\$unslop/);

  const disabled = await handleHook(input("disable $david-mode"), { pluginData, now: 4_000 });
  assert.doesNotMatch(disabled.hookSpecificOutput.additionalContext, /\$david-mode/);
  assert.match(disabled.hookSpecificOutput.additionalContext, /\$unslop/);
});

test("Claude hooks use namespaced skills and keep startup guidance concise", async (t) => {
  const pluginData = await fs.mkdtemp(path.join(os.tmpdir(), "dstack-claude-hooks-"));
  t.after(() => fs.rm(pluginData, { recursive: true, force: true }));

  const startup = await handleHook({
    hook_event_name: "SessionStart",
    source: "startup",
    session_id: "dstack-claude-session",
    cwd: "C:/workspace/roblox-game",
  }, { pluginData, harness: "claude", now: 1_000 });
  assert.match(startup.hookSpecificOutput.additionalContext, /\/dstack:david-mode/);
  assert.match(startup.hookSpecificOutput.additionalContext, /\/dstack:unslop/);
  assert.match(startup.hookSpecificOutput.additionalContext, /never use.*playtest/i);

  const activation = await handleHook({
    hook_event_name: "UserPromptSubmit",
    session_id: "dstack-claude-session",
    cwd: "C:/workspace/roblox-game",
    prompt: "/dstack:david-mode inspect this module",
  }, { pluginData, harness: "claude", now: 2_000 });
  assert.match(activation.hookSpecificOutput.additionalContext, /\/dstack:david-mode/);
  assert.match(activation.hookSpecificOutput.additionalContext, /\/dstack:unslop/);
});
