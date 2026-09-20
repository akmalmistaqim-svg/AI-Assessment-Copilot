import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const srcDir = path.resolve(__dirname, "../src");

export function createTestRunner(suiteName) {
  let passed = 0;
  let failed = 0;
  console.log(`=== ${suiteName} ===`);

  return {
    test(name, fn) {
      try {
        fn();
        console.log(`  [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  [FAIL] ${name}:`, err.message);
        failed++;
      }
    },
    summary() {
      console.log(`\nHasil: ${passed} passed, ${failed} failed`);
      return { passed, failed };
    },
  };
}

export function assertRouteHasStandardPages(routeSubPath, label = routeSubPath) {
  const baseDir = path.join(srcDir, "app", routeSubPath);
  assert(fs.existsSync(path.join(baseDir, "page.tsx")), `page.tsx ${label} harus ada`);
  assert(fs.existsSync(path.join(baseDir, "loading.tsx")), `loading.tsx ${label} harus ada`);
  assert(fs.existsSync(path.join(baseDir, "error.tsx")), `error.tsx ${label} harus ada`);
}
