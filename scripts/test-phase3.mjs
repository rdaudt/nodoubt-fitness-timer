import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";

function run(command, args) {
  const executable = isWindows ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, {
    stdio: "inherit",
    shell: isWindows,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const phase3Runs = [
  ["npm", ["run", "test:unit", "--", "run-"]],
  ["npm", ["run", "test:integration", "--", "run-"]],
  ["npm", ["run", "test:e2e", "--", "phase3-run-controls"]],
];

for (const [command, args] of phase3Runs) {
  run(command, args);
}
