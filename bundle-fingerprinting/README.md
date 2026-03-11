# Bundle Fingerprinting

Identifying NPM packages in minified JavaScript bundles without using source maps.

## Vision

This project aims to develop a system that can detect the presence and version of NPM packages within a minified bundle by analyzing its AST structure and identifying unique "fingerprints" or "signatures".

## Current Progress

- [x] **Ground Truth Generation**: Automated bundling with `esbuild` and `rollup` (minified + source-mapped).
- [x] **Structural Fingerprinting**: Initial node-type distribution extraction using `oxc-parser`.
- [/] **Verification Loop**: 
    - [x] Implemented `verification-runner.ts` to score predictions against source maps.
    - [/] Specialized **Subagent** (`fingerprint-refiner`) is currently "churning" to find high-accuracy signatures beyond simple node distributions.

### Subagent Architecture

We use a specialized subagent to manage the complexity of AST analysis. The agent follows a classic verification loop:
1. **Hypothesize**: Propose a structural signature (e.g., "d3-selection usually starts with a specific IIFE wrapper").
2. **Predict**: Scan a blind bundle using this signature.
3. **Verify**: Run the `verification-runner` to get an accuracy score.
4. **Refine**: Adjust the signature based on false positives/negatives.

## Discoveries & Subagent Success

The LLM-driven subagent (`fingerprint-refiner`) successfully evolved our fingerprinting logic from looking at simple node distributions to analyzing deep structural ratios. Key findings:
- **`lodash`**: Exceptionally high identifier ratio (~42%) and dense variable assignment chains (e.g. `var a = b, c = a;`). 
- **`moment`**: Dominated by large sequences of standard assignments globally, relatively low functional nesting.
- **Specific Markers**: The agent learned to look for minification-resistant patterns like `typeof global`, `typeof self`, and literal string comparisons (`"Symbol"`, `"[object Object]"`).

By recursively traversing `BlockStatements` and `CallExpressions`, the `match-bundle` engine can now successfully locate embedded sub-packages (like `axios` hidden inside a larger `d3` wrapper) and score them based on matching structural features.

## Future Work

- **Live Scrapes**: Collect live bundles from high-profile production sites that ship source maps (e.g., GitHub, nyt, coursehero) to test against "real-world" obfuscation and bundling techniques. (Concept from HTTPArchive/Web Almanac discussions).

## Technical Stack

- **Runtime**: Node.js (>=24.11.0)
- **Language**: TypeScript (Erasable Syntax)
- **Tooling**: `oxlint`, `oxfmt`, `pnpm`
- **Testing**: Node.js native test runner
- **AST Analysis**: (Planned) Modern AST tooling like `oxc`, `biome`, or `swc`.
