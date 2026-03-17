# OpenCode Desktop

Native OpenCode desktop application for **macOS**, Windows, and Linux (not the web UI). Built with Tauri v2. Like [Visual Studio Code](https://github.com/microsoft/vscode), this is the native app you run on your machine instead of in a browser.

## Prerequisites

Building the desktop app requires additional Tauri dependencies (Rust toolchain, platform-specific libraries). See the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for setup instructions.

## Development (run on Mac / local)

From the **repo root** (recommended):

```bash
bun install
bun run dev:desktop
```

Or from this package:

```bash
bun install   # from repo root first
bun run --cwd packages/desktop tauri dev
```

## Build

```bash
bun run --cwd packages/desktop tauri build
```

## Troubleshooting

### Rust compiler not found

If you see errors about Rust not being found, install it via [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
