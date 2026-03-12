import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSignatureFromBundle } from './extractor-lib.ts';
import { type PackageRecord } from './types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');

async function main() {
  const allSignatures: Record<string, PackageRecord> = {};
  
  const bundlers = await fs.readdir(DATA_DIR);
  
  // Dynamically find scenarios by looking at folders in the first bundler
  const firstBundler = bundlers.find(b => !b.startsWith('.'));
  if (!firstBundler) return;
  const scenarios = await fs.readdir(path.join(DATA_DIR, firstBundler));

  for (const bundler of bundlers) {
    if (bundler.startsWith('.')) continue;
    for (const scenario of scenarios) {
      if (scenario.startsWith('.')) continue;
      try {
        const bundlePath = path.join(DATA_DIR, bundler, scenario, 'bundle.js');
        const mapPath = bundlePath + '.map';
        const signatures = await extractSignatureFromBundle(bundlePath, mapPath);
        
        for (const [pkg, sig] of Object.entries(signatures)) {
          if (pkg === 'unknown') continue;
          
          if (!allSignatures[pkg]) {
            allSignatures[pkg] = { packageName: pkg, versions: {} };
          }
          
          const normalized: Record<string, number> = {};
          for (const [type, count] of Object.entries((sig as any).nodeDist)) {
            normalized[type] = (count as number) / (sig as any).totalNodes;
          }
          
          allSignatures[pkg].versions[`${bundler}-${scenario}`] = {
            totalNodes: (sig as any).totalNodes,
            nodeDist: normalized,
            avgDeclaratorsPerDeclaration: (sig as any).avgDeclaratorsPerDeclaration,
            identifierRatio: (sig as any).identifierRatio,
            ternaryRatio: (sig as any).ternaryRatio,
            assignmentChainRatio: (sig as any).assignmentChainRatio,
            patternRatios: (sig as any).patternRatios,
            anchors: (sig as any).anchors
          };
        }
      } catch (e) {
        console.warn(`Skipping ${bundler}/${scenario}`);
      }
    }
  }

  const fingerprintsDir = path.join(ROOT, 'data/fingerprints');
  await fs.mkdir(fingerprintsDir, { recursive: true });

  for (const [pkg, data] of Object.entries(allSignatures)) {
      const fileName = pkg.replace(/\//g, '__').replace(/@/g, '_at_');
      const outPath = path.join(fingerprintsDir, `${fileName}.json`);
      await fs.writeFile(outPath, JSON.stringify(data, null, 2));
      console.log(`Saved fingerprints for ${pkg} to ${outPath}`);
  }
}

main().catch(console.error);
