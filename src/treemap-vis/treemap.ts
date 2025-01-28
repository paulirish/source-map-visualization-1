import * as indexStyles from './index.css'
import * as styles from './treemap.css'
import { TreeNodeInProgress, accumulatePath, orderChildrenBySize } from './tree'
import { isWhyFileVisible, showWhyFile } from '../whyfile' // Adjusted path
import {
  COLOR,
  canvasFillStyleForInputPath,
  colorLegendEl,
  cssBackgroundForInputPath,
  moduleTypeLabelInputPath,
  setAfterColorMappingUpdate,
} from './color'
import {
  bytesToText,
  commonPrefixFinder,
  isSourceMapPath,
  now,
  setDarkModeListener,
  setResizeEventListener,
  setWheelEventListener,
  shortenDataURLForDisplay,
  splitPathBySlash,
  stripDisabledPathPrefix,
  strokeRectWithFirefoxBugWorkaround,
  textToHTML,
} from '../helpers' // Adjusted path

interface TreeNode {
  name_: string
  inputPath_: string
  sizeText_: string
  bytesInOutput_: number
  sortedChildren_: TreeNode[]
  isOutputFile_: boolean
}

interface Tree {
  root_: TreeNode
  maxDepth_: number
}

enum CONSTANTS {
  PADDING = 4,
  HEADER_HEIGHT = 20,
  DOT_CHAR_CODE = 46,
  ANIMATION_DURATION = 350,
  INSET_X = 2 * PADDING,
  INSET_Y = HEADER_HEIGHT + PADDING,
}

enum DrawFlags {
  CONTAINS_HOVER = 1,
  CONTAINS_TARGET = 2,
}

enum Culling {
  Disabled,
  Enabled,
  Culled
}

const colorMode = COLOR.NONE;

