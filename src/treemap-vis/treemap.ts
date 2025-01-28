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


interface SourceMapData {
  sources: { name: string; content: string;  Int32Array; dataLength: number }[];
  names: string[];
   Int32Array;
}


let analyzeSourceMapTree = (sourceMapData: SourceMapData): Tree => {
  const sources = sourceMapData.sources;
  const mappings = sourceMapData.data;
  let totalBytes = 0; // We will estimate size based on mappings
  let maxDepth = 0;
  let nodes: TreeNode[] = [];

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


  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex];
    const sourceName = source.name;
    if (!sourceName) continue; // Skip if source name is empty

    let node: TreeNodeInProgress = { name_: sourceName, inputPath_: sourceName, bytesInOutput_: 0, children_: {} };
    let sourceMappingsCount = 0;

    // Iterate through mappings and count those related to this source
    for (let i = 0; i < mappings.length; i += 6) {
      if (mappings[i + 2] === sourceIndex) { // mappings[i+2] is originalSource index
        sourceMappingsCount++; // Simple mapping count as size proxy
      }
    }

    // Estimate bytes based on mapping count - adjust this as needed
    const estimatedBytes = sourceMappingsCount * 10; // Example: 10 bytes per mapping

    let depth = accumulatePath(node, sourceName, estimatedBytes);
    if (depth > maxDepth) maxDepth = depth;

    node.bytesInOutput_ = estimatedBytes;
    totalBytes += estimatedBytes;
    nodes.push(sortChildren(node, false)); // Source files are not output files in this context
  }

  // Unwrap common nested directories -  You might need to adapt this logic if source paths are different
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

-  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
+  nodes.sort(orderChildrenBySize);

-    let childBytes = 0;
-     for (let node of nodes) {
-       let children = node.sortedChildren_
-       if (!children.length) continue
-    }
-    if (childBytes < node.bytesInOutput_) {
-      node.sortedChildren_.push({
-        name_: '(unassigned)',
-        inputPath_: '',
-        sizeText_: bytesToText(node.bytesInOutput_ - childBytes),
-        bytesInOutput_: node.bytesInOutput_ - childBytes,
-        sortedChildren_: [],
-        isOutputFile_: false,
-      })
-    }
-  }

-  nodes.sort(orderChildrenBySize)
   return {
     root_: {
       name_: 'sources', // Changed root name to 'sources' to represent original sources
       inputPath_: '',
-      sizeText_: '',
       bytesInOutput_: totalBytes,
       sortedChildren_: nodes,
       isOutputFile_: false,
