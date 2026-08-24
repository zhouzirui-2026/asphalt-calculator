import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { ROUTES } from "../site-config.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const artifactRoot = resolve(projectRoot, "dist");
assert.equal(dirname(artifactRoot), resolve(projectRoot), "Audit artifact must stay directly under the project root");

async function availablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const { port } = address;
  server.close();
  await once(server, "close");
  return port;
}

async function startProductionServer() {
  const port = await availablePort();
  const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  const child = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; });
  child.stderr.on("data", (chunk) => { logs += chunk; });

  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    assert.equal(child.exitCode, null, `Next production server exited early:\n${logs}`);
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status === 200) return { baseUrl, child };
    } catch {
      // The server may not have bound its socket yet.
    }
    await delay(125);
  }
  child.kill();
  throw new Error(`Timed out starting Next production server:\n${logs}`);
}

async function stopProductionServer(child) {
  if (child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), delay(5_000)]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function renderRoutes(baseUrl) {
  for (const route of ROUTES) {
    const response = await fetch(`${baseUrl}${route.path}`, { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, `${route.path} must render before artifact audit`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const routeDirectory = route.path === "/"
      ? artifactRoot
      : join(artifactRoot, ...route.path.slice(1).split("/"));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(join(routeDirectory, "index.html"), await response.text(), "utf8");
  }
}

await rm(artifactRoot, { recursive: true, force: true });
await mkdir(artifactRoot, { recursive: true });
await cp(resolve(projectRoot, "public"), artifactRoot, { recursive: true });
await mkdir(join(artifactRoot, "_next"), { recursive: true });
await cp(resolve(projectRoot, ".next", "static"), join(artifactRoot, "_next", "static"), { recursive: true });

const server = await startProductionServer();
try {
  await renderRoutes(server.baseUrl);
} finally {
  await stopProductionServer(server.child);
}

console.log(`Rendered ${ROUTES.length} routes plus public and client-static assets to ${artifactRoot}.`);