let analyzeDirectoryTree = (metafile: any): Tree => { // removed Metafile type, using any for now
  let outputs = metafile.outputs
  let totalBytes = 0
  let maxDepth = 0
  let nodes: TreeNode[] = []
  let commonPrefix: string[] | undefined

  let sortChildren = (node: TreeNodeInProgress, isOutputFile: boolean): TreeNode => {
    let children = node.children_
    let sorted: TreeNode[] = []
    for (let file in children) {
      sorted.push(sortChildren(children[file], false))
    }
    return {
      name_: node.name_,
      inputPath_: node.inputPath_,
      sizeText_: bytesToText(node.bytesInOutput_),
      bytesInOutput_: node.bytesInOutput_,
      sortedChildren_: sorted.sort(orderChildrenBySize),
      isOutputFile_: isOutputFile,
    }
  }

  for (let o in outputs) {
    // Find the common directory prefix, not including the file name
    let parts = splitPathBySlash(o)
    parts.pop()
    commonPrefix = commonPrefixFinder(parts.join('/'), commonPrefix)
  }

  for (let o in outputs) {
    if (isSourceMapPath(o)) continue

    let name = commonPrefix ? splitPathBySlash(o).slice(commonPrefix.length).join('/') : o
    let node: TreeNodeInProgress = { name_: name, inputPath_: '', bytesInOutput_: 0, children_: {} }
    let output = outputs[o]
    let inputs = output.inputs
    let bytes = output.bytes

    // Accumulate the input files that contributed to this output file
    for (let i in inputs) {
      let depth = accumulatePath(node, stripDisabledPathPrefix(i), inputs[i].bytesInOutput)
      if (depth > maxDepth) maxDepth = depth
    }

    node.bytesInOutput_ = bytes
    totalBytes += bytes
    nodes.push(sortChildren(node, true))
  }

  // Unwrap common nested directories
+    stop: while (true) {
+      let prefix: string | undefined
+      for (let node of nodes) {
+        let children = node.sortedChildren_
+        if (!children.length) continue
+        if (children.length > 1 || children[0].sortedChildren_.length !== 1) break stop
+        let name = children[0].name_
+        if (prefix === undefined) prefix = name
+        else if (prefix !== name) break stop
+      }
+      if (prefix === undefined) break
+
+      // Remove one level
+      for (let node of nodes) {
+        let children = node.sortedChildren_
+        if (children.length) {
+          children = children[0].sortedChildren_
+          for (let child of children) child.name_ = prefix + child.name_
+          node.sortedChildren_ = children
+        }
+      }
+      maxDepth--
+    }
+
+  // Add entries for the remaining space in each chunk
+  for (let node of nodes) {
+    let childBytes = 0
+    for (let child of node.sortedChildren_) {
+      childBytes += child.bytesInOutput_
+    }
+    if (childBytes < node.bytesInOutput_) {
+      node.sortedChildren_.push({
+        name_: '(unassigned)',
+        inputPath_: '',
+        sizeText_: bytesToText(node.bytesInOutput_ - childBytes),
+        bytesInOutput_: node.bytesInOutput_ - childBytes,
+        sortedChildren_: [],
+        isOutputFile_: false,
+      })
+    }
+  }

-  stop: while (true) {
+  nodes.sort(orderChildrenBySize)
+  return {
+    root_: {
+      name_: '',
+      inputPath_: '',
+      sizeText_: '',
+      bytesInOutput_: totalBytes,
+      sortedChildren_: nodes,
+      isOutputFile_: false,
+    },
+    maxDepth_: maxDepth + 1,
+  }
+}
+
+interface SourceMapData {
+  sources: { name: string; content: string;  Int32Array; dataLength: number }[];
+  names: string[];
+   Int32Array;
+}
+
+let analyzeSourceMapTree = (sourceMapData: SourceMapData): Tree => {
+  const sources = sourceMapData.sources;
+  const mappings = sourceMapData.data;
+  let totalBytes = 0; // We will estimate size based on mappings
+  let maxDepth = 0;
+  let nodes: TreeNode[] = [];
+
+  let sortChildren = (node: TreeNodeInProgress, isOutputFile: boolean): TreeNode => {
     let prefix: string | undefined
     for (let node of nodes) {
       let children = node.sortedChildren_
@@ -214,7 +306,7 @@
     }
   }
 
-  // Add entries for the remaining space in each chunk
+  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
     for (let node of nodes) {
       let children = node.sortedChildren_
       if (!children.length) continue
@@ -229,12 +321,12 @@
     }
   }
 
-  nodes.sort(orderChildrenBySize)
+  nodes.sort(orderChildrenBySize);
+
   return {
     root_: {
-      name_: '',
+      name_: 'sources', // Changed root name to 'sources' to represent original sources
       inputPath_: '',
-      sizeText_: '',
       bytesInOutput_: totalBytes,
       sortedChildren_: nodes,
       isOutputFile_: false,
@@ -410,8 +502,8 @@
   return children
 }

-export let createTreemap = (metafile: Metafile): HTMLDivElement => {
-  let tree = analyzeDirectoryTree(metafile)
+export let createTreemap = (sourceMapData: SourceMapData): HTMLDivElement => {
+  let tree = analyzeSourceMapTree(sourceMapData)
   let layoutNodes: NodeLayout[] = []
   let componentEl = document.createElement('div')
   let mainEl = document.createElement('main')
@@ -758,3 +850,17 @@
   componentEl.append(sectionEl)
   return componentEl
 }
+
+export let createTreemap_metafile = (metafile: Metafile): HTMLDivElement => { // Renamed old createTreemap
+  let tree = analyzeDirectoryTree(metafile)
+  let layoutNodes: NodeLayout[] = []
+  let componentEl = document.createElement('div')
+  let mainEl = document.createElement('main')
+  let canvas = document.createElement('canvas')
+  let c = canvas.getContext('2d')!
+  let width = 0
+  let height = 0
+  let animationFrame: number | null = null
+  let hoveredNode: TreeNode | null = null
+  let bgOriginX = 0
+  let bgOriginY = 0
