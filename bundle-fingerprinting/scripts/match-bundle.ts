import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSync } from 'oxc-parser';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FINGERPRINTS_PATH = path.join(ROOT, 'data/fingerprints.json');

interface Fingerprint {
  totalNodes: number;
  nodeDist: Record<string, number>;
  avgDeclaratorsPerDeclaration: number;
  identifierRatio: number;
  ternaryRatio: number;
  assignmentChainRatio: number;
}

interface PackageRecord {
  packageName: string;
  versions: Record<string, Fingerprint>;
}

async function loadFingerprints(): Promise<PackageRecord[]> {
  const content = await fs.readFile(FINGERPRINTS_PATH, 'utf-8');
  const data = JSON.parse(content);
  return Object.values(data);
}

function calculateSimilarity(statsA: any, statsB: any) {
  // statsA is the current node being analyzed
  // statsB is the fingerprint from the database
  
  let score = 0;
  
  // 1. Node distribution similarity (Manhattan distance)
  const allTypes = new Set([...Object.keys(statsA.nodeDist), ...Object.keys(statsB.nodeDist)]);
  let distScore = 0;
  for (const type of allTypes) {
    const valA = statsA.nodeDist[type] || 0;
    const valB = statsB.nodeDist[type] || 0;
    distScore += Math.abs(valA - valB);
  }
  score += distScore * 1.5; // Slightly higher weight for full distribution

  // 2. Structural feature similarity
  // Identifier ratio is a PRIMARY invariant across minifiers
  score += Math.abs(statsA.identifierRatio - statsB.identifierRatio) * 10.0; 
  
  // Ternary ratio is VOLATILE (minifiers transform if-else differently) - lower weight
  score += Math.abs(statsA.ternaryRatio - statsB.ternaryRatio) * 2.0; 
  
  score += Math.abs(statsA.avgDeclaratorsPerDeclaration - statsB.avgDeclaratorsPerDeclaration) * 0.2;
  score += Math.abs(statsA.assignmentChainRatio - statsB.assignmentChainRatio) * 15.0;

  // 3. Pattern similarity - High Weight Anchors
  if (statsA.patternRatios && statsB.patternRatios) {
      for (const p in statsA.patternRatios) {
          const valA = statsA.patternRatios[p] || 0;
          const valB = statsB.patternRatios[p] || 0;
          if (valB > 0) {
              // If the fingerprint HAS this pattern, it's a very strong signal
              score += Math.abs(valA - valB) * 100.0;
          }
      }
  }
  
  return score;
}

