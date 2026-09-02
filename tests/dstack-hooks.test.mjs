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
  assert.equal(classifyPrompt("$david-mode fix it"), "activate");
  assert.equal(classifyPrompt("mention $david-mode"), "inactive");
  assert.equal(classifyPrompt("disable $david-mode"), "disable");
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
