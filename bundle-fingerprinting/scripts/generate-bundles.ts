import esbuild from 'esbuild';
import { rollup } from 'rollup';
// @ts-expect-error - resolution issues
import resolve from '@rollup/plugin-node-resolve';
// @ts-expect-error - resolution issues
import commonjs from '@rollup/plugin-commonjs';
// @ts-expect-error - resolution issues
import terser from '@rollup/plugin-terser';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error - resolution issues
import webpack from 'webpack';
// @ts-expect-error - resolution issues
import TerserPlugin from 'terser-webpack-plugin';
import swc from '@swc/core';
import UglifyJS from 'uglify-js';

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
}

async function bundleWithRollup(scenario: Scenario) {
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
}

async function bundleWithWebpack(scenario: Scenario, minifier: 'terser' | 'swc') {
  const outDir = path.join(DATA_DIR, `webpack-${minifier}`, scenario.name);
  await fs.mkdir(outDir, { recursive: true });

  const entryPath = path.join(TEMP_DIR, `${scenario.name}-webpack-${minifier}.ts`);
  await fs.writeFile(entryPath, scenario.entry);

  const compiler = webpack({
    mode: 'production',
    entry: entryPath,
    output: {
      path: outDir,
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                },
              },
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        "util": false,
        "path": false,
        "fs": false,
        "os": false,
        "http": false,
        "https": false,
        "zlib": false,
        "stream": false,
        "url": false,
        "buffer": false,
        "querystring": false,
        "crypto": false,
      }
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: minifier === 'swc' ? TerserPlugin.swcMinify : TerserPlugin.terserMinify,
        }),
      ],
    },
  });

  await new Promise<void>((resolve, reject) => {
    compiler.run((err: any, stats: any) => {
      if (err || stats?.hasErrors()) {
        const error = err || stats?.toJson().errors;
        console.error(`[webpack-${minifier}] ❌ Failed to bundle ${scenario.name}`, error);
        reject(error);
        return;
      }
      compiler.close(() => resolve());
    });
  });

  console.log(`[webpack-${minifier}] ✅ Bundled ${scenario.name}`);
}

async function bundleUnminified(scenario: Scenario, target: 'esnext' | 'es5' = 'esnext'): Promise<string> {
  const outDir = path.join(TEMP_DIR, `unminified-${target}`, scenario.name);
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'bundle.js');
  
  const entryPath = path.join(TEMP_DIR, `${scenario.name}-unminified-${target}.ts`);
  await fs.writeFile(entryPath, scenario.entry);

  await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    minify: false,
    sourcemap: true,
    outfile: outFile,
    platform: 'browser',
    target: 'es2020', // Always use a modern target for esbuild
  });

  if (target === 'es5') {
    const code = await fs.readFile(outFile, 'utf8');
    const inputMap = await fs.readFile(outFile + '.map', 'utf8');
    const transformed = await swc.transform(code, {
      jsc: {
        target: 'es5',
      },
      sourceMaps: true,
      inputSourceMap: inputMap,
    });
    await fs.writeFile(outFile, transformed.code);
    if (transformed.map) {
        await fs.writeFile(outFile + '.map', transformed.map);
    }
  }

  return outFile;
}

async function minifyWithSWC(scenario: Scenario, inputPath: string) {
  const outDir = path.join(DATA_DIR, 'swc-standalone', scenario.name);
  await fs.mkdir(outDir, { recursive: true });
  
  const code = await fs.readFile(inputPath, 'utf-8');

  const inputMap = await fs.readFile(inputPath + '.map', 'utf-8');

  const output = await swc.transform(code, {
    minify: true,
    jsc: {
      minify: {
        compress: true,
        mangle: true
      }
    },
    sourceMaps: true,
    inputSourceMap: inputMap
  });

  await fs.writeFile(path.join(outDir, 'bundle.js'), output.code);
  if (output.map) {
    await fs.writeFile(path.join(outDir, 'bundle.js.map'), output.map);
  }

  console.log(`[swc-standalone] ✅ Minified ${scenario.name}`);
}

async function minifyWithUglifyJS(scenario: Scenario, inputPath: string) {
  const outDir = path.join(DATA_DIR, 'uglifyjs-standalone', scenario.name);
  await fs.mkdir(outDir, { recursive: true });

  const code = await fs.readFile(inputPath, 'utf-8');
  
  const inputMap = await fs.readFile(inputPath + '.map', 'utf-8');
  
  const result = UglifyJS.minify(code, {
    sourceMap: {
      content: inputMap,
      filename: 'bundle.js',
      url: 'bundle.js.map'
    }
  });

  if (result.error) {
      console.error(`[uglifyjs-standalone] ❌ Failed to minify ${scenario.name}`, result.error);
      throw result.error;
  }

  await fs.writeFile(path.join(outDir, 'bundle.js'), result.code);
  if (result.map) {
    await fs.writeFile(path.join(outDir, 'bundle.js.map'), result.map);
  }

  console.log(`[uglifyjs-standalone] ✅ Minified ${scenario.name}`);
}

async function main() {
  console.log('Starting ground truth generation...');
  await ensureDirs();

  for (const scenario of scenarios) {
    console.log(`\n--- Scenario: ${scenario.name} ---`);
    try { await bundleWithEsbuild(scenario); } catch (e) {}
    try { await bundleWithRollup(scenario); } catch (e) {}
    try { await bundleWithWebpack(scenario, 'terser'); } catch (e) {}
    try { await bundleWithWebpack(scenario, 'swc'); } catch (e) {}
    
    try {
        const unminifiedEsnext = await bundleUnminified(scenario, 'esnext');
        await minifyWithSWC(scenario, unminifiedEsnext);
    } catch (e) {
        console.error(`[swc-standalone] ❌ Failed scenario ${scenario.name}`, e);
    }
    
    try {
        const unminifiedEs5 = await bundleUnminified(scenario, 'es5');
        await minifyWithUglifyJS(scenario, unminifiedEs5);
    } catch (e) {
        console.error(`[uglifyjs-standalone] ❌ Failed scenario ${scenario.name}`, e);
    }
  }

  console.log('\nGround truth generation complete.');
}

main().catch(console.error);
