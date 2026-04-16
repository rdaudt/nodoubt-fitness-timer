import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const forwardedArgs = process.argv.slice(2);

function run(label, args) {
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", npmCommand, ...args], {
        stdio: "inherit",
        shell: false,
      })
    : spawnSync(npmCommand, args, {
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

  return forwardedArgs.map((filter) => [...baseArgs, "--", "--grep", filter]);
}

const testRuns = [
  ["unit", ["run", "test:unit"]],
  ["integration", ["run", "test:integration"]],
  ["e2e", ["run", "test:e2e"]],
];

for (const [label, baseArgs] of testRuns) {
  for (const args of buildArgs(label, baseArgs)) {
    run(label, args);
  }
}
