# dstack

hey, i'm hungrykelvin123. i've been developing games for about two years now, and ever since ai became much more prominent in the community, i've wanted a faster, deeper, and more token-efficient way to write, debug, and ship code for roblox games.

that's when i found [pstack](https://github.com/cursor/plugins/tree/main/pstack), a cursor plugin with a bunch of skills designed by a highly skilled engineer to help agents write high-quality code. unfortunately, i don't use cursor, so i used [pstack ported to codex](https://github.com/Aqua-123/pstack-for-codex) instead.

this worked pretty well when i was designing the systems of my game, but one thing always nagged at me. because pstack was a generalized engineering plugin and wasn't made specifically for roblox, i found that my agents did much more than they needed to and wasted tokens. when it comes to verifying code inside roblox, i also absolutely **despise** when ai uses the roblox studio mcp server to playtest for me. it wastes a ton of tokens on minor fixes that i probably would've found myself.

that's why i created my own version, **dstack**. dstack is specifically made *for* roblox and expects you to have the roblox studio mcp server available. i do all of my scripting in visual studio code and sync it to my game with rojo, but i keep the mcp server open so my agent can inspect instances when the files alone aren't enough. dstack is most accurate and produces its highest-quality work when mcp is connected to an open roblox studio session. most importantly, dstack explicitly forbids the agent from using the mcp server to playtest the game, because that only produced useless results for me.

have fun coding!

## what dstack is

dstack is a plugin for Claude Code and Codex. it is not a model or a hosted service. it supplies one shared Roblox/Luau skill tree, focused playbooks, optional read-only reviewer agents, client-specific manifests, and guarded hooks.

the repository uses the same distribution shape as mature multi-client plugins:

```text
.
├── .agents/plugins/marketplace.json       # Codex marketplace
├── .claude-plugin/marketplace.json        # Claude Code marketplace
└── plugins/dstack/                        # the canonical plugin
    ├── .claude-plugin/plugin.json
    ├── .codex-plugin/plugin.json
    ├── .codex-plugin/prompts/             # explicit Codex prompt shims
    ├── agents/                            # Claude read-only reviewer lanes
    ├── hooks/                             # separate Claude and Codex hook configs
    ├── models.json                        # bounded reviewer recommendations
    ├── references/                        # shared Roblox contracts
    └── skills/                            # one shared skill tree
```

the two clients load the same `plugins/dstack/skills` files. only the manifest, prompt surface, hook schema, and subagent dispatch differ. client caches are implementation details: a path under `plugins/cache` is a versioned snapshot, not a stable skill path to paste into a prompt.

## install

install the marketplace that matches the client you use. you do not need both.

### Claude Code

Run these commands in Claude Code:

```text
/plugin marketplace add HungryKelvin123/dstack
/plugin install dstack@dstack
/reload-plugins
```

Claude exposes the skills as `/dstack:<skill>`. If you are developing from a checkout, test it without installing with:

```shell
claude --plugin-dir ./plugins/dstack
```

### Codex

Run these commands in a shell:

```shell
codex plugin marketplace add HungryKelvin123/dstack --ref main
codex plugin add dstack@dstack
```

Codex exposes the same skills by name. Start a new Codex task after installation or an update so the skill catalog is rebuilt. If you previously installed the old `dstack-local` marketplace, remove that entry and install the `dstack` entry once; do not keep two copies enabled.

### local validation

Before publishing a checkout, validate the two manifests and the Claude marketplace with the client tools available on your machine:

```shell
claude plugin validate ./plugins/dstack
codex plugin list --json
```

If a client is not installed, use the repository tests below; do not claim that client runtime loading was verified.

## setup

After installation, run the explicit setup skill once when you want client routing or reviewer lanes checked:

Claude Code:

```text
/dstack:setup-dstack
```

Codex:

```text
Use $setup-dstack to configure DStack for this client.
```

setup verifies the active client, the canonical skill tree, the automatic `unslop` rule, the Roblox Studio MCP state, and the optional reviewer panel. It does not edit your game. It does not write global instructions unless you approve a single bounded startup block. If MCP is missing or unconfigured, it follows the stop-and-ask flow in [the MCP setup reference](./plugins/dstack/references/roblox-mcp-setup.md); after configuration it ends the turn and directs you to restart the client.

## get started

use David Mode for a non-trivial Roblox task:

Claude Code:

```text
/dstack:david-mode Trace why this remote can award a reward twice, fix the root cause, and give me the exact Studio checks to run.
```

Codex:

```text
$david-mode Trace why this remote can award a reward twice, fix the root cause, and give me the exact Studio checks to run.
```

David Mode reads repository instructions and source first, chooses the smallest Roblox playbook, routes to focused skills only when needed, runs local checks such as `rojo build`, and reports what you must test in Studio. For a narrow request, invoke one focused skill directly instead of paying for the full router. `unslop` is the only automatically invoked skill; all other dstack skills are explicit.

## skills

| skill | use it for |
| --- | --- |
| [`david-mode`](./plugins/dstack/skills/david-mode/SKILL.md) | route a non-trivial Roblox task through a bounded workflow. |
| [`setup-dstack`](./plugins/dstack/skills/setup-dstack/SKILL.md) | configure and verify the client integration. |
| [`how`](./plugins/dstack/skills/how/SKILL.md) | trace a Roblox subsystem through modules, instances, remotes, replication, and persistence. |
| [`why`](./plugins/dstack/skills/why/SKILL.md) | recover why an implementation exists from code, history, and decisions. |
| [`recall`](./plugins/dstack/skills/recall/SKILL.md) | rebuild recent project context before resuming work. |
| [`architect`](./plugins/dstack/skills/architect/SKILL.md) | design ownership, typed Luau modules, remotes, and persistence boundaries. |
| [`blast-radius`](./plugins/dstack/skills/blast-radius/SKILL.md) | find what a change could break across the Roblox project. |
| [`luau-best-practices`](./plugins/dstack/skills/luau-best-practices/SKILL.md) | review or write maintainable typed Luau. |
| [`roblox-security`](./plugins/dstack/skills/roblox-security/SKILL.md) | review authority, remotes, purchases, rewards, RNG, persistence, and abuse cases. |
| [`roblox-performance`](./plugins/dstack/skills/roblox-performance/SKILL.md) | diagnose client, server, physics, rendering, replication, or memory performance. |
| [`roblox-data`](./plugins/dstack/skills/roblox-data/SKILL.md) | design safe persistence, schemas, session ownership, retries, and cross-server state. |
| [`roblox-networking`](./plugins/dstack/skills/roblox-networking/SKILL.md) | design remote protocols, replication, validation, and reliability. |
| [`roblox-monetization`](./plugins/dstack/skills/roblox-monetization/SKILL.md) | build retry-safe developer product, pass, and subscription flows. |
| [`roblox-ui`](./plugins/dstack/skills/roblox-ui/SKILL.md) | build responsive touch, keyboard, mouse, and gamepad interfaces. |
| [`roblox-physics`](./plugins/dstack/skills/roblox-physics/SKILL.md) | design assemblies, constraints, collision, hit detection, and network ownership. |
| [`arena`](./plugins/dstack/skills/arena/SKILL.md) | compare independent attempts at the same bounded problem. |
| [`swarm`](./plugins/dstack/skills/swarm/SKILL.md) | split independent implementation slices when the user requests parallel work. |
| [`interrogate`](./plugins/dstack/skills/interrogate/SKILL.md) | run a risk-budgeted adversarial review with independent read-only model lanes. |
| [`tdd`](./plugins/dstack/skills/tdd/SKILL.md) | write a cheap deterministic regression test before a fix. |
| [`no-comments`](./plugins/dstack/skills/no-comments/SKILL.md) | remove narrating comments while preserving real constraints. |
| [`create-verification-skill`](./plugins/dstack/skills/create-verification-skill/SKILL.md) | create a reusable verification skill for a Roblox repository. |
| [`maintain-verification-skill`](./plugins/dstack/skills/maintain-verification-skill/SKILL.md) | update a verification skill when the project changes. |
| [`show-me-your-work`](./plugins/dstack/skills/show-me-your-work/SKILL.md) | keep a reviewable decision log during long work. |
| [`figure-it-out`](./plugins/dstack/skills/figure-it-out/SKILL.md) | design a bounded playbook when none of the bundled ones fit. |
| [`teach`](./plugins/dstack/skills/teach/SKILL.md) | explain a system using implementation and history. |
| [`reflect`](./plugins/dstack/skills/reflect/SKILL.md) | capture lessons from a completed task in the skills themselves. |
| [`automate-me`](./plugins/dstack/skills/automate-me/SKILL.md) | turn a recurring working style into a personal mode skill. |
| [`technical-writing`](./plugins/dstack/skills/technical-writing/SKILL.md) | write or review technical documentation. |
| [`unslop`](./plugins/dstack/skills/unslop/SKILL.md) | remove AI tells and vague prose; this one runs automatically. |
| [`bro`](./plugins/dstack/skills/bro/SKILL.md) | restate a technical answer in plain language. |

David Mode also reads the small `principle-*` skills only when their rule fits the task. They are intentionally not user-facing defaults; see the complete list under [`plugins/dstack/skills`](./plugins/dstack/skills).

## Interrogate and model use

The old Interrogate wording implied a configured panel but did not guarantee that the client actually served different models. The current skill makes that distinction explicit:

- one reviewer for a local change;
- two for a cross-module change;
- three for security, saved data, monetization, consequential RNG, networking, or lifecycle boundaries;
- four only for a critical or explicitly maximum review.

Claude uses the bundled read-only `haiku`, `sonnet`, and `opus` reviewer agents when those model aliases are available. Codex requests distinct advertised model overrides (`gpt-5.6-sol`, `gpt-5.6-terra`, and `gpt-5.6-luna`) when the active host supports them. Other clients use only observable configured lanes. A missing, failed, or unverified lane is reported; it is never silently replaced or counted as model diversity. All reviewers receive the same evidence and rubric, and Interrogate never applies their findings automatically. See [`models.json`](./plugins/dstack/models.json) and the [panel contract](./plugins/dstack/skills/interrogate/references/interrogate-panel.md).

Every model run costs its own allowance. Use Interrogate when independent challenge is worth that cost; use `blast-radius` or a focused skill for a routine change. Arena and Swarm remain explicit and are not called by setup automatically.

## Roblox Studio MCP boundary

dstack is most accurate when the Roblox Studio MCP server is open and connected to the target Studio session. It does not bundle or auto-start that server; configure it for your client using the [official Roblox Studio MCP guide](https://create.roblox.com/docs/studio/mcp).

With a usable local repository and Rojo/project sync, the repository remains authoritative and MCP supplies missing instance context. If Rojo/project sync is unavailable, or no local repository is both present and connected to the target Studio, dstack may use all non-playtest MCP operations the server exposes within the user's requested scope: inspect and edit scripts, instances, properties, hierarchy, attributes, tags, attachments, and authored assets when supported. It inspects before mutating, keeps writes narrow, and reports exact Studio paths. Those edits are not repository diffs, tests, or Rojo proof.

If the MCP server is configured but Studio is closed or disconnected, dstack tells you once and continues from repository evidence when possible. If the runtime explicitly reports the server is missing or unconfigured, dstack stops and asks whether you want setup. **yes** follows the official guide and then ends the turn so you can restart Claude Code/Codex. **no** continues without MCP and includes one concise notice that MCP gives DStack its fullest Roblox context and accuracy. No connected Studio alone is never treated as proof of an uninstall.

dstack does **not** use Roblox Studio MCP to playtest. It never launches, starts, stops, simulates, or controls a test session. The user performs all Studio playtesting. After local checks pass, dstack returns a short manual Studio checklist for you.

## update or remove

Claude Code:

```text
/plugin marketplace update dstack
/plugin update dstack@dstack
```

Codex:

```shell
codex plugin marketplace upgrade dstack
codex plugin remove dstack@dstack
codex plugin add dstack@dstack
```

Start a new task after an update. If an old `dstack-local` entry remains, remove it from the client before reinstalling `dstack`; versioned cache directories are normally cleaned by the client and should not be edited by hand.

To remove the plugin:

```text
/plugin uninstall dstack@dstack
```

```shell
codex plugin remove dstack@dstack
codex plugin marketplace remove dstack
```

## develop and verify

Run the repository checks from the root:

```shell
node --test tests/*.test.mjs
```

The tests verify the nested marketplace structure, both manifests, prompt shims, internal links, invocation policy, David Mode state, the missing-versus-closed MCP setup gate, the reviewer model-diversity contract, and the permanent Studio no-playtest boundary.

## origin and license

dstack is a Roblox-focused derivative of [pstack by Lauren Tan](https://github.com/cursor/plugins/tree/main/pstack), adapted from [pstack-for-codex by Aqua-123](https://github.com/Aqua-123/pstack-for-codex). it is not an official Cursor, Roblox, Anthropic, or OpenAI project.

MIT. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
