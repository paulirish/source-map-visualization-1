import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { BundlerLib } from './bundler-lib.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const COMPLEX_WORKSPACE = path.join(ROOT, 'data/temp/complex-workspace');

async function setup() {
    await fs.mkdir(COMPLEX_WORKSPACE, { recursive: true });
    try {
        await fs.access(path.join(COMPLEX_WORKSPACE, 'package.json'));
    } catch {
        execSync('pnpm init', { cwd: COMPLEX_WORKSPACE });
    }
    
    console.log('📦 Installing dependencies for Chaos Bundle...');
    // We want a mix of UI, utils, and data libs
    execSync('pnpm add react react-dom lodash-es d3-selection axios moment --save-dev', { cwd: COMPLEX_WORKSPACE, stdio: 'inherit' });
}

async function buildChaosBundle() {
    const bundleDir = path.join(ROOT, 'data/ground-truth/complex/chaos');
    const tempDir = path.join(COMPLEX_WORKSPACE, 'temp');
    const lib = new BundlerLib(bundleDir, tempDir);
    await lib.ensureDirs();

    const scenario = {
        name: 'chaos-1',
        entryCode: `
            import React from 'react';
            import { select } from 'd3-selection';
            import _ from 'lodash-es';
            import axios from 'axios';
            import moment from 'moment';

            console.log("System initialization...");
            const data = _.map([1, 2, 3], x => x * 2);
            select('body').append('div').text('React Version: ' + React.version);
            axios.get('/api').then(res => console.log(res.data));
            console.log('Today is: ' + moment().format('LL'));
        `
    };

    console.log('🚀 Building Chaos Bundle (Matrix)...');
    
    // Build across common drivers
    await lib.bundleWithEsbuild(scenario);
    await lib.bundleWithRollup(scenario);
    await lib.bundleWithWebpack(scenario, 'terser');
    
    const unminified = await lib.bundleUnminified(scenario, 'esnext');
    await lib.minifyWithSWC(scenario, unminified);

    console.log('✅ Chaos Bundles generated in data/ground-truth/complex/chaos');
}

async function main() {
    await setup();
    await buildChaosBundle();
}

main().catch(console.error);