export async function matchBundle(bundlePath: string, verbose = false) {
  const code = await fs.readFile(bundlePath, 'utf-8');
  const fingerprints = await loadFingerprints();
  
  const result = parseSync('bundle.js', code, { sourceType: 'script' });
  const program = result.program;

  console.log(`Analyzing bundle: ${path.basename(path.dirname(bundlePath))}/${path.basename(bundlePath)}`);

  const matches: any[] = [];

  function analyzeNode(node: any) {
    if (!node || typeof node !== 'object') return;

    const stats: any = {
        nodeDist: {},
        total: 0,
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

    function walk(n: any) {
      if (!n || typeof n !== 'object') return;
      if (n.type) {
        stats.nodeDist[n.type] = (stats.nodeDist[n.type] || 0) + 1;
        stats.total++;
        
        if (n.type === 'VariableDeclaration') stats.declarations++;
        if (n.type === 'VariableDeclarator') {
            stats.declarators++;
            if (n.init && n.init.type === 'Identifier') stats.assignmentChains++;
        }
        if (n.type === 'Identifier') stats.identifiers++;
        if (n.type === 'ConditionalExpression') stats.ternaries++;

        // Pattern detection
        if (n.type === 'BinaryExpression' && (n.operator === '===' || n.operator === '==')) {
            const left = code.substring(n.left.start, n.left.end);
            const right = code.substring(n.right.start, n.right.end);
            if (left.includes('typeof global') || right.includes('typeof global')) stats.patterns.typeofGlobal++;
            if (left.includes('typeof self') || right.includes('typeof self')) stats.patterns.typeofSelf++;
        }
        if (n.type === 'UnaryExpression' && n.operator === 'typeof') {
            const arg = code.substring(n.argument.start, n.argument.end);
            if (arg === 'Symbol') stats.patterns.typeofSymbol++;
        }
        if (n.type === 'MemberExpression') {
            const member = code.substring(n.start, n.end);
            if (member.includes('Object.prototype.toString')) stats.patterns.objectToString++;
        }
      }
      for (const key in n) {
        if (key === 'parent') continue;
        const child = n[key];
        if (Array.isArray(child)) {
            child.forEach(walk);
        }
        else if (typeof child === 'object') walk(child);
      }
    }

    walk(node);

    if (stats.total > 20) {
        // Normalize stats
        const dist: Record<string, number> = {};
        for (const [type, count] of Object.entries(stats.nodeDist as Record<string, number>)) {
          dist[type] = count / stats.total;
        }

        const currentStats = {
            nodeDist: dist,
            avgDeclaratorsPerDeclaration: stats.declarations > 0 ? stats.declarators / stats.declarations : 0,
            identifierRatio: stats.identifiers / stats.total,
            ternaryRatio: stats.ternaries / stats.total,
            assignmentChainRatio: stats.assignmentChains / stats.total,
            patternRatios: {
                typeofGlobal: stats.patterns.typeofGlobal / stats.total,
                typeofSelf: stats.patterns.typeofSelf / stats.total,
                typeofSymbol: stats.patterns.typeofSymbol / stats.total,
                objectToString: stats.patterns.objectToString / stats.total
            }
        };

        let bestMatch: any = null;
        let minScore = Infinity;

        for (const pkg of fingerprints) {
          for (const [version, fprint] of Object.entries(pkg.versions)) {
            const score = calculateSimilarity(currentStats, fprint);
            if (score < minScore) {
              minScore = score;
              bestMatch = { pkg: pkg.packageName, version, score, start: node.start, end: node.end };
            }
          }
        }

        if (bestMatch && bestMatch.score < 0.8) {
          if (bestMatch.score < 0.5) {
            if (verbose) {
              console.log(`Node at ${node.start}-${node.end} (total: ${stats.total}) matches: ${bestMatch.pkg} [Score: ${bestMatch.score.toFixed(4)}]`);
            }
            matches.push(bestMatch);
          }
        }
    }

    // Always recurse into containers to find possibly smaller/better matches
    for (const key in node) {
        if (key === 'parent') continue;
        const child = node[key];
        if (Array.isArray(child)) {
            child.forEach(analyzeNode);
        } else if (typeof child === 'object') {
            analyzeNode(child);
        }
    }
  }

  // Pass program into the analyzer
  analyzeNode(program);
  
  // Deduplicate and filter overlapping matches
  // Sort by score (lowest is best)
  matches.sort((a, b) => a.score - b.score);
  
  const bestMatches: any[] = [];
  
  for (const match of matches) {
      let overlap = false;
      for (const existing of bestMatches) {
          // If they overlap AT ALL
          if (match.start < existing.end && match.end > existing.start) {
              // But allow a tiny amount of overlap if they're completely nested?
              // No, let's just reject any overlap here to keep it clean.
              overlap = true;
              break;
          }
      }
      
      // Filter out high-score (low confidence) matches
      // The threshold 0.45 is calibrated against the 24-driver matrix
      if (!overlap && match.score < 0.45) {
          bestMatches.push(match);
      }
  }
  
  return bestMatches;
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.find(a => !a.startsWith('--'));
  const verbose = args.includes('--verbose');
  
  if (!target) {
    console.error('Usage: ./match-bundle <path/to/bundle.js> [--verbose]');
    process.exit(1);
  }

  if (!verbose) {
    console.log('💡 Run with --verbose to see detailed AST matching logs for every node evaluated.');
  }

  const predictions = await matchBundle(target, verbose);
  
  if (predictions.length > 0) {
      console.log('\n--- Match Results ---');
      for (const p of predictions) {
          console.log(`Package: ${p.pkg} \tScore: ${p.score.toFixed(4)} \tRange: ${p.start}-${p.end}`);
      }
  } else {
      console.log('No recognizable packages found.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
