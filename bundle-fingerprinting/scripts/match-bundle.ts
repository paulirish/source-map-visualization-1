import fs from 'node:fs/promises';
import path from 'node:path';
import { parseSync } from 'oxc-parser';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FINGERPRINTS_DIR = path.join(ROOT, 'data/fingerprints');

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
  const files = await fs.readdir(FINGERPRINTS_DIR);
  const fingerprints: PackageRecord[] = [];
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = await fs.readFile(path.join(FINGERPRINTS_DIR, file), 'utf-8');
    fingerprints.push(JSON.parse(content));
  }
  
  return fingerprints;
}

function calculateSimilarity(statsA: any, statsB: any) {
  // statsA is the current node being analyzed (from bundle)
  // statsB is the fingerprint from the database
  
  let score = 0;
  let anchorMatches = 0;
  const matchedAnchors: string[] = [];

  // 1. Semantic Anchor Match (Strong proof)
  if (statsA.anchors && statsB.anchors) {
      const setB = new Set(statsB.anchors);
      for (const a of statsA.anchors) {
          if (setB.has(a)) {
              anchorMatches++;
              matchedAnchors.push(a);
          }
      }
  }
  
  // 2. Node distribution (Structural heuristic)
  const types = new Set([...Object.keys(statsA.nodeDist), ...Object.keys(statsB.nodeDist)]);
  let distDiff = 0;
  for (const type of types) {
    const a = statsA.nodeDist[type] || 0;
    const b = statsB.nodeDist[type] || 0;
    distDiff += Math.abs(a - b);
  }
  score += distDiff * 0.4; // 40% weight to node distribution

  // 3. Structural Ratios (Invariant heuristic)
  const idDiff = Math.abs((statsA.identifierRatio || 0) - (statsB.identifierRatio || 0));
  score += idDiff * 0.3; // 30% weight to stable identifier ratio

  const decDiff = Math.abs((statsA.avgDeclaratorsPerDeclaration || 0) - (statsB.avgDeclaratorsPerDeclaration || 0));
  score += decDiff * 0.1;

  const chainDiff = Math.abs((statsA.assignmentChainRatio || 0) - (statsB.assignmentChainRatio || 0));
  score += chainDiff * 0.1;

  const ternaryDiff = Math.abs((statsA.ternaryRatio || 0) - (statsB.ternaryRatio || 0));
  score += ternaryDiff * 0.05; // 5% weight to volatile ternary ratio

  // 4. Pattern Ratios (Contextual proof)
  if (statsA.patternRatios && statsB.patternRatios) {
      let patternDiff = 0;
      for (const p in statsB.patternRatios) {
          patternDiff += Math.abs((statsA.patternRatios[p] || 0) - (statsB.patternRatios[p] || 0));
      }
      score += patternDiff * 0.05;
  }

  // Anchor Boost: If we have multiple unique anchor matches, drastically reduce the "distance" score
  const anchorBoost = Math.min(anchorMatches * 0.15, 0.6); // Up to 60% reduction
  score *= (1 - anchorBoost);

  return {
      score,
      anchorMatches,
      matchedAnchors: matchedAnchors.slice(0, 5), // Keep top 5 for reasoning
      structuralScore: 1 - Math.min(score, 1)
  };
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
        },
        anchors: new Set<string>()
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

        // --- Semantic Anchors ---
        if (n.type === 'Literal') {
            const val = String(n.value);
            if (val.length > 5 || /^[A-Z_]+$/.test(val)) stats.anchors.add(val);
        }
        if (n.type === 'RegExpLiteral') {
            stats.anchors.add(n.regex.pattern);
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
            },
            anchors: Array.from(stats.anchors)
        };

        let bestMatch: any = null;
        let minScore = Infinity;

        for (const pkg of fingerprints) {
          for (const [version, fprint] of Object.entries(pkg.versions)) {
            const result = calculateSimilarity(currentStats, fprint);
            if (result.score < minScore) {
              minScore = result.score;
              bestMatch = { 
                  pkg: pkg.packageName, version, score: result.score, 
                  start: node.start, end: node.end, 
                  report: result 
              };
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
          const report = p.report;
          console.log(`\nPackage: ${p.pkg} 	Confidence: ${(report.structuralScore * 100).toFixed(1)}% 	Range: ${p.start}-${p.end}`);
          if (report.anchorMatches > 0) {
              console.log(`  ✅ Semantic Proof: ${report.anchorMatches} unique anchors matched.`);
              if (report.matchedAnchors.length > 0) {
                  console.log(`     - [${report.matchedAnchors.join(', ')}]`);
              }
          } else {
              console.log(`  ⚠️  Heuristic Match: Based on structural ratios (no unique anchors found).`);
          }
      }
  } else {
      console.log('No recognizable packages found.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
