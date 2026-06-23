import type { WebContainer } from "@webcontainer/api";

export const WORKSPACE_BIN_DIR = ".coder/bin";

const GIT_STUB = `#!/usr/bin/env node
const [,, command, ...rest] = process.argv;

function succeed(output) {
  if (output) process.stdout.write(output);
  process.exit(0);
}

switch (command) {
  case "--version":
    succeed("git version 2.39.0 (browser-stub)\\n");
    break;
  case "init":
  case "add":
  case "commit":
  case "config":
  case "update-index":
  case "write-tree":
  case "read-tree":
    succeed();
    break;
  case "rev-parse":
    if (rest.includes("--is-inside-work-tree") || rest.includes("--git-dir")) {
      succeed("true\\n");
    }
    succeed(".git\\n");
    break;
  case "status":
    succeed("");
    break;
  case "version":
    succeed("git version 2.39.0 (browser-stub)\\n");
    break;
  default:
    process.stderr.write(
      \`git: '\${command ?? ""}' is not supported in this environment\\n\`,
    );
    process.exit(1);
}
`;

export function getWorkspacePathEnv(): Record<string, string> {
  return {
    PATH: `${WORKSPACE_BIN_DIR}:/usr/local/bin:/usr/bin:/bin`,
  };
}

export async function setupWorkspace(webcontainer: WebContainer) {
  const gitPath = `${WORKSPACE_BIN_DIR}/git`;

  await webcontainer.fs.mkdir(WORKSPACE_BIN_DIR, { recursive: true });
  await webcontainer.fs.writeFile(gitPath, GIT_STUB);

  try {
    const chmod = await webcontainer.spawn("chmod", ["+x", gitPath]);
    await chmod.exit;
  } catch {
    // chmod may be unavailable; shebang execution still works in jsh.
  }
}
