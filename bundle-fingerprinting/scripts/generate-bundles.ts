import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BundlerLib, type Scenario } from './bundler-lib.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');
const TEMP_DIR = path.join(ROOT, 'data/temp');

const scenarios: Scenario[] = [
  {
    name: 'lodash-basic',
    entryCode: 'import { zip, chunk } from "lodash-es"; console.log(zip([1, 2], [3, 4]), chunk([1, 2, 3, 4], 2));'
  },
  {
    name: 'moment-basic',
    entryCode: 'import moment from "moment"; console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));'
  },
  {
    name: 'axios-d3-mixed',
    entryCode: 'import axios from "axios"; import * as d3 from "d3"; console.log(axios.VERSION, d3.version);'
  },
  {
    name: 'all-combined',
    entryCode: `
      import { zip } from "lodash-es";
      import moment from "moment";
      import axios from "axios";
      import * as d3 from "d3";
      console.log(zip([1, 2], [3, 4]), moment().calendar(), axios.name, d3.select("body"));
    `
  }
];

async function main() {
  console.log('Starting ground truth generation with BundlerLib...');
  const lib = new BundlerLib(DATA_DIR, TEMP_DIR);
  await lib.ensureDirs();

  for (const scenario of scenarios) {
    console.log(`\n--- Scenario: ${scenario.name} ---`);
    try { await lib.bundleWithEsbuild(scenario); } catch (e) { console.error('[esbuild] ❌', e); }
    try { await lib.bundleWithRollup(scenario); } catch (e) { console.error('[rollup] ❌', e); }
    try { await lib.bundleWithWebpack(scenario, 'terser'); } catch (e) { console.error('[webpack-terser] ❌', e); }
    try { await lib.bundleWithWebpack(scenario, 'swc'); } catch (e) { console.error('[webpack-swc] ❌', e); }
    
    try {
        const unminifiedEsnext = await lib.bundleUnminified(scenario, 'esnext');
        await lib.minifyWithSWC(scenario, unminifiedEsnext);
    } catch (e) { console.error('[swc-standalone] ❌', e); }
    
    try {
        const unminifiedEs5 = await lib.bundleUnminified(scenario, 'es5');
        await lib.minifyWithUglifyJS(scenario, unminifiedEs5);
    } catch (e) { console.error('[uglifyjs-standalone] ❌', e); }
  }

  console.log('\nGround truth generation complete.');
}

main().catch(console.error);
