import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSync } from 'oxc-parser';
import { SourceMapConsumer } from 'source-map';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data/ground-truth');

interface NodeStats {
  type: string;
  count: number;
}

interface PackageSignature {
  packageName: string;
  nodeDist: Record<string, number>;
  totalNodes: number;
  avgDeclaratorsPerDeclaration: number;
  identifierRatio: number;
  ternaryRatio: number;
  assignmentChainCount: number;
}

async function extractSignature(bundler: string, scenario: string) {
  const bundlePath = path.join(DATA_DIR, bundler, scenario, 'bundle.js');
  const mapPath = bundlePath + '.map';

  const code = await fs.readFile(bundlePath, 'utf-8');
  const mapContent = await fs.readFile(mapPath, 'utf-8');
  const rawMap = JSON.parse(mapContent);

  const result = parseSync('bundle.js', code, { sourceType: 'script' });
  const consumer = await new SourceMapConsumer(rawMap);

  const signatures: Record<string, any> = {};

  const program = result.program;

  function walk(node: any) {
    if (!node || typeof node !== 'object') return;

    if (node.type && node.start !== undefined) {
      const { line, column } = getLineColFromOffset(code, node.start);
      const pos = consumer.originalPositionFor({ line, column });

      if (pos.source) {
        let pkgName = 'unknown';
        const match = pos.source.match(/node_modules\/\.pnpm\/([^/]+)/) || pos.source.match(/node_modules\/([^/]+)/);
        if (match) {
          pkgName = match[1];
        }

        if (!signatures[pkgName]) {
          signatures[pkgName] = { 
            packageName: pkgName, 
            nodeDist: {}, 
            totalNodes: 0,
            declarations: 0,
            declarators: 0,
            identifiers: 0,
            ternaries: 0,
            assignmentChains: 0,
            patterns: {
                typeofGlobal: 0,
                typeofSelf: 0,
                typeofSymbol: 0,
                objectToString: 0
            }
          };
        }
        
        const sig = signatures[pkgName];
        sig.nodeDist[node.type] = (sig.nodeDist[node.type] || 0) + 1;
        sig.totalNodes++;

        if (node.type === 'VariableDeclaration') sig.declarations++;
        if (node.type === 'VariableDeclarator') {
            sig.declarators++;
            if (node.init && node.init.type === 'Identifier') {
                sig.assignmentChains++;
            }
        }
        if (node.type === 'Identifier') sig.identifiers++;
        if (node.type === 'ConditionalExpression') sig.ternaries++;

        // Pattern detection
        if (node.type === 'BinaryExpression' && (node.operator === '===' || node.operator === '==')) {
            const left = code.substring(node.left.start, node.left.end);
            const right = code.substring(node.right.start, node.right.end);
            if (left.includes('typeof global') || right.includes('typeof global')) sig.patterns.typeofGlobal++;
            if (left.includes('typeof self') || right.includes('typeof self')) sig.patterns.typeofSelf++;
        }
        if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
            const arg = code.substring(node.argument.start, node.argument.end);
            if (arg === 'Symbol') sig.patterns.typeofSymbol++;
        }
        if (node.type === 'MemberExpression') {
            const member = code.substring(node.start, node.end);
            if (member.includes('Object.prototype.toString')) sig.patterns.objectToString++;
        }
      }
    }

    for (const key in node) {
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach(walk);
      } else if (typeof child === 'object') {
        walk(child);
      }
    }
  }

  walk(program);
  consumer.destroy();

  // post-process signatures to calculate ratios
  for (const pkgName in signatures) {
      const sig = signatures[pkgName];
      sig.avgDeclaratorsPerDeclaration = sig.declarations > 0 ? sig.declarators / sig.declarations : 0;
      sig.identifierRatio = sig.totalNodes > 0 ? sig.identifiers / sig.totalNodes : 0;
      sig.ternaryRatio = sig.totalNodes > 0 ? sig.ternaries / sig.totalNodes : 0;
      sig.assignmentChainRatio = sig.totalNodes > 0 ? sig.assignmentChains / sig.totalNodes : 0;
      
      // Normalize patterns
      sig.patternRatios = {};
      for (const [p, count] of Object.entries(sig.patterns)) {
          sig.patternRatios[p] = sig.totalNodes > 0 ? (count as number) / sig.totalNodes : 0;
      }
  }

  return signatures;
}

function getLineColFromOffset(code: string, offset: number) {
  const lines = code.substring(0, offset).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length
  };
}

async function main() {
  const allSignatures: Record<string, any> = {};
  
  const bundlers = ['esbuild', 'rollup'];
  const scenarios = ['all-combined', 'lodash-basic', 'moment-basic', 'axios-d3-mixed'];

  for (const bundler of bundlers) {
    for (const scenario of scenarios) {
      try {
        const signatures = await extractSignature(bundler, scenario);
        for (const [pkg, sig] of Object.entries(signatures)) {
          if (pkg === 'unknown') continue;
          
          if (!allSignatures[pkg]) {
            allSignatures[pkg] = { packageName: pkg, versions: {} };
          }
          
          // Normalize
          const normalized: Record<string, number> = {};
          for (const [type, count] of Object.entries(sig.nodeDist)) {
            normalized[type] = count / sig.totalNodes;
          }
          
          allSignatures[pkg].versions[`${bundler}-${scenario}`] = {
            totalNodes: sig.totalNodes,
            nodeDist: normalized,
            avgDeclaratorsPerDeclaration: sig.avgDeclaratorsPerDeclaration,
            identifierRatio: sig.identifierRatio,
            ternaryRatio: sig.ternaryRatio,
            assignmentChainRatio: sig.assignmentChainRatio,
            patternRatios: sig.patternRatios
          };
        }
      } catch (e) {
        console.warn(`Skipping ${bundler}/${scenario}`);
      }
    }
  }

  const outPath = path.join(ROOT, 'data/fingerprints.json');
  await fs.writeFile(outPath, JSON.stringify(allSignatures, null, 2));
  console.log(`Saved fingerprints to ${outPath}`);
}

main().catch(console.error);
