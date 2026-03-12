import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error - local import
import { matchBundle } from './match-bundle.ts';
// @ts-expect-error - local import
import { verifyPredictions } from './verification-runner.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');

async function benchmark() {
  const bundlers = await fs.readdir(DATA_DIR);
  const results: any[] = [];

  for (const bundler of bundlers) {
    const bundlerPath = path.join(DATA_DIR, bundler);
    if (!(await fs.stat(bundlerPath)).isDirectory()) continue;

    const scenarios = await fs.readdir(bundlerPath);
    for (const scenario of scenarios) {
      const bundleFile = path.join(bundlerPath, scenario, 'bundle.js');
      console.log(`\nBenchmarking ${bundler} / ${scenario}...`);
      
      try {
        const predictions = await matchBundle(bundleFile);
        const reportMap = await verifyPredictions(bundler, scenario, predictions.map((p: any) => ({
          pkg: p.pkg.split('@')[0],
          start: p.start,
          end: p.end
        })));
        
        const reportItems = Object.values(reportMap);
        const totalAccuracy = reportItems.length > 0 
            ? reportItems.reduce((acc: number, r: any) => acc + r.accuracy, 0) / reportItems.length 
            : 0;

        results.push({
          bundler,
          scenario,
          accuracy: totalAccuracy,
          packagesFound: reportItems.filter((r: any) => r.found).length,
          falsePositives: reportItems.filter((r: any) => r.falsePositives > 0).length
        });
      } catch (e) {
        console.error(`Failed ${bundler}/${scenario}`, e);
      }
    }
  }

  console.log('\n--- Final Benchmark Results ---');
  console.table(results);
  
  const globalAccuracy = results.reduce((acc, r) => acc + r.accuracy, 0) / results.length;
  console.log(`\nGlobal Average Accuracy: ${(globalAccuracy * 100).toFixed(2)}%`);
}

benchmark().catch(console.error);
