# dstack

hey, i'm hungrykelvin123. my name's not actually david, funny enough. i've been developing games for about two years now, and ever since ai became much more prominent in the community, i've wanted a faster, deeper, and more token-efficient way to write, debug, and ship code for roblox games.

that's when i found [pstack](https://github.com/cursor/plugins/tree/main/pstack), a cursor plugin with a bunch of skills designed by a highly skilled engineer to help agents write high-quality code. unfortunately, i don't use cursor, so i used [pstack ported to codex](https://github.com/Aqua-123/pstack-for-codex) instead.

this worked pretty well when i was designing the systems of my game, but one thing always nagged at me. because pstack was a generalized engineering plugin and wasn't made specifically for roblox, i found that my agents did much more than they needed to and wasted tokens. when it came to verifying code inside roblox, i also absolutely **despised** when ai used the roblox studio mcp server to playtest for me. it wastes a ton of tokens on minor fixes that i probably would have found myself.

that's why i created **dstack**. it's named after my friend david, one of the first people i developed on roblox with. dstack is specifically made *for* roblox and expects you to have the roblox studio mcp server available. i script in visual studio code and sync with rojo, but keep mcp open so the agent can inspect instances when files alone are not enough. most importantly, dstack explicitly forbids the agent from using mcp to playtest the game.

have fun coding!

## install

install dstack directly from github:

```bash
codex plugin marketplace add HungryKelvin123/dstack
codex plugin add dstack@dstack-local
```

confirm the install:

```bash
codex plugin list --json
```

## get started

two steps:

1. start a new codex task after installation or an update.
2. put `$david-mode` at the start of any non-trivial roblox task.

```text
$david-mode this remote sometimes awards the same item twice. find the root cause, fix it, and tell me exactly what i should verify in studio.
```

that's the normal workflow. david mode selects the smallest playbook and relevant focused skills. `$unslop` runs on every prompt; every other skill stays explicit so tiny tasks do not load a full workflow.

invoke skills by name, not with a file path copied from another task. codex manages installed plugin files in versioned cache folders; those paths are not stable and should not appear in prompts, automations, or documentation.

## usage

use `$david-mode` whenever the task needs engineering rigor. on its first activation it checks the roblox studio mcp connection once, remembers the matching studio for context-only inspection, and continues from the repository when studio is unnecessary or unavailable.

### just use `$david-mode`

david mode is the main shortcut. it is a sticky mode for the current session and routes to narrower skills only when the task needs them. turn it off with:

```text
disable $david-mode
```

when invoked, david mode:

1. reads repository instructions and relevant source first.
2. chooses the smallest playbook that fits the request.
3. routes to roblox-specific architecture, luau, data, networking, monetization, ui, physics, security, performance, review, or verification skills when needed.
4. uses local checks such as rojo builds and deterministic tests.
5. gives you the exact studio behavior that still needs manual playtesting.

it has sixteen playbooks:

| playbook | use it for |
|---|---|
| [investigation](./skills/david-mode/playbooks/investigation.md) | answer how a system behaves without changing it. |
| [bug fix](./skills/david-mode/playbooks/bug-fix.md) | trace a defect to its root cause, fix it, and verify what can be verified locally. |
| [performance issue](./skills/david-mode/playbooks/perf-issue.md) | measure a slowdown before changing performance-sensitive code. |
| [hillclimb](./skills/david-mode/playbooks/hillclimb.md) | improve one measured result through controlled iterations. |
| [runtime forensics](./skills/david-mode/playbooks/runtime-forensics.md) | investigate leaks, repeated work, replication problems, or lifecycle bugs. |
| [trace forensics](./skills/david-mode/playbooks/trace-forensics.md) | inspect an existing trace or profiling artifact. |
| [feature](./skills/david-mode/playbooks/feature.md) | add behavior with clear ownership, state, remote, and persistence boundaries. |
| [refactoring](./skills/david-mode/playbooks/refactoring.md) | change structure without changing behavior. |
| [prototype](./skills/david-mode/playbooks/prototype.md) | test competing designs cheaply before committing to one. |
| [visual parity](./skills/david-mode/playbooks/visual-parity.md) | match an existing roblox ui or authored reference. |
| [authoring a skill](./skills/david-mode/playbooks/authoring-a-skill.md) | create or edit agent instructions. |
| [eval](./skills/david-mode/playbooks/eval.md) | test whether a skill or prompt change improves agent behavior. |
| [autonomous run](./skills/david-mode/playbooks/autonomous-run.md) | complete a long, bounded roblox task without constant check-ins. |
| [session pickup](./skills/david-mode/playbooks/session-pickup.md) | resume work from an earlier task or handoff. |
| [pause safely](./skills/david-mode/playbooks/pause-safely.md) | stop long work in a state another task can resume. |
| [multi-phase plan](./skills/david-mode/playbooks/multi-phase-plan.md) | divide a large change into independently verifiable phases. |

the full router is [`skills/david-mode/SKILL.md`](./skills/david-mode/SKILL.md).

## the roblox rules

dstack's shared [roblox engineering contract](./references/roblox-engineering.md) applies these defaults unless the repository says otherwise:

- the server owns currencies, progression, combat results, purchases, saved data, consequential rng, permissions, and anti-abuse decisions.
- clients handle input and presentation. every remote request is an untrusted claim that the server must validate.
- datastore writes are idempotent, retry-safe, versioned, and explicit about failure behavior.
- consequential random outcomes are server-owned and survive retries or reconnects safely.
- performance work starts from evidence and accounts for mobile hardware, replication, physics, memory, and lifecycle cleanup.
- rojo builds prove project assembly and serialization, not luau runtime behavior.
- roblox studio mcp is for missing context only. **dstack never starts, stops, launches, or controls a studio playtest. you do all studio playtesting yourself.**

dstack contains no rules tied to one specific game. repository instructions and design documents remain authoritative for each project. exact roblox api signatures, limits, and platform policies are checked against current official documentation rather than frozen into skills.

## skills

`$david-mode` routes to most of these for you. invoke a focused skill directly only when the mode would be unnecessary:

| skill | use it for |
|---|---|
| [`$david-mode`](./skills/david-mode/SKILL.md) | default entry point for a non-trivial roblox task. |
| [`$how`](./skills/how/SKILL.md) | trace a roblox subsystem through modules, instances, remotes, replication, and persistence. |
| [`$why`](./skills/why/SKILL.md) | recover why an implementation exists from code, history, and project decisions. |
| [`$recall`](./skills/recall/SKILL.md) | rebuild recent project context before resuming work. |
| [`$architect`](./skills/architect/SKILL.md) | design ownership, state, typed luau modules, remotes, and persistence boundaries. |
| [`$blast-radius`](./skills/blast-radius/SKILL.md) | find what a change could break across the roblox project. |
| [`$luau-best-practices`](./skills/luau-best-practices/SKILL.md) | review or write maintainable typed luau. |
| [`$roblox-data`](./skills/roblox-data/SKILL.md) | design safe persistence, schemas, session ownership, retries, and cross-server state. |
| [`$roblox-networking`](./skills/roblox-networking/SKILL.md) | design remote protocols, replication, validation, and reliability. |
| [`$roblox-monetization`](./skills/roblox-monetization/SKILL.md) | build retry-safe developer product, pass, and subscription flows. |
| [`$roblox-physics`](./skills/roblox-physics/SKILL.md) | design assemblies, constraints, collision, hit detection, and network ownership. |
| [`$roblox-ui`](./skills/roblox-ui/SKILL.md) | build responsive interfaces across touch, keyboard, mouse, and gamepad. |
| [`$roblox-security`](./skills/roblox-security/SKILL.md) | review remotes, authority, purchases, rewards, rng, persistence, and abuse cases. |
| [`$roblox-performance`](./skills/roblox-performance/SKILL.md) | diagnose client, server, physics, rendering, replication, or memory performance. |
| [`$arena`](./skills/arena/SKILL.md) | compare independent attempts at the same bounded problem. |
| [`$swarm`](./skills/swarm/SKILL.md) | split independent slices across parallel workers when the user requests it. |
| [`$interrogate`](./skills/interrogate/SKILL.md) | run an adversarial review of a risky change. |
| [`$tdd`](./skills/tdd/SKILL.md) | write a cheap deterministic regression test before a fix. |
| [`$no-comments`](./skills/no-comments/SKILL.md) | remove narrating comments while preserving real constraints and invariants. |
| [`$create-verification-skill`](./skills/create-verification-skill/SKILL.md) | create a reusable verification skill for a roblox repository. |
| [`$maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | update that verification skill when the project changes. |
| [`$show-me-your-work`](./skills/show-me-your-work/SKILL.md) | keep a reviewable decision log during long work. |
| [`$figure-it-out`](./skills/figure-it-out/SKILL.md) | design a bounded playbook when none of the bundled ones fit. |
| [`$teach`](./skills/teach/SKILL.md) | explain a system using both its implementation and its history. |
| [`$reflect`](./skills/reflect/SKILL.md) | capture lessons from a completed task in the skills themselves. |
| [`$automate-me`](./skills/automate-me/SKILL.md) | turn a user's recurring working style into a personal mode skill. |
| [`$technical-writing`](./skills/technical-writing/SKILL.md) | write or review technical documentation. |
| [`$unslop`](./skills/unslop/SKILL.md) | remove ai tells and vague prose. this one runs automatically. |
| [`$bro`](./skills/bro/SKILL.md) | restate a technical answer in plain language. |

dstack uses the original short skill names. run dstack or pstack, not both, because their skill names overlap.

## principles

dstack also includes twenty-one small engineering principles. david mode reads at most the ones a task needs.

| principle | rule |
|---|---|
| [`laziness protocol`](./skills/principle-laziness-protocol/SKILL.md) | prefer deletion and the smallest complete change. |
| [`foundational thinking`](./skills/principle-foundational-thinking/SKILL.md) | settle the core data structures before writing logic around them. |
| [`redesign from first principles`](./skills/principle-redesign-from-first-principles/SKILL.md) | integrate a new requirement as if it had existed from the beginning. |
| [`subtract before you add`](./skills/principle-subtract-before-you-add/SKILL.md) | remove dead weight before building on top of it. |
| [`minimize reader load`](./skills/principle-minimize-reader-load/SKILL.md) | reduce wrappers, hidden state, and unnecessary mental jumps. |
| [`outcome-oriented execution`](./skills/principle-outcome-oriented-execution/SKILL.md) | move directly toward the intended architecture during planned migrations. |
| [`experience first`](./skills/principle-experience-first/SKILL.md) | choose the player's experience over implementation convenience. |
| [`exhaust the design space`](./skills/principle-exhaust-the-design-space/SKILL.md) | compare competing prototypes when the right shape is unclear. |
| [`build the lever`](./skills/principle-build-the-lever/SKILL.md) | create a repeatable tool or check for mechanical work. |
| [`model the domain`](./skills/principle-model-the-domain/SKILL.md) | encode the game state in data structures instead of scattered conditionals. |
| [`boundary discipline`](./skills/principle-boundary-discipline/SKILL.md) | validate at remotes and other external boundaries. |
| [`type-system discipline`](./skills/principle-type-system-discipline/SKILL.md) | model typed luau states honestly and narrow external data. |
| [`make operations idempotent`](./skills/principle-make-operations-idempotent/SKILL.md) | make retries converge to the same result. |
| [`migrate callers, then delete legacy apis`](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | move every caller and remove the old internal api in the same change. |
| [`separate before serializing shared state`](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | remove unnecessary shared writers before adding locks or queues. |
| [`prove it works`](./skills/principle-prove-it-works/SKILL.md) | verify the real artifact instead of trusting a proxy. |
| [`fix root causes`](./skills/principle-fix-root-causes/SKILL.md) | reproduce the symptom and fix the cause instead of hiding it. |
| [`sequence verifiable units`](./skills/principle-sequence-verifiable-units/SKILL.md) | make every phase end in a checkable state. |
| [`guard the context window`](./skills/principle-guard-the-context-window/SKILL.md) | keep raw bulk out of the main task and return compact evidence. |
| [`never block on the human`](./skills/principle-never-block-on-the-human/SKILL.md) | continue through safe reversible work without needless confirmation. |
| [`encode lessons in structure`](./skills/principle-encode-lessons-in-structure/SKILL.md) | turn repeated instructions into checks, metadata, scripts, or skills. |

## examples

```text
bug fix:       $david-mode players sometimes receive a reward twice after reconnecting. trace the full outcome lifecycle and fix the root cause.

feature:       $david-mode add this inventory feature. define server ownership, remote validation, replication, persistence, and the exact studio tests i should run.

data:          $roblox-data design the migration and retry behavior for this player profile change.

security:      $roblox-security review every client-controlled value in this purchase flow.

performance:   $roblox-performance this mobile ui stutters when the list updates. find measurable causes before changing it.

architecture:  $architect design the typed luau modules and remote contract for this system before implementation.

review:        $blast-radius check this change against saved data, remotes, authored instances, and dependent client systems.

explanation:   $how trace how this round state moves from the server to each player's ui.
```

## studio mcp boundary

dstack expects roblox studio mcp to be available when the local repository cannot answer a necessary question about instances, attributes, tags, hierarchy, or authored content.

it uses mcp for context only. it does **not** launch a test server, start or stop a test session, simulate a player, or control a running playtest. local checks happen through the repository and rojo. runtime playtesting stays with you.

if studio validation remains after local checks pass, dstack returns a short checklist with the exact behavior you should test.

## develop

run the bundled checks before contributing:

```bash
node --test tests/*.test.mjs
```

## update or remove

refresh the github marketplace and reinstall dstack:

```bash
codex plugin marketplace upgrade dstack-local
codex plugin remove dstack@dstack-local
codex plugin add dstack@dstack-local
```

if you are developing from codex's default personal marketplace instead:

```bash
codex plugin add dstack@personal
```

remove dstack completely:

```bash
codex plugin remove dstack@dstack-local
codex plugin marketplace remove dstack-local
```

start a new codex task after installing or updating so the new skill catalog is loaded. use `$david-mode`, not a copied path under `plugins/cache`.

## origin

dstack is a roblox-focused derivative of [pstack by lauren tan](https://github.com/cursor/plugins/tree/main/pstack), adapted from [pstack-for-codex by Aqua-123](https://github.com/Aqua-123/pstack-for-codex). it is not an official cursor, roblox, or openai project.

fork it, improve it, and make it useful for the way you build roblox games. issues and prs are welcome.

## license

mit. see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
