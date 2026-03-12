import fs from 'node:fs/promises';
import path from 'node:path';
import { SourceMapConsumer } from 'source-map';
import { fileURLToPath } from 'node:url';
import { matchBundle } from './match-bundle.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

interface VerificationResult {
  packageName: string;
  found: boolean;
  accuracy: number;
  falsePositives: number;
}

export async function runFullVerification(bundlePath: string) {
  const mapPath = bundlePath + '.map';
  const code = await fs.readFile(bundlePath, 'utf-8');
  const mapContent = await fs.readFile(mapPath, 'utf-8');
  const rawMap = JSON.parse(mapContent);
  const consumer = await new SourceMapConsumer(rawMap);

  console.log(`🔍 Verification for: ${bundlePath}`);
  const predictions = await matchBundle(bundlePath);
  const results: Record<string, VerificationResult> = {};

  for (const pred of predictions) {
    if (!results[pred.pkg]) {
      results[pred.pkg] = { packageName: pred.pkg, found: false, accuracy: 0, falsePositives: 0 };
    }

    const offsets = [
        pred.start, 
        Math.floor((pred.start + pred.end) / 2),
        Math.min(pred.end, pred.start + 100),
        Math.max(pred.start, pred.end - 10)
    ];

    let foundInThisRange = false;
    for (const offset of offsets) {
        const lines = code.substring(0, offset).split('\n');
        const pos = consumer.originalPositionFor({ line: lines.length, column: lines[lines.length - 1].length });

        if (pos.source) {
           const match = pos.source.match(/node_modules\/\.pnpm\/([^/]+)/) || pos.source.match(/node_modules\/([^/]+)/);
           const actualPkg = match ? match[1] : 'unknown';
           
           if (actualPkg.toLowerCase().includes(pred.pkg.toLowerCase()) || pred.pkg.toLowerCase().includes(actualPkg.toLowerCase())) {
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const target = process.argv[2];
    if (!target) {
        console.error('Usage: node scripts/verification-runner.ts <path/to/bundle.js>');
        process.exit(1);
    }
    runFullVerification(target).then(res => {
        console.log('\n--- Accuracy Report ---');
        console.table(res);
    }).catch(console.error);
}
