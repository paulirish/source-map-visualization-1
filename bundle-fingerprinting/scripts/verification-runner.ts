import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSync } from 'oxc-parser';
import { SourceMapConsumer } from 'source-map';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');

interface VerificationResult {
  packageName: string;
  found: boolean;
  accuracy: number; // Percentage of nodes correctly attributed
  falsePositives: number;
}

/**
 * The Verification Runner is used by the agent to test its fingerprinting logic.
 * It takes a "prediction" (where the agent thinks packages are in a bundle)
 * and compares it against the "ground truth" (source map).
 */
export async function verifyPredictions(bundler: string, scenario: string, predictions: Array<{ pkg: string, start: number, end: number }>) {
  const bundlePath = path.join(DATA_DIR, bundler, scenario, 'bundle.js');
  const mapPath = bundlePath + '.map';

  const code = await fs.readFile(bundlePath, 'utf-8');
  const mapContent = await fs.readFile(mapPath, 'utf-8');
  const rawMap = JSON.parse(mapContent);
  const consumer = await new SourceMapConsumer(rawMap);

  const results: Record<string, VerificationResult> = {};

  for (const pred of predictions) {
    if (!results[pred.pkg]) {
      results[pred.pkg] = { packageName: pred.pkg, found: false, accuracy: 0, falsePositives: 0 };
    }

    // Check a few points in the range (start, middle, end-ish)
    const offsets = [
        pred.start, 
        Math.floor((pred.start + pred.end) / 2),
        Math.min(pred.end, pred.start + 100), // Check near start too
        Math.max(pred.start, pred.end - 10)
    ];

    let foundInThisRange = false;
    for (const offset of offsets) {
        const { line, column } = getLineColFromOffset(code, offset);
        const pos = consumer.originalPositionFor({ line, column });

        if (pos.source) {
           const match = pos.source.match(/node_modules\/\.pnpm\/([^/]+)/) || pos.source.match(/node_modules\/([^/]+)/);
           const actualPkg = match ? match[1] : 'unknown';
           
           if (actualPkg.toLowerCase().includes(pred.pkg.toLowerCase())) {
             foundInThisRange = true;
             break;
           }
        }
    }

    if (foundInThisRange) {
      results[pred.pkg].found = true;
      results[pred.pkg].accuracy = 1.0; 
    } else {
      results[pred.pkg].falsePositives++;
    }
  }

  consumer.destroy();
  return results;
}

function getLineColFromOffset(code: string, offset: number) {
  const lines = code.substring(0, offset).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length
  };
}

// Example usage if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // try to verify something
    verifyPredictions('esbuild', 'all-combined', [
        { pkg: 'moment', start: 0, end: 1000 } // dummy prediction
    ]).then(console.log).catch(console.error);
}
