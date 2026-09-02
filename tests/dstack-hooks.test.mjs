import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { classifyPrompt, handleHook } from "../hooks/scripts/david-mode-state.mjs";

function input(prompt) {
  return {
    hook_event_name: "UserPromptSubmit",
    session_id: "dstack-test-session",
    cwd: "C:/workspace/roblox-game",
    prompt,
  };
}

test("David Mode requires an explicit leading invocation", () => {
  assert.equal(classifyPrompt("$david-mode-dstack fix it"), "activate");
  assert.equal(classifyPrompt("mention $david-mode-dstack"), "inactive");
  assert.equal(classifyPrompt("disable $david-mode-dstack"), "disable");
});

test("unslop-dstack is injected for every user prompt", async (t) => {
  const pluginData = await fs.mkdtemp(path.join(os.tmpdir(), "dstack-hooks-"));
  t.after(() => fs.rm(pluginData, { recursive: true, force: true }));

  const ordinary = await handleHook(input("inspect this module"), { pluginData, now: 1_000 });
  assert.match(ordinary.hookSpecificOutput.additionalContext, /\$unslop-dstack/);

  const activation = await handleHook(input("$david-mode-dstack inspect this module"), { pluginData, now: 2_000 });
  assert.match(activation.hookSpecificOutput.additionalContext, /\$david-mode-dstack/);
  assert.match(activation.hookSpecificOutput.additionalContext, /\$unslop-dstack/);

  const later = await handleHook(input("continue"), { pluginData, now: 3_000 });
  assert.match(later.hookSpecificOutput.additionalContext, /\$david-mode-dstack/);
  assert.match(later.hookSpecificOutput.additionalContext, /\$unslop-dstack/);

  const disabled = await handleHook(input("disable $david-mode-dstack"), { pluginData, now: 4_000 });
  assert.doesNotMatch(disabled.hookSpecificOutput.additionalContext, /\$david-mode-dstack/);
  assert.match(disabled.hookSpecificOutput.additionalContext, /\$unslop-dstack/);
});
