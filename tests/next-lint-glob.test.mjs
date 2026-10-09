import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { Linter, ESLint } from "eslint";
import next from "@next/eslint-plugin-next";
import { getRootDirs } from "@next/eslint-plugin-next/dist/utils/get-root-dirs.js";
import { globSync } from "../scripts/next-lint-glob/index.mjs";

function fixture(fn) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, "asphalt-lint-"));
  try {
    for (const app of ["web", "admin"]) {
      mkdirSync(join(root, "packages", app, "app", "asphalt-calculator"), { recursive: true });
      mkdirSync(join(root, "packages", app, "pages"));
      writeFileSync(join(root, "packages", app, "app", "page.jsx"), "export default function Page() { return null; }");
      writeFileSync(join(root, "packages", app, "pages", "asphalt-calculator.jsx"), "export default function Page() { return null; }");
      writeFileSync(join(root, "packages", app, "app", "asphalt-calculator", "page.jsx"), "export default function Page() { return null; }");
    }
    writeFileSync(join(root, "packages", "readme.txt"), "synthetic fixture");
    return fn(root);
  } finally {
    // Only the fresh fixture created above can be removed, never a checkout.
    assert.equal(dirname(resolve(root)), parent);
    assert.match(root.slice(parent.length + 1), /^asphalt-lint-/);
    rmSync(root, { recursive: true, force: true });
  }
}

test("directory scanner supports stars, braces and arrays while excluding files", () => fixture((root) => {
  const expected = ["packages/admin", "packages/web"];
  for (const pattern of ["packages/*", "packages/{admin,web}", ["packages/admin", "packages/web"]]) {
    assert.deepEqual(globSync(pattern, { cwd: root, onlyDirectories: true }).map((path) => path.replaceAll("\\", "/")).sort(), expected);
  }
  assert.deepEqual(globSync("packages/readme.txt", { cwd: root, onlyDirectories: true }), []);
}));

test("unsupported future scanner options fail instead of silently weakening directory filtering", () => {
  assert.throws(() => globSync("*"), TypeError);
  assert.throws(() => globSync("*", { onlyDirectories: false }), TypeError);
  assert.throws(() => globSync("*", { onlyDirectories: true, unexpected: true }), TypeError);
});

test("the installed Next root resolver keeps default, single glob and array root behavior", () => fixture((root) => {
  const base = root.replaceAll("\\", "/");
  const expected = [`${base}/packages/admin`, `${base}/packages/web`];
  assert.deepEqual(getRootDirs({ cwd: root, settings: {} }), [root]);
  for (const rootDir of [`${base}/packages/*`, [`${base}/packages/admin`, `${base}/packages/web`]]) {
    assert.deepEqual(getRootDirs({ cwd: root, settings: { next: { rootDir } } }).map((path) => path.replaceAll("\\", "/")).sort(), expected);
  }
}));

function diagnose(root, source) {
  const linter = new Linter({ cwd: root });
  return linter.verify(source, [{
    files: ["**/*.jsx"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "@next/next": next },
    rules: next.configs["core-web-vitals"].rules,
    settings: { next: { rootDir: root.replaceAll("\\", "/") + "/packages/*" } },
  }], { filename: "packages/web/app/example/page.jsx" });
}

test("actual Next lint still rejects internal anchors resolved through the replacement scanner", () => fixture((root) => {
  for (const route of ["/", "/asphalt-calculator"]) {
    const bad = diagnose(root, `export default function Page() { return <a href="${route}">Calculate</a>; }`);
    assert(bad.some((message) => message.ruleId === "@next/next/no-html-link-for-pages" && message.severity === 2));
    const good = diagnose(root, `import Link from "next/link"; export default function Page() { return <Link href="${route}">Calculate</Link>; }`);
    assert.deepEqual(good, []);
  }
}));

for (const [rule, severity, source] of [
  ["no-sync-scripts", 2, 'export default function Page() { return <script src="/fixture.js" />; }'],
  ["no-img-element", 1, 'export default function Page() { return <img src="/fixture.png" alt="fixture" />; }'],
  ["no-async-client-component", 1, '"use client"; export default async function Page() { return <div />; }'],
  ["inline-script-id", 2, 'import Script from "next/script"; export default function Page() { return <Script>{"fixture"}</Script>; }'],
]) {
  test(`actual Next lint retains ${rule} diagnostic and severity`, () => fixture((root) => {
    assert(diagnose(root, source).some((message) => message.ruleId === `@next/next/${rule}` && message.severity === severity));
  }));
}

test("all 22 existing Next rules remain configured at their original severity", async () => {
  const eslint = new ESLint();
  const config = await eslint.calculateConfigForFile("app/page.tsx");
  const expected = next.configs["core-web-vitals"].rules;
  assert.equal(Object.keys(expected).length, 22);
  assert.equal(Object.keys(config.rules).filter((name) => name.startsWith("@next/next/")).length, 22);
  for (const [name, severity] of Object.entries(expected)) {
    assert.equal(config.rules[name][0], severity === "error" ? 2 : 1, name);
  }
});
