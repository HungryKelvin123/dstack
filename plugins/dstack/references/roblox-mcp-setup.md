# Roblox Studio MCP setup

Use the [official Roblox Studio MCP connection guide](https://create.roblox.com/docs/studio/mcp) as the setup source of truth. Read it whenever the MCP server is missing, the client format is uncertain, or a setup step may have changed. Roblox Studio supplies the server; the agent client still needs a client-specific connection through quick connect, a JSON configuration, or a CLI command.

## Classify the connection before asking

Use observable capability, not guesswork:

- **Connected:** Roblox Studio MCP tools are callable and `list_roblox_studios` returns one or more Studios. Keep the selected `studio_id` and continue under the Roblox engineering contract.
- **Configured but not open:** `Roblox_Studio` is registered or its tools are known, but no Studio is returned, Studio is disabled, or the connection fails while Studio is closed. Tell the user to open the target Studio and enable **Assistant > … > Manage MCP Servers > Enable Studio as MCP server**. Continue repository work when possible; do not ask them to install the server.
- **Missing or unconfigured:** the runtime explicitly reports that the Roblox Studio MCP server/tool is absent or the active client has no `Roblox_Studio` registration. This is different from an empty Studio list. Do not infer installation failure from “no connected Studio” alone.
- **Unknown:** the runtime cannot distinguish a missing registration from a transient client failure. Report the uncertainty and ask the user to confirm the active client and connection state before writing.

## Missing-MCP gate

When the state is **missing or unconfigured**, stop the current turn immediately after asking:

> Roblox Studio MCP is not installed or configured for this client. Would you like me to configure it? DStack is most accurate, most efficient, and produces its highest-quality work when MCP is connected to an open Roblox Studio. Reply **yes** to configure it, or **no** to continue without MCP.

Do not continue the original task, edit files, or make Studio writes in that turn. Do not ask this question merely because Studio is closed.

If the user answers **no**, acknowledge once that MCP enables DStack's fullest context, accuracy, and efficiency, then continue the original task without MCP. Keep any Studio-only work as a concrete user-run step.

If the user answers **yes**:

1. Identify the active agent client and operating system. Use the client's own MCP settings or documented CLI; never install a configuration meant for a different client. For Codex, inspect `codex mcp list`/`codex mcp get Roblox_Studio` first and use `codex mcp add` only when that command is available and the entry is absent.
2. Read the official Roblox guide and prefer its current **Quick connect** path when the client is listed. Otherwise use that client's JSON configuration or CLI path, preserving existing MCP servers and validating any JSON before saving.
3. Use the guide's current platform command for the selected client. Its standard stdio launch commands are `cmd.exe /c %LOCALAPPDATA%\\Roblox\\mcp.bat` on Windows and `/Applications/RobloxStudio.app/Contents/MacOS/StudioMCP` on macOS, but the surrounding client configuration is not universal. For Codex CLI, the equivalent registration passes those command tokens after `--`, for example `codex mcp add Roblox_Studio -- cmd.exe /c %LOCALAPPDATA%\\Roblox\\mcp.bat` on Windows or `codex mcp add Roblox_Studio -- /Applications/RobloxStudio.app/Contents/MacOS/StudioMCP` on macOS; verify the current `codex mcp --help` before running it.
4. If the active client exposes no safe configuration API, report that exact limitation and give the user the official guide's client-specific steps. Never claim the server was installed when only instructions were provided.
5. After a successful configuration, report what was changed and direct the user to restart the agent client/Codex (and Roblox Studio if the guide requires it). End the turn; do not try to reload MCP tools or resume the original task in the same turn. The user retries the original prompt after restart.

Configuration grants no permission to playtest. Preserve DStack's hard ban on launching, starting, stopping, simulating, or controlling Roblox Studio playtests.
