import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSync } from 'oxc-parser';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BUNDLE_PATH = path.join(ROOT, 'data/ground-truth/esbuild/lodash-basic/bundle.js');

async function main() {
  const code = await fs.readFile(BUNDLE_PATH, 'utf-8');
  
  console.log('Parsing bundle with oxc-parser...');
  const result = parseSync('bundle.js', code, {
    sourceType: 'script'
  });

  if (result.errors.length > 0) {
    console.error('Parse errors:', result.errors);
    return;
  }

  const ast = result.program;
  console.log('AST parsed successfully.');
  console.log('Number of top-level statements:', ast.body.length);

  // Simple walker or explorer
  // Let's look at the first few statements
  for (let i = 0; i < Math.min(ast.body.length, 5); i++) {
    const node = ast.body[i];
    console.log(`Node ${i}: type=${node.type}`);
    if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
        const call = node.expression;
        console.log(`  CallExpression: callee.type=${call.callee.type}`);
    }
  }

  // To find "fingerprints", we want to look for specific patterns
  // lodash usually has a lot of small functions
  // axios has a lot of class-like structures
  // moment is one giant IIFE usually (in old versions) or a set of modular functions
}

main().catch(console.error);
