import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const ignored = new Set(["node_modules", ".next", "out", "test-results", "playwright-report"]);
const forbidden = new RegExp(["aero"+"sim", "aero"+"net", "ytgaming"+"pixel", "Louis"+"projects42", "inference"+"_url", "stripe"+"_secret", "database"+"_url", "getSession"+"User", "RANS"+"-trained", "vortex"+"-lattice"].join("|"), "i");
const failures = [];
let count = 0;
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    // Root Git metadata is local repository state, never public source.
    if (dir === root && entry.name === ".git") continue;
    if (ignored.has(entry.name) || entry.name.endsWith(".tsbuildinfo")) continue;
    const file = path.join(dir, entry.name);
    const relative = path.relative(root, file);
    if (entry.isSymbolicLink()) { failures.push(relative + ": symlink"); continue; }
    if (/^(\.git|\.claude|\.codex|\.agents|\.data|\.env.*|training|prisma)$/i.test(entry.name)) { failures.push(relative + ": private path"); continue; }
    if (entry.isDirectory()) { await scan(file); continue; }
    count++;
    const buffer = await readFile(file);
    if (entry.name.endsWith(".glb")) {
      if (buffer.readUInt32LE(0) !== 0x46546c67 || buffer.readUInt32LE(8) !== buffer.length) { failures.push(relative + ": invalid GLB"); continue; }
      const chunks = [];
      for (let pos = 12; pos < buffer.length;) {
        const size = buffer.readUInt32LE(pos), type = buffer.readUInt32LE(pos + 4);
        chunks.push(type);
        if (type === 0x4e4f534a && /"extras"|source|licence|author|http/i.test(buffer.subarray(pos + 8, pos + 8 + size).toString())) failures.push(relative + ": metadata");
        pos += 8 + size;
      }
      if (chunks.length !== 2 || chunks[0] !== 0x4e4f534a || chunks[1] !== 0x004e4942) failures.push(relative + ": non-geometry payload");
    } else if (/\.(tsx?|m?js|json|md|css|svg|yml|txt)$/.test(entry.name) || entry.name.startsWith(".")) {
      const text = buffer.toString("utf8");
      if (forbidden.test(text)) failures.push(relative + ": private identifier");
      if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:sk_live_|ghp_)[A-Za-z0-9]{20}/.test(text)) failures.push(relative + ": credential pattern");
    }
  }
}
await scan(root);
for (const route of ["simulate", "api", "signin", "account", "model-card", "dev"]) {
  try { await readdir(path.join(root, "app", route)); failures.push("Unexpected tool route: " + route); } catch (e) { if (e.code !== "ENOENT") throw e; }
}
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log("Public-content check passed: " + count + " source/assets checked; geometry-only aircraft; no private product identifiers or backend routes.");
