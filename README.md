# Source Map Visualization

Demo: [https://evanw.github.io/source-map-visualization/](https://evanw.github.io/source-map-visualization/)

This is a visualization of JavaScript/CSS source map data, which is useful for debugging problems with generated source maps. It's designed to be high-performance so it doesn't fall over with huge source maps.

```sh
~/code/esbtree/node_modules/.bin/esbuild  src/treemap-vis/treemap.ts --bundle   --loader:.css=local-css --loader:.html=copy --outdir=./out --target=chrome120 --watch --sourcemap=linked --format=esm
```

### todo

- split eol bytes out from unmapped ones.
- highlight ranges in text editor when hovering treemap node.
- align the bg colors used in both.
- look into the multiple tick() calls per frame. seems wrong.
