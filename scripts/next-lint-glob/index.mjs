import { statSync } from "node:fs";
import { resolve } from "node:path";
import { globSync as scan } from "glob";

// Next's getRootDirs uses only globSync(pattern, { onlyDirectories: true }).
// Reject a changed caller contract rather than silently dropping its options.
export function globSync(pattern, options = {}) {
  if (options.onlyDirectories !== true || Object.keys(options).some((key) => !["onlyDirectories", "cwd"].includes(key))) {
    throw new TypeError("Next lint directory glob requires onlyDirectories; only cwd is additionally supported");
  }
  const cwd = options.cwd ?? process.cwd();
  return scan(pattern, { cwd, follow: true }).filter((entry) => statSync(resolve(cwd, entry)).isDirectory());
}
