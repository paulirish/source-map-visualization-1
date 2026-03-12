# Building with Subagents: The Bundle Fingerprinting Project

This guide outlines the architecture and project management strategy used to build the **Bundle Fingerprinting** system. It is intended for software engineers and coding agents who want to leverage specialized subagents for high-complexity tasks.

---

## 1. The Strategy: Divide, Conquer, and Churn

The core challenge of this project was identifying NPM packages in minified JavaScript without source maps. This required two distinct modes of work:
1.  **Macro-level Engineering**: Building the infrastructure (ground-truth generation, AST instrumentation, CLI wrappers).
2.  **Micro-level Analysis**: Iteratively "churning" through AST patterns to find high-precision signatures (the "science" bit).

We divided these tasks between the **Parent Agent** (Architect) and a **Specialized Subagent** (Researcher).

### The Feedback Loop
The project relied on a **Verification Loop**:
1.  **Ground Truth**: Generating bundles with source maps so we have an "answer key."
2.  **Hypothesize**: Subagent proposes a new AST signature (e.g., "Lodash has a high identifier ratio").
3.  **Predict**: Run the matching engine on a blind bundle using that signature.
4.  **Verify**: Use the `verification-runner.ts` to score the subagent's prediction against the original source map.
5.  **Refine**: Subagent uses failure cases to tune the signature weights.

---

## 2. Orchestrating the Subagent

The most critical part of subagent management is **Context Boundary Management**. Large tasks like AST analysis involve massive amounts of data which can quickly saturate a single agent's context window.

### Subagent Definition
We defined the subagent with a narrow, clear objective and explicit tool access:

```json
{
  "name": "fingerprint-refiner",
  "description": "Specialist in AST analysis and iterative refinement.",
  "tools": ["list_dir", "view_file", "run_command", "replace_file_content"],
  "prompt": "Analyze node sequences and unique property patterns in data/ground-truth/. Update scripts/match-bundle.ts and verify using scripts/verification-runner.ts."
}
```

### Protocol for Handoff
1.  **Provide Absolute Paths**: Subagents often spawn in default directories (like `/tmp`). Always provide the absolute project path (`/Users/.../project`) in the initial prompt or first message.
2.  **Templates and Stubs**: Before invoking the subagent, we built the "chassis"—scripts that could parse ASTs and generate reports. The subagent filled in the "logic" (the specific signature weights and pattern-matching regexes).
3.  **Synchronous Reporting**: Use a dedicated communication channel to send status updates. When the subagent finds a "winning" signature, it shouldn't just keep it in its head—it should write it to a shared JSON database (like `data/fingerprints.json`).

---

## 3. Technical Architecture: The "Fingerprinting" Pipeline

### Phase A: Ground Truth Generation (`scripts/generate-bundles.ts`)
We automated `esbuild` and `rollup` to bundle popular packages (`lodash`, `moment`, `axios`) in various scenarios. Most importantly, we preserved the `.map` files as our programmatic validation layer.

### Phase B: AST Signal Extraction (`scripts/extract-signatures.ts`)
Instead of just counting node types, the system extracts:
- **Structural Ratios**: `identifierRatio`, `ternaryRatio`, `avgDeclaratorsPerDeclaration`.
- **Pattern Markers**: Minification-resistant strings like `typeof global`, `typeof self`, and literal string comparisons (`"Symbol"`, `"[object Object]"`).

### Phase C: Recursive Matcher (`scripts/match-bundle.ts`)
The matcher doesn't just look at the top level. It recursively traverses the AST, scoring every significant node (IIFE, block, or module exporter). It then uses a **Greedy Disjoint Set** algorithm to find the best-scoring, non-overlapping matches in the file.

---

## 4. Key Takeaways for High-Efficiency Workflows

1.  **Automate Error Signals**: We wrote a `verification-runner.ts` specifically for the subagent to use. It allowed the subagent to grade its own homework and iterate until accuracy exceeded 90%.
2.  **Persistent Artifacts**: Keeping a `task.md` file tracks progress across agent boundaries. If the parent agent crashes or is resumed later, the artifact serves as the "long-term memory," showing exactly which scenarios have been verified.
3.  **Git as Progress Tracking**: We committed every time a subagent successfully refined a signature. This provides an audit log of how the patterns evolved.

---

## Conclusion
By treating the subagent as a scientific researcher tasked with a specific data-refinement loop, we kept the human/parent context focused on high-level architecture while the "agentic churn" handled the tedious pattern discovery. 

This model—**Infrastructure in Parent, Intelligence in Subagent, Verification in Script**—is the blueprint for complex agentic coding projects.
