import { spawn } from "node:child_process";
import { realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Vitest 4 loads @vitest/runner twice on Windows when the shell cwd drive
// letter does not match the real path. Start it from the real path.
const root = realpathSync.native(fileURLToPath(new URL("..", import.meta.url)));
const vitest = join(root, "node_modules", "vitest", "vitest.mjs");
const child = spawn(process.execPath, [vitest, ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
