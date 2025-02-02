import { hasOwnProperty, splitPathBySlash } from "./helpers" // Adjusted path
import { SourceMapData } from "./treemap"

export interface TreeNodeInProgress {
  name_: string
  inputPath_: string
  origPath: string
  source: SourceMapData['sources'][0],
  bytesInOutput_: number
  children_: Record<string, TreeNodeInProgress>
}

export let orderChildrenBySize = (
  a: { inputPath_: string, bytesInOutput_: number },
  b: { inputPath_: string, bytesInOutput_: number },
): number => {
  return b.bytesInOutput_ - a.bytesInOutput_ || +(a.inputPath_ > b.inputPath_) - +(a.inputPath_ < b.inputPath_)
}

export let accumulatePath = (root: TreeNodeInProgress, source: SourceMapData['sources'][0]): number => {
  let parts = splitPathBySlash(source.name)
  let n = parts.length
  let parent = root
  let inputPath = ''
  root.bytesInOutput_ += source.mappedByteTotal;


  for (let i = 0; i < n; i++) {
    let part = parts[i]
    let children = parent.children_
    let child = children[part]
    let name = part + (i + 1 < n ? '/' : '')
    inputPath += name

    if (!hasOwnProperty.call(children, part)) {
      child = {
        name_: name,
        source: source,
        inputPath_: inputPath,
        origPath: source.name,
        bytesInOutput_: 0,
        children_: {},
      }
      children[part] = child
    }

    child.bytesInOutput_ += source.mappedByteTotal;
    parent = child
  }

  return n
}
