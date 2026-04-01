import { readdir, stat } from "node:fs/promises"
import path from "node:path"

const distAssetsDir = path.resolve("dist/assets")
const forbiddenPrefixes = ["pdf-parse-import-", "ribbon-header-"]
const maxAssetBytes = 500 * 1024
const allowedOversizePrefixes = ["pdf.worker.min-"]

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`
}

let names
try {
  names = await readdir(distAssetsDir)
} catch (error) {
  console.error(`[FAIL] Could not read ${distAssetsDir}. Run npm run build first.`)
  process.exit(1)
}

const assets = []
for (const name of names) {
  const fullPath = path.join(distAssetsDir, name)
  const info = await stat(fullPath)
  if (!info.isFile()) continue
  assets.push({ name, size: info.size })
}

assets.sort((a, b) => b.size - a.size)

const forbidden = assets.filter((asset) => forbiddenPrefixes.some((prefix) => asset.name.startsWith(prefix)))
if (forbidden.length > 0) {
  console.error("[FAIL] Forbidden bundle artifacts found:")
  for (const asset of forbidden) {
    console.error(` - ${asset.name} (${formatKiB(asset.size)})`)
  }
  process.exit(1)
}

const oversizeUnexpected = assets.filter(
  (asset) => asset.size > maxAssetBytes && !allowedOversizePrefixes.some((prefix) => asset.name.startsWith(prefix)),
)
if (oversizeUnexpected.length > 0) {
  console.error(`[FAIL] Unexpected asset(s) above ${formatKiB(maxAssetBytes)}:`)
  for (const asset of oversizeUnexpected) {
    console.error(` - ${asset.name} (${formatKiB(asset.size)})`)
  }
  process.exit(1)
}

console.log("[OK] dist bundle check passed")
console.log("Largest assets:")
for (const asset of assets.slice(0, 8)) {
  console.log(` - ${asset.name} (${formatKiB(asset.size)})`)
}
