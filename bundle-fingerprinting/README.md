# Bundle Fingerprinting

Identifying NPM packages in minified JavaScript bundles without using source maps.

## Vision

This project aims to develop a system that can detect the presence and version of NPM packages within a minified bundle by analyzing its AST structure and identifying unique "fingerprints" or "signatures".

## Current Progress

- [x] **Ground Truth Generation**: Automated bundling with `esbuild` and `rollup` (minified + source-mapped).
- [x] **Structural Fingerprinting**: Initial node-type distribution extraction using `oxc-parser`.
- [x] **Verification Loop**: 
    - [x] Implemented `verification-runner.ts` to score predictions against source maps.
    - [x] Specialized **Subagents** (`fingerprint-refiner`, `matrix-generator`, `signature-extractor`) iteratively found high-accuracy signatures and populated a 24-bundle ground-truth matrix for cross-tool stability testing.

### Subagent Architecture

We use a specialized subagent to manage the complexity of AST analysis. The agent follows a classic verification loop:
1. **Hypothesize**: Propose a structural signature (e.g., "d3-selection usually starts with a specific IIFE wrapper").
2. **Predict**: Scan a blind bundle using this signature.
3. **Verify**: Run the `verification-runner` to get an accuracy score.
4. **Refine**: Adjust the signature based on false positives/negatives.

## Discoveries & Subagent Success

The LLM-driven subagents successively evolved our fingerprinting logic from looking at simple node distributions to analyzing deep structural ratios across a massive 24-permutation minifier matrix (ESBuild, Rollup, SWC, Terser, UglifyJS). Key findings:

- **Global Attribution Accuracy**: Across all minifier variations and packages, our structural algorithm scores **91.99%** attribution accuracy. It is highly robust against different code compression "accents."
- **AST Structural Invariants**: Subagents discovered that metrics like `identifierRatio` (e.g. `lodash` sustains ~40-42% identifiers vs total nodes) are highly minification-resistant, whereas metrics like `ternaryRatio` are volatile depending on the tool (`uglifyjs` aggressively collapses if-else branches, SWC is less aggressive).
- **Specific Markers**: The agents learned to look for minification-resistant patterns like `typeof global`, `typeof self`, and literal string comparisons (`"Symbol"`, `"[object Object]"`).

By recursively traversing `BlockStatements` and `CallExpressions`, the `match-bundle` engine successfully locates embedded sub-packages (like `axios` hidden inside a larger `d3` wrapper) and scores them based on matching structural features.


## Future Work

- **Live Scrapes**: Collect live bundles from high-profile production sites that ship source maps (e.g., GitHub, nyt, coursehero) to test against "real-world" obfuscation and bundling techniques. (Concept from HTTPArchive/Web Almanac discussions).

## Technical Stack

- **Runtime**: Node.js (>=24.11.0)
- **Language**: TypeScript (Erasable Syntax)
- **Tooling**: `oxlint`, `oxfmt`, `pnpm`
- **Testing**: Node.js native test runner
- **AST Analysis**: (Planned) Modern AST tooling like `oxc`, `biome`, or `swc`.
