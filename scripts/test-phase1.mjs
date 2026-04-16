import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const forwardedArgs = process.argv.slice(2);

function run(command, args) {
  const executable = isWindows ? `${command}.cmd` : command;
  const result = isWindows
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", executable, ...args], {
        stdio: "inherit",
        shell: false,
      })
    : spawnSync(executable, args, {
        stdio: "inherit",
        shell: false,
      });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function buildArgs(label, baseArgs) {
  if (forwardedArgs.length === 0) {
    return [baseArgs];
  }

  if (label === "unit" || label === "integration") {
    return forwardedArgs.map((filter) => [
      ...baseArgs,
      "--",
      "--testNamePattern",
      filter,
    ]);
  }

  const grepPattern = forwardedArgs
    .map((filter) => filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  return [[...baseArgs, "--grep", grepPattern]];
}

const testRuns = [
  ["unit", "npm", ["run", "test:unit"]],
  ["integration", "npm", ["run", "test:integration"]],
  [
    "e2e",
    "npx",
    ["playwright", "test", "--config", "playwright.config.ts", "--pass-with-no-tests"],
  ],
];

for (const [label, command, baseArgs] of testRuns) {
  for (const args of buildArgs(label, baseArgs)) {
    run(command, args);
  }
}
