import esbuild from 'esbuild';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');
const TEMP_DIR = path.join(ROOT, 'data/temp');

interface Scenario {
  name: string;
  entry: string;
}

const scenarios: Scenario[] = [
  {
    name: 'lodash-basic',
    entry: 'import { zip, chunk } from "lodash-es"; console.log(zip([1, 2], [3, 4]), chunk([1, 2, 3, 4], 2));'
  },
  {
    name: 'moment-basic',
    entry: 'import moment from "moment"; console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));'
  },
  {
    name: 'axios-d3-mixed',
    entry: 'import axios from "axios"; import * as d3 from "d3"; console.log(axios.VERSION, d3.version);'
  },
  {
    name: 'all-combined',
    entry: `
      import { zip } from "lodash-es";
      import moment from "moment";
      import axios from "axios";
      import * as d3 from "d3";
      console.log(zip([1, 2], [3, 4]), moment().calendar(), axios.name, d3.select("body"));
    `
  }
];

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(TEMP_DIR, { recursive: true });
}

async function bundleWithEsbuild(scenario: Scenario) {
  try {
    const outDir = path.join(DATA_DIR, 'esbuild', scenario.name);
    await fs.mkdir(outDir, { recursive: true });

    const entryPath = path.join(TEMP_DIR, `${scenario.name}-esbuild.ts`);
    await fs.writeFile(entryPath, scenario.entry);

    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: path.join(outDir, 'bundle.js'),
      platform: 'browser',
      target: 'esnext',
    });

    console.log(`[esbuild] ✅ Bundled ${scenario.name}`);
  } catch (err) {
    console.error(`[esbuild] ❌ Failed to bundle ${scenario.name}:`, err);
  }
}

async function bundleWithRollup(scenario: Scenario) {
  try {
    const outDir = path.join(DATA_DIR, 'rollup', scenario.name);
    await fs.mkdir(outDir, { recursive: true });

    const entryPath = path.join(TEMP_DIR, `${scenario.name}-rollup.ts`);
    await fs.writeFile(entryPath, scenario.entry);

    const bundle = await rollup({
      input: entryPath,
      plugins: [
        // @ts-expect-error - resolution issues
        resolve({
          browser: true,
          preferBuiltins: false
        }),
        // @ts-expect-error - resolution issues
        commonjs(),
        // @ts-expect-error - resolution issues
        terser()
      ]
    });

    await bundle.write({
      file: path.join(outDir, 'bundle.js'),
      format: 'iife',
      sourcemap: true,
      name: 'Bundle'
    });

    console.log(`[rollup]  ✅ Bundled ${scenario.name}`);
  } catch (err) {
    console.error(`[rollup]  ❌ Failed to bundle ${scenario.name}:`, err);
  }
}

async function main() {
  console.log('Starting ground truth generation...');
  await ensureDirs();

  for (const scenario of scenarios) {
    console.log(`\n--- Scenario: ${scenario.name} ---`);
    await bundleWithEsbuild(scenario);
    await bundleWithRollup(scenario);
  }

  console.log('\nGround truth generation complete.');
}

main().catch(console.error);
