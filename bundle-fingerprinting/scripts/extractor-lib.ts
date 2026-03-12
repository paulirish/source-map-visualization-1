import fs from 'node:fs/promises';
import { parseSync } from 'oxc-parser';
import { SourceMapConsumer } from 'source-map';
import { type PackageSignatureRaw } from './types.ts';

export async function extractSignatureFromBundle(bundlePath: string, mapPath: string): Promise<Record<string, PackageSignatureRaw>> {
  const code = await fs.readFile(bundlePath, 'utf-8');
  const mapContent = await fs.readFile(mapPath, 'utf-8');
  const rawMap = JSON.parse(mapContent);

  const result = parseSync('bundle.js', code, { sourceType: 'script' });
  const consumer = await new SourceMapConsumer(rawMap);
  const program = result.program;

  const signatures: Record<string, any> = {};

  function walk(node: any) {
    if (!node || typeof node !== 'object') return;
    if (node.type && node.start !== undefined) {
      const offset = node.start;
      const lines = code.substring(0, offset).split('\n');
      const pos = consumer.originalPositionFor({ 
          line: lines.length, 
          column: lines[lines.length - 1].length 
      });

      if (pos.source) {
        let pkgName = 'unknown';
        const match = pos.source.match(/node_modules\/\.pnpm\/([^/]+)/) || pos.source.match(/node_modules\/([^/]+)/);
        if (match) pkgName = match[1];

        if (!signatures[pkgName]) {
          signatures[pkgName] = { 
            packageName: pkgName, nodeDist: {}, totalNodes: 0,
            declarations: 0, declarators: 0, identifiers: 0, ternaries: 0, assignmentChains: 0,
            patterns: { typeofGlobal: 0, typeofSelf: 0, typeofSymbol: 0, objectToString: 0 },
            anchors: new Set<string>()
          };
        }
        
        const sig = signatures[pkgName];
        sig.nodeDist[node.type] = (sig.nodeDist[node.type] || 0) + 1;
        sig.totalNodes++;
        if (node.type === 'VariableDeclaration') sig.declarations++;
        if (node.type === 'VariableDeclarator') {
            sig.declarators++;
            if (node.init && node.init.type === 'Identifier') sig.assignmentChains++;
        }
        if (node.type === 'Identifier') sig.identifiers++;
        if (node.type === 'ConditionalExpression') sig.ternaries++;

        // --- Semantic Anchors ---
        if (node.type === 'Literal') {
            const val = String(node.value);
            // Heuristic for "Uniqueness": Long-ish strings, or very specific short ones
            if (val.length > 5 || /^[A-Z_]+$/.test(val)) {
                sig.anchors.add(val);
            }
        }
        if (node.type === 'RegExpLiteral') {
            sig.anchors.add(node.regex.pattern);
        }

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
      if (key === 'parent') continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(walk);
      else if (typeof child === 'object') walk(child);
    }
  }

  walk(program);
  consumer.destroy();

  for (const pkgName in signatures) {
      const sig = signatures[pkgName];
      sig.avgDeclaratorsPerDeclaration = sig.declarations > 0 ? sig.declarators / sig.declarations : 0;
      sig.identifierRatio = sig.totalNodes > 0 ? sig.identifiers / sig.totalNodes : 0;
      sig.ternaryRatio = sig.totalNodes > 0 ? sig.ternaries / sig.totalNodes : 0;
      sig.assignmentChainRatio = sig.totalNodes > 0 ? sig.assignmentChains / sig.totalNodes : 0;
      sig.patternRatios = {};
      for (const [p, count] of Object.entries(sig.patterns)) {
          sig.patternRatios[p] = sig.totalNodes > 0 ? (count as number) / sig.totalNodes : 0;
      }
      sig.anchors = Array.from(sig.anchors);
  }

  return signatures;
}
