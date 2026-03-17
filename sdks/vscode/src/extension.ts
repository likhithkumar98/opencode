import * as vscode from "vscode"
import { spawn, type ChildProcess } from "child_process"

const TERMINAL_NAME = "opencode"
const WEB_SERVER_PORT_KEY = "opencode.webServerPort"
let webServerProcess: ChildProcess | undefined

export function deactivate() {
  if (webServerProcess?.pid) {
    webServerProcess.kill()
    webServerProcess = undefined
  }
}

export function activate(context: vscode.ExtensionContext) {
  let openNewTerminalDisposable = vscode.commands.registerCommand("opencode.openNewTerminal", async () => {
    await launch()
  })

  let openTerminalDisposable = vscode.commands.registerCommand("opencode.openTerminal", async () => {
    const mode = getLaunchMode()
    if (mode === "terminal") {
      const existingTerminal = vscode.window.terminals.find((t) => t.name === TERMINAL_NAME)
      if (existingTerminal) {
        existingTerminal.show()
        return
      }
    } else {
      const port = context.globalState.get<number>(WEB_SERVER_PORT_KEY)
      if (port && (await isServerReady(port))) {
        await openSimpleBrowser(port)
        return
      }
    }
    await launch()
  })

  let addFilepathDisposable = vscode.commands.registerCommand("opencode.addFilepathToTerminal", async () => {
    const fileRef = getActiveFile()
    if (!fileRef) {
      return
    }

    const terminal = vscode.window.activeTerminal
    if (!terminal) {
      return
    }

    if (terminal.name === TERMINAL_NAME) {
      // @ts-ignore
      const port = terminal.creationOptions.env?.["_EXTENSION_OPENCODE_PORT"]
      port ? await appendPrompt(parseInt(port), fileRef) : terminal.sendText(fileRef, false)
      terminal.show()
    }
  })

  context.subscriptions.push(openTerminalDisposable, addFilepathDisposable, openNewTerminalDisposable)

  function getLaunchMode(): "terminal" | "web" {
    return vscode.workspace.getConfiguration("opencode").get<"terminal" | "web">("launchMode") ?? "terminal"
  }

  async function launch() {
    const mode = getLaunchMode()
    if (mode === "web") {
      await openWeb()
      return
    }
    await openTerminal()
  }

  async function openTerminal() {
    const port = Math.floor(Math.random() * (65535 - 16384 + 1)) + 16384
    const terminal = vscode.window.createTerminal({
      name: TERMINAL_NAME,
      iconPath: {
        light: vscode.Uri.file(context.asAbsolutePath("images/button-dark.svg")),
        dark: vscode.Uri.file(context.asAbsolutePath("images/button-light.svg")),
      },
      location: {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: false,
      },
      env: {
        _EXTENSION_OPENCODE_PORT: port.toString(),
        OPENCODE_CALLER: "vscode",
      },
    })

    terminal.show()
    terminal.sendText(`opencode --port ${port}`)

    const fileRef = getActiveFile()
    if (!fileRef) return

    let tries = 10
    do {
      await new Promise((resolve) => setTimeout(resolve, 200))
      try {
        await fetch(`http://localhost:${port}/app`)
        await appendPrompt(port, `In ${fileRef}`)
        terminal.show()
        return
      } catch {
        tries--
      }
    } while (tries > 0)
  }

  async function openWeb() {
    const storedPort = context.globalState.get<number>(WEB_SERVER_PORT_KEY)
    if (webServerProcess?.pid && storedPort != null && (await isServerReady(storedPort))) {
      await openSimpleBrowser(storedPort)
      return
    }
    if (webServerProcess?.pid) {
      webServerProcess.kill()
      webServerProcess = undefined
    }

    const port = Math.floor(Math.random() * (65535 - 16384 + 1)) + 16384
    webServerProcess = spawn("opencode", ["serve", "--port", String(port)], {
      stdio: "ignore",
      env: { ...process.env, OPENCODE_CALLER: "vscode" },
    })
    webServerProcess.on("error", (err) => {
      vscode.window.showErrorMessage(`opencode: failed to start server: ${err.message}`)
      webServerProcess = undefined
    })
    webServerProcess.on("exit", (code) => {
      webServerProcess = undefined
      context.globalState.update(WEB_SERVER_PORT_KEY, undefined)
    })
    context.globalState.update(WEB_SERVER_PORT_KEY, port)

    let tries = 25
    do {
      await new Promise((resolve) => setTimeout(resolve, 200))
      if (await isServerReady(port)) {
        await openSimpleBrowser(port)
        return
      }
      tries--
    } while (tries > 0)

    vscode.window.showErrorMessage("opencode: server did not become ready in time.")
  }

  async function isServerReady(port: number): Promise<boolean> {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`)
      return res.ok
    } catch {
      return false
    }
  }

  async function openSimpleBrowser(port: number) {
    const url = `http://127.0.0.1:${port}/`
    try {
      await vscode.commands.executeCommand("simpleBrowser.show", url)
    } catch {
      await vscode.env.openExternal(vscode.Uri.parse(url))
    }
  }

  async function appendPrompt(port: number, text: string) {
    await fetch(`http://localhost:${port}/tui/append-prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
  }

  function getActiveFile() {
    const activeEditor = vscode.window.activeTextEditor
    if (!activeEditor) {
      return
    }

    const document = activeEditor.document
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)
    if (!workspaceFolder) {
      return
    }

    // Get the relative path from workspace root
    const relativePath = vscode.workspace.asRelativePath(document.uri)
    let filepathWithAt = `@${relativePath}`

    // Check if there's a selection and add line numbers
    const selection = activeEditor.selection
    if (!selection.isEmpty) {
      // Convert to 1-based line numbers
      const startLine = selection.start.line + 1
      const endLine = selection.end.line + 1

      if (startLine === endLine) {
        // Single line selection
        filepathWithAt += `#L${startLine}`
      } else {
        // Multi-line selection
        filepathWithAt += `#L${startLine}-${endLine}`
      }
    }

    return filepathWithAt
  }
}
