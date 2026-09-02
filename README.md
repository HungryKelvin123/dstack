# dstack

hey, i'm hungrykelvin123. my name's not actually david, funny enough. i've been developing games for about two years now, and ever since ai became much more prominent in the community, i've wanted a faster, deeper, and more token-efficient way to write, debug, and ship code for roblox games.

that's when i found [pstack](https://github.com/cursor/plugins/tree/main/pstack), a cursor plugin with a bunch of skills designed by a highly skilled engineer to help agents write high-quality code. unfortunately, i don't use cursor, so i used [pstack ported to codex](https://github.com/Aqua-123/pstack-for-codex) instead.

this worked pretty well when i was designing the systems of my game, but one thing always nagged at me. because pstack was a generalized engineering plugin and wasn't made specifically for roblox, i found that my agents did much more than they needed to and wasted tokens. when it comes to verifying code inside roblox, i also absolutely **despise** when ai uses the roblox studio mcp server to playtest for me. it wastes a ton of tokens on minor fixes that i probably would've found myself.

that's why i created my own version, **dstack**. it's named after my friend david, one of the first people i developed on roblox with. dstack is specifically made *for* roblox and expects you to have the roblox studio mcp server available. i do all of my scripting in visual studio code and sync it to my game with rojo, but i keep the mcp server open so my agent can inspect instances when the files alone aren't enough. most importantly, dstack explicitly forbids the agent from using the mcp server to playtest the game, because that only produced useless results for me.

have fun coding!

## install

this repository is a codex plugin marketplace. install it directly from github:

```bash
codex plugin marketplace add HungryKelvin123/dstack
codex plugin add dstack@dstack-local
```

confirm that it installed:

```bash
codex plugin list --json
```

start a new codex task after installation so codex reloads the skill catalog.

## get started

put `$david-mode-dstack` at the start of a non-trivial roblox task:

```text
$david-mode-dstack this remote sometimes awards the same item twice. find the root cause, fix it, and tell me exactly what i should verify in studio.
```

david mode picks the narrowest playbook, reads the relevant roblox rules, and calls the smaller skills only when the task needs them. it stays active for the current session after you invoke it. turn it off with:

```text
disable $david-mode-dstack
```

`$unslop-dstack` runs on every prompt, even when david mode is off. every other dstack skill is explicit so the plugin doesn't load an entire engineering workflow for a tiny request.

when you explicitly activate david mode, it calls `list_roblox_studios` once to check the studio mcp connection. it remembers the matching studio for later context-only inspection and does not repeat the check on every sticky turn. if studio or the mcp connection is closed, david mode tells you once and continues from the repository. it stops before changing code that depends on studio-only information it cannot verify.

## what david mode does

david mode has sixteen roblox-focused playbooks:

| playbook | use it for |
|---|---|
| [investigation](./skills/david-mode-dstack/playbooks/investigation.md) | answer how a system behaves without changing it. |
| [bug fix](./skills/david-mode-dstack/playbooks/bug-fix.md) | trace a defect to its root cause, fix it, and verify what can be verified locally. |
| [performance issue](./skills/david-mode-dstack/playbooks/perf-issue.md) | measure a slowdown before changing performance-sensitive code. |
| [hillclimb](./skills/david-mode-dstack/playbooks/hillclimb.md) | improve one measured result through controlled iterations. |
| [runtime forensics](./skills/david-mode-dstack/playbooks/runtime-forensics.md) | investigate leaks, repeated work, replication problems, or lifecycle bugs. |
| [trace forensics](./skills/david-mode-dstack/playbooks/trace-forensics.md) | inspect an existing trace or profiling artifact. |
| [feature](./skills/david-mode-dstack/playbooks/feature.md) | add behavior with clear ownership, state, remote, and persistence boundaries. |
| [refactoring](./skills/david-mode-dstack/playbooks/refactoring.md) | change structure without changing behavior. |
| [prototype](./skills/david-mode-dstack/playbooks/prototype.md) | test competing designs cheaply before committing to one. |
| [visual parity](./skills/david-mode-dstack/playbooks/visual-parity.md) | match an existing roblox ui or authored reference. |
| [authoring a skill](./skills/david-mode-dstack/playbooks/authoring-a-skill.md) | create or edit agent instructions. |
| [eval](./skills/david-mode-dstack/playbooks/eval.md) | test whether a skill or prompt change improves agent behavior. |
| [autonomous run](./skills/david-mode-dstack/playbooks/autonomous-run.md) | complete a long, bounded roblox task without constant check-ins. |
| [session pickup](./skills/david-mode-dstack/playbooks/session-pickup.md) | resume work from an earlier task or handoff. |
| [pause safely](./skills/david-mode-dstack/playbooks/pause-safely.md) | stop long work in a state another task can resume. |
| [multi-phase plan](./skills/david-mode-dstack/playbooks/multi-phase-plan.md) | divide a large change into independently verifiable phases. |

when invoked, david mode:

1. reads the repository's own instructions and relevant source first.
2. chooses the smallest playbook that fits the request.
3. routes to roblox-specific architecture, luau, security, performance, review, or verification skills when needed.
4. uses local checks such as rojo builds and deterministic tests.
5. gives you the exact studio behavior that still needs manual playtesting.

the complete router lives in [`skills/david-mode-dstack/SKILL.md`](./skills/david-mode-dstack/SKILL.md).

## the roblox rules

dstack's shared [roblox engineering contract](./references/roblox-engineering.md) applies these defaults unless your repository says otherwise:

- the server owns currencies, progression, combat results, purchases, saved data, consequential rng, permissions, and anti-abuse decisions.
- clients handle input and presentation. every remote request is an untrusted claim that the server must validate.
- datastore writes should be idempotent, retry-safe, versioned, and explicit about failure behavior.
- consequential random outcomes belong on the server and must survive retries or reconnects safely.
- performance work starts from evidence and accounts for mobile hardware, replication, physics, memory, and lifecycle cleanup.
- rojo builds prove project assembly and serialization. they do not prove luau runtime behavior.
- roblox studio mcp is for missing context only. **dstack never starts, stops, launches, or controls a studio playtest. you do all studio playtesting yourself.**

dstack contains no rules tied to one specific game. repository instructions and design documents remain the authority for each project.

## skills

you can invoke a focused skill directly when david mode would be unnecessary:

| skill | use it for |
|---|---|
| [`$david-mode-dstack`](./skills/david-mode-dstack/SKILL.md) | route a non-trivial roblox task through a complete playbook. |
| [`$how-dstack`](./skills/how-dstack/SKILL.md) | trace a roblox subsystem through modules, instances, remotes, replication, and persistence. |
| [`$why-dstack`](./skills/why-dstack/SKILL.md) | recover why an implementation exists from code, history, and project decisions. |
| [`$recall-dstack`](./skills/recall-dstack/SKILL.md) | rebuild recent project context before resuming work. |
| [`$architect-dstack`](./skills/architect-dstack/SKILL.md) | design ownership, state, typed luau modules, remotes, and persistence boundaries. |
| [`$blast-radius-dstack`](./skills/blast-radius-dstack/SKILL.md) | find what a change could break across the roblox project. |
| [`$luau-best-practices-dstack`](./skills/luau-best-practices-dstack/SKILL.md) | review or write maintainable typed luau. |
| [`$roblox-security-dstack`](./skills/roblox-security-dstack/SKILL.md) | review remotes, authority, purchases, rewards, rng, persistence, and abuse cases. |
| [`$roblox-performance-dstack`](./skills/roblox-performance-dstack/SKILL.md) | diagnose client, server, physics, rendering, replication, or memory performance. |
| [`$arena-dstack`](./skills/arena-dstack/SKILL.md) | compare independent attempts at the same bounded problem. |
| [`$swarm-dstack`](./skills/swarm-dstack/SKILL.md) | split independent slices across parallel workers when the user requests it. |
| [`$interrogate-dstack`](./skills/interrogate-dstack/SKILL.md) | run an adversarial review of a risky change. |
| [`$tdd-dstack`](./skills/tdd-dstack/SKILL.md) | write a cheap deterministic regression test before a fix. |
| [`$no-comments-dstack`](./skills/no-comments-dstack/SKILL.md) | remove narrating comments while preserving real constraints and invariants. |
| [`$create-verification-skill-dstack`](./skills/create-verification-skill-dstack/SKILL.md) | create a reusable verification skill for a roblox repository. |
| [`$maintain-verification-skill-dstack`](./skills/maintain-verification-skill-dstack/SKILL.md) | update that verification skill when the project changes. |
| [`$show-me-your-work-dstack`](./skills/show-me-your-work-dstack/SKILL.md) | keep a reviewable decision log during long work. |
| [`$figure-it-out-dstack`](./skills/figure-it-out-dstack/SKILL.md) | design a bounded playbook when none of the bundled ones fit. |
| [`$teach-dstack`](./skills/teach-dstack/SKILL.md) | explain a system using both its implementation and its history. |
| [`$reflect-dstack`](./skills/reflect-dstack/SKILL.md) | capture lessons from a completed task in the skills themselves. |
| [`$automate-me-dstack`](./skills/automate-me-dstack/SKILL.md) | turn a user's recurring working style into a personal mode skill. |
| [`$technical-writing-dstack`](./skills/technical-writing-dstack/SKILL.md) | write or review technical documentation. |
| [`$unslop-dstack`](./skills/unslop-dstack/SKILL.md) | remove ai tells and vague prose. this one runs automatically. |
| [`$bro-dstack`](./skills/bro-dstack/SKILL.md) | restate a technical answer in plain language. |

all dstack skill names end in `-dstack`, so they don't conflict with pstack or another plugin that uses the original names.

## principles

dstack also includes twenty-one small engineering principles. david mode reads at most the ones a task actually needs.

| principle | rule |
|---|---|
| [`laziness protocol`](./skills/principle-laziness-protocol-dstack/SKILL.md) | prefer deletion and the smallest complete change. |
| [`foundational thinking`](./skills/principle-foundational-thinking-dstack/SKILL.md) | settle the core data structures before writing logic around them. |
| [`redesign from first principles`](./skills/principle-redesign-from-first-principles-dstack/SKILL.md) | integrate a new requirement as if it had existed from the beginning. |
| [`subtract before you add`](./skills/principle-subtract-before-you-add-dstack/SKILL.md) | remove dead weight before building on top of it. |
| [`minimize reader load`](./skills/principle-minimize-reader-load-dstack/SKILL.md) | reduce wrappers, hidden state, and unnecessary mental jumps. |
| [`outcome-oriented execution`](./skills/principle-outcome-oriented-execution-dstack/SKILL.md) | move directly toward the intended architecture during planned migrations. |
| [`experience first`](./skills/principle-experience-first-dstack/SKILL.md) | choose the player's experience over implementation convenience. |
| [`exhaust the design space`](./skills/principle-exhaust-the-design-space-dstack/SKILL.md) | compare competing prototypes when the right shape is unclear. |
| [`build the lever`](./skills/principle-build-the-lever-dstack/SKILL.md) | create a repeatable tool or check for mechanical work. |
| [`model the domain`](./skills/principle-model-the-domain-dstack/SKILL.md) | encode the game state in data structures instead of scattered conditionals. |
| [`boundary discipline`](./skills/principle-boundary-discipline-dstack/SKILL.md) | validate at remotes and other external boundaries. |
| [`type-system discipline`](./skills/principle-type-system-discipline-dstack/SKILL.md) | model typed luau states honestly and narrow external data. |
| [`make operations idempotent`](./skills/principle-make-operations-idempotent-dstack/SKILL.md) | make retries converge to the same result. |
| [`migrate callers, then delete legacy apis`](./skills/principle-migrate-callers-then-delete-legacy-apis-dstack/SKILL.md) | move every caller and remove the old internal api in the same change. |
| [`separate before serializing shared state`](./skills/principle-separate-before-serializing-shared-state-dstack/SKILL.md) | remove unnecessary shared writers before adding locks or queues. |
| [`prove it works`](./skills/principle-prove-it-works-dstack/SKILL.md) | verify the real artifact instead of trusting a proxy. |
| [`fix root causes`](./skills/principle-fix-root-causes-dstack/SKILL.md) | reproduce the symptom and fix the cause instead of hiding it. |
| [`sequence verifiable units`](./skills/principle-sequence-verifiable-units-dstack/SKILL.md) | make every phase end in a checkable state. |
| [`guard the context window`](./skills/principle-guard-the-context-window-dstack/SKILL.md) | keep raw bulk out of the main task and return compact evidence. |
| [`never block on the human`](./skills/principle-never-block-on-the-human-dstack/SKILL.md) | continue through safe reversible work without needless confirmation. |
| [`encode lessons in structure`](./skills/principle-encode-lessons-in-structure-dstack/SKILL.md) | turn repeated instructions into checks, metadata, scripts, or skills. |

## examples

```text
bug fix:       $david-mode-dstack players sometimes receive a reward twice after reconnecting. trace the full outcome lifecycle and fix the root cause.

feature:       $david-mode-dstack add this inventory feature. define server ownership, remote validation, replication, persistence, and the exact studio tests i should run.

security:      $roblox-security-dstack review every client-controlled value in this purchase flow.

performance:   $roblox-performance-dstack this mobile ui stutters when the list updates. find measurable causes before changing it.

architecture:  $architect-dstack design the typed luau modules and remote contract for this system before implementation.

review:        $blast-radius-dstack check this change against saved data, remotes, authored instances, and dependent client systems.

explanation:   $how-dstack trace how this round state moves from the server to each player's ui.
```

## studio mcp boundary

dstack expects roblox studio mcp to be available when the local repository cannot answer a necessary question about instances, attributes, tags, hierarchy, or authored content.

an explicit david mode activation checks the connection once. no connected studio means repository-only work continues, unless the task depends on unresolved studio-only state. in that case, dstack asks you to open the correct studio and mcp connection instead of guessing.

it does **not** use studio mcp to playtest. it does not launch a test server, start a test session, stop one, simulate a player, or control a running playtest. local checks happen through the repository and rojo. runtime playtesting stays with you.

if studio validation remains after the local checks pass, dstack returns a short checklist with the exact behavior you should test.

## develop and verify

dstack's tests use node's built-in test runner:

```bash
node --test tests/*.test.mjs
```

the tests verify that all 45 skills use the `-dstack` namespace, only unslop allows implicit invocation, every internal skill reference resolves, david mode stays sticky, and the studio mcp playtesting boundary remains part of the roblox contract.

## update or remove

refresh the github marketplace and reinstall dstack:

```bash
codex plugin marketplace upgrade dstack-local
codex plugin remove dstack@dstack-local
codex plugin add dstack@dstack-local
```

remove it completely:

```bash
codex plugin remove dstack@dstack-local
codex plugin marketplace remove dstack-local
```

start a new codex task after installing or updating so the new skill catalog is loaded.

## origin

dstack is a roblox-focused derivative of [pstack by lauren tan](https://github.com/cursor/plugins/tree/main/pstack), adapted from [pstack-for-codex by Aqua-123](https://github.com/Aqua-123/pstack-for-codex). it is not an official cursor, roblox, or openai project.

fork it, improve it, and make it useful for the way you build roblox games. issues and prs are welcome.

## license

mit. see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
