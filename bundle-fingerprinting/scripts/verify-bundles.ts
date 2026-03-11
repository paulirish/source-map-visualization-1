import fs from 'node:fs/promises';
import path from 'node:path';
import { SourceMapConsumer } from 'source-map';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');

async function verifyBundle(bundler: string, scenario: string) {
  const bundlePath = path.join(DATA_DIR, bundler, scenario, 'bundle.js');
  const mapPath = bundlePath + '.map';

  try {
    const bundleContent = await fs.readFile(bundlePath, 'utf-8');
    const mapContent = await fs.readFile(mapPath, 'utf-8');
    const rawMap = JSON.parse(mapContent);

    // SourceMapConsumer needs to be initialized
    // Note: some versions of source-map are async, others sync.
    // 0.7.x is async.
    const consumer = await new SourceMapConsumer(rawMap);

    console.log(`\n--- Verification: ${bundler} / ${scenario} ---`);
    console.log(`Bundle size: ${(bundleContent.length / 1024).toFixed(2)} KB`);

    // Sample a few locations in the bundle to see where they map
    const lines = bundleContent.split('\n');
    // For minified bundles, line 1 is usually the big one
    const lineToSample = lines[0].length > 100 ? 1 : Math.min(lines.length, 5);
    const lineContent = lines[lineToSample - 1];

    // Sample at 10%, 50%, 90% of the line length
    const columns = [
      Math.floor(lineContent.length * 0.1),
      Math.floor(lineContent.length * 0.5),
      Math.floor(lineContent.length * 0.9)
    ];

    for (const col of columns) {
      const pos = consumer.originalPositionFor({ line: lineToSample, column: col });
      console.log(`Col ${col} maps to: ${pos.source} (line ${pos.line}, name: ${pos.name})`);
    }

    consumer.destroy();
  } catch (err) {
    console.error(`Failed to verify ${bundler}/${scenario}:`, err);
  }
}

async function main() {
  const bundlers = await fs.readdir(DATA_DIR);
  for (const bundler of bundlers) {
    const bundlerPath = path.join(DATA_DIR, bundler);
    if (!(await fs.stat(bundlerPath)).isDirectory()) continue;

    const scenarios = await fs.readdir(bundlerPath);
    for (const scenario of scenarios) {
      await verifyBundle(bundler, scenario);
    }
  }
}

main().catch(console.error);
