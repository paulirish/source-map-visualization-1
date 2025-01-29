# Source Map Visualization

Demo: [https://evanw.github.io/source-map-visualization/](https://evanw.github.io/source-map-visualization/)

This is a visualization of JavaScript/CSS source map data, which is useful for debugging problems with generated source maps. It's designed to be high-performance so it doesn't fall over with huge source maps.


```
$HOME/Library/Caches/Yarn/v6/npm-@esbuild-darwin-arm64-0.19.11-533fb7f5a08c37121d82c66198263dcc1bed29bf-integrity/node_modules/@esbuild/darwin-arm64/bin/esbuild src/treemap-vis/treemap.ts --bundle   --loader:.css=local-css --loader:.html=copy --outdir=./out --target=chrome120 --watch  --sourcemap=linked --format=esm
```