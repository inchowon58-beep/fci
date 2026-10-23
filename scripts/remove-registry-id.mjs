/**
 * registered.json 에서 업체 id 제거 (삭제 요청 반영)
 * Usage: node scripts/remove-registry-id.mjs sales-407000004520240001
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const id = process.argv[2];
if (!id) {
  console.error("Usage: node scripts/remove-registry-id.mjs <business-id>");
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "data", "registered.json");
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);
const before = data.businesses.length;
data.businesses = data.businesses.filter((b) => b.id !== id);
const after = data.businesses.length;
if (before === after) {
  console.log(JSON.stringify({ ok: false, message: "id not found in registry", id, before }));
  process.exit(1);
}
data.updatedAt = new Date().toISOString();
writeFileSync(file, JSON.stringify(data));
console.log(JSON.stringify({ ok: true, id, removed: before - after, count: after }));
