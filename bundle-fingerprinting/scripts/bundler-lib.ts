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
// @ts-expect-error - resolution issues
import webpack from 'webpack';
// @ts-expect-error - resolution issues
import TerserPlugin from 'terser-webpack-plugin';
import swc from '@swc/core';
import UglifyJS from 'uglify-js';

export interface Scenario {
  name: string;
  entryCode: string;
}

export class BundlerLib {
  private dataDir: string;
  private tempDir: string;

  constructor(dataDir: string, tempDir: string) {
    this.dataDir = dataDir;
    this.tempDir = tempDir;
  }

  async ensureDirs() {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  async bundleWithEsbuild(scenario: Scenario) {
    const outDir = path.join(this.dataDir, 'esbuild', scenario.name);
    await fs.mkdir(outDir, { recursive: true });

    const entryPath = path.join(this.tempDir, `${scenario.name}-esbuild.ts`);
    await fs.writeFile(entryPath, scenario.entryCode);

    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: path.join(outDir, 'bundle.js'),
      platform: 'browser',
      target: 'esnext',
    });
  }

  async bundleWithRollup(scenario: Scenario) {
    const outDir = path.join(this.dataDir, 'rollup', scenario.name);
    await fs.mkdir(outDir, { recursive: true });

    const entryPath = path.join(this.tempDir, `${scenario.name}-rollup.ts`);
    await fs.writeFile(entryPath, scenario.entryCode);

    const bundle = await rollup({
      input: entryPath,
      plugins: [
        // @ts-expect-error - resolution issues
        resolve({ browser: true, preferBuiltins: false }),
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
  }

  async bundleWithWebpack(scenario: Scenario, minifier: 'terser' | 'swc') {
    const outDir = path.join(this.dataDir, `webpack-${minifier}`, scenario.name);
    await fs.mkdir(outDir, { recursive: true });

    const entryPath = path.join(this.tempDir, `${scenario.name}-webpack-${minifier}.ts`);
    await fs.writeFile(entryPath, scenario.entryCode);

    const compiler = webpack({
      mode: 'production',
      entry: entryPath,
      output: { path: outDir, filename: 'bundle.js' },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.[jt]s$/,
          use: {
            loader: 'swc-loader',
            options: { jsc: { parser: { syntax: 'typescript' } } },
          },
        }],
      },
      resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
          "util": false, "path": false, "fs": false, "os": false, "http": false,
          "https": false, "zlib": false, "stream": false, "url": false, "buffer": false,
          "querystring": false, "crypto": false,
        }
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          minify: minifier === 'swc' ? TerserPlugin.swcMinify : TerserPlugin.terserMinify,
        })],
      },
    });

    await new Promise<void>((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          reject(err || stats?.toJson().errors);
          return;
        }
        compiler.close(() => resolve());
      });
    });
  }

  async bundleUnminified(scenario: Scenario, target: 'esnext' | 'es5' = 'esnext'): Promise<string> {
    const outDir = path.join(this.tempDir, `unminified-${target}`, scenario.name);
    await fs.mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, 'bundle.js');
    
    const entryPath = path.join(this.tempDir, `${scenario.name}-unminified-${target}.ts`);
    await fs.writeFile(entryPath, scenario.entryCode);

    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      minify: false,
      sourcemap: true,
      outfile: outFile,
      platform: 'browser',
      target: 'es2020',
    });

    if (target === 'es5') {
      const code = await fs.readFile(outFile, 'utf8');
      const inputMap = await fs.readFile(outFile + '.map', 'utf8');
      const transformed = await swc.transform(code, {
        jsc: { target: 'es5' },
        sourceMaps: true,
        inputSourceMap: inputMap,
      });
      await fs.writeFile(outFile, transformed.code);
      if (transformed.map) await fs.writeFile(outFile + '.map', transformed.map);
    }

    return outFile;
  }

  async minifyWithSWC(scenario: Scenario, inputPath: string) {
    const outDir = path.join(this.dataDir, 'swc-standalone', scenario.name);
    await fs.mkdir(outDir, { recursive: true });
    const code = await fs.readFile(inputPath, 'utf-8');
    const inputMap = await fs.readFile(inputPath + '.map', 'utf-8');

    const output = await swc.transform(code, {
      minify: true,
      jsc: { minify: { compress: true, mangle: true } },
      sourceMaps: true,
      inputSourceMap: inputMap
    });

    await fs.writeFile(path.join(outDir, 'bundle.js'), output.code);
    if (output.map) await fs.writeFile(path.join(outDir, 'bundle.js.map'), output.map);
  }

  async minifyWithUglifyJS(scenario: Scenario, inputPath: string) {
    const outDir = path.join(this.dataDir, 'uglifyjs-standalone', scenario.name);
    await fs.mkdir(outDir, { recursive: true });
    const code = await fs.readFile(inputPath, 'utf-8');
    const inputMap = await fs.readFile(inputPath + '.map', 'utf-8');
    
    const result = UglifyJS.minify(code, {
      sourceMap: { content: inputMap, filename: 'bundle.js', url: 'bundle.js.map' }
    });

    if (result.error) throw result.error;

    await fs.writeFile(path.join(outDir, 'bundle.js'), result.code);
    if (result.map) await fs.writeFile(path.join(outDir, 'bundle.js.map'), result.map as string);
  }
}
