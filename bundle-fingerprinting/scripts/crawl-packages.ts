import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { BundlerLib } from './bundler-lib.ts';
import { extractSignatureFromBundle } from './extractor-lib.ts';
import { type PackageRecord, type Fingerprint } from './types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CRAWL_WORKSPACE = path.join(ROOT, 'data/temp/crawl-workspace');
const FINGERPRINTS_DIR = path.join(ROOT, 'data/fingerprints');

async function ensureWorkspace() {
  await fs.mkdir(CRAWL_WORKSPACE, { recursive: true });
  try {
    await fs.access(path.join(CRAWL_WORKSPACE, 'package.json'));
  } catch {
    execSync('pnpm init', { cwd: CRAWL_WORKSPACE });
  }
}

async function crawlPackage(pkgName: string) {
  console.log(`\n📦 Crawling ${pkgName}...`);
  
  // 1. Install
  try {
    execSync(`pnpm add ${pkgName} --save-dev`, { cwd: CRAWL_WORKSPACE, stdio: 'inherit' });
  } catch (e) {
    console.error(`❌ Failed to install ${pkgName}`);
    return;
  }

  // 2. Bundle 
  const bundleDir = path.join(CRAWL_WORKSPACE, 'dist', pkgName);
  const tempDir = path.join(CRAWL_WORKSPACE, 'temp', pkgName);
  const lib = new BundlerLib(bundleDir, tempDir);
  await lib.ensureDirs();

  // Try to find reasonable entry point
  const pkgJson = JSON.parse(await fs.readFile(path.join(CRAWL_WORKSPACE, 'node_modules', pkgName, 'package.json'), 'utf-8'));
  const version = pkgJson.version;
  const entryCode = `import pkg from "${pkgName}"; console.log(pkg);`;
  const scenario = { name: 'default', entryCode };

  console.log(`  - Bundling ${pkgName}@${version}...`);
  const drivers: string[] = [];
  
  const attempt = async (name: string, fn: () => Promise<void>) => {
    try { await fn(); drivers.push(name); } catch (e) { console.error(`    [${name}] ❌`, e); }
  };

  await attempt('esbuild', () => lib.bundleWithEsbuild(scenario));
  await attempt('rollup', () => lib.bundleWithRollup(scenario));
  await attempt('webpack-terser', () => lib.bundleWithWebpack(scenario, 'terser'));
  await attempt('webpack-swc', () => lib.bundleWithWebpack(scenario, 'swc'));
  
  const unminified = await lib.bundleUnminified(scenario, 'esnext');
  await attempt('swc-standalone', () => lib.minifyWithSWC(scenario, unminified));
  
  const unminifiedEs5 = await lib.bundleUnminified(scenario, 'es5');
  await attempt('uglifyjs-standalone', () => lib.minifyWithUglifyJS(scenario, unminifiedEs5));

  // 3. Extract
  const record: PackageRecord = { packageName: pkgName, versions: {} };
  
  for (const driver of drivers) {
    const bPath = path.join(bundleDir, driver, 'default', 'bundle.js');
    const mPath = bPath + '.map';
    try {
      const signatures = await extractSignatureFromBundle(bPath, mPath);
      // Find the specific package in the signatures (source mapping might be messy)
      const matches = Object.keys(signatures).filter(k => k.includes(pkgName));
      if (matches.length > 0) {
        const sig = signatures[matches[0]];
        const normalized: Record<string, number> = {};
        for (const [type, count] of Object.entries((sig as any).nodeDist)) {
          normalized[type] = (count as number) / (sig as any).totalNodes;
        }

        record.versions[`${driver}-default-${version}`] = {
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
      console.warn(`    [${driver}] ❌ Extraction failed`);
    }
  }

  // 4. Save
  if (Object.keys(record.versions).length > 0) {
    const fileName = pkgName.replace(/\//g, '__').replace(/@/g, '_at_');
    const outPath = path.join(FINGERPRINTS_DIR, `${fileName}.json`);
    
    // Merge with existing if exists
    let finalRecord = record;
    try {
        const existing = JSON.parse(await fs.readFile(outPath, 'utf-8'));
        finalRecord.versions = { ...existing.versions, ...record.versions };
    } catch {}

    await fs.writeFile(outPath, JSON.stringify(finalRecord, null, 2));
    console.log(`✅ Saved fingerprints for ${pkgName} to ${outPath}`);
  } else {
    console.error(`❌ No valid signatures found for ${pkgName}`);
  }
}

async function main() {
  const packages = process.argv.slice(2);
  if (packages.length === 0) {
    console.error('Usage: node scripts/crawl-packages.ts <package1> <package2> ...');
    process.exit(1);
  }

  await ensureWorkspace();
  await fs.mkdir(FINGERPRINTS_DIR, { recursive: true });

  for (const pkg of packages) {
    await crawlPackage(pkg);
  }
}

main().catch(console.error);
