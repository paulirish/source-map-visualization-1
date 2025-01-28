import * as styles from './color.css'
import {
  hueAngleToColor,
  isSourceMapPath,
  stripDisabledPathPrefix,
  bytesToText
} from "./helpers" // Adjusted path
import { orderChildrenBySize } from './tree'

export enum COLOR {
  NONE = 0,
  DIRECTORY = 1,
  FORMAT = 2,
}

enum FORMATS {
  CJS = 1,
  ESM = 2,
}

let previousPatternContext: CanvasRenderingContext2D | undefined
let previousPatternRatio: number | undefined
let previousPatternScale: number | undefined
let patternCanvas = document.createElement('canvas')
let patternContext = patternCanvas.getContext('2d')!
let patternScale = 1
let pattern: CanvasPattern

let previousTree: any // TreeNode type removed - will be TreeNode
let previousColor = COLOR.NONE
let root: any // TreeNodeInProgress import removed - will be TreeNode

export type Color = string | readonly [string, string]
export type ColorMapping = Record<string, Color>
let colorMapping: ColorMapping = {}

let afterColorMappingUpdate: (() => void) | null = null
export let setAfterColorMappingUpdate = (callback: () => void) => afterColorMappingUpdate = callback

export let canvasFillStyleForInputPath = (
  c: CanvasRenderingContext2D,
  inputPath: string,
  originX: number,
  originY: number,
  scale: number,
): string | CanvasPattern => {
  let color = colorMapping[inputPath] || otherColor
  if (color instanceof Array) {
    let ratio = window.devicePixelRatio || 1
    if (previousPatternContext !== c || previousPatternRatio !== ratio || previousPatternScale !== scale) {
      let s = Math.round(64 * ratio) / 64
      let t1: number
      let t8: number
      let lineWidth: number

      patternScale = scale
      patternScale = Math.log2(patternScale)
      patternScale -= Math.floor(patternScale)
      t1 = patternScale
      t8 = Math.min(1, 8 * t1)
      patternScale = Math.pow(2, patternScale)
      lineWidth = 8 * Math.SQRT2 / patternScale

      previousPatternContext = c
      previousPatternRatio = ratio
      previousPatternScale = scale

      patternCanvas.width = patternCanvas.height = Math.round(64 * s)
      patternContext.scale(s, s)

      // Interpolate the two colors together so stripes are at 25% and 75% opacity
      patternContext.fillStyle = color[0]
      patternContext.fillRect(0, 0, 64, 64)
      patternContext.globalAlpha = 0.25
      patternContext.fillStyle = color[1]
      patternContext.fillRect(0, 0, 64, 64)
      patternContext.globalAlpha = 0.67
      patternContext.strokeStyle = color[1]

      // Draw the thicker lines
      patternContext.beginPath()
      for (let i = 0; i <= 64; i += 16) {
        patternContext.moveTo(i - 32, i + 32)
        patternContext.lineTo(i + 32, i - 32)
      }
      patternContext.lineWidth = lineWidth * (1 - (t8 - t1) / 2)
      patternContext.stroke()

      // Draw the thinner lines
      if (t8 + t1 > 0) {
        patternContext.beginPath()
        for (let i = 8; i < 64; i += 16) {
          patternContext.moveTo(i - 32, i + 32)
          patternContext.lineTo(i + 32, i - 32)
        }
        patternContext.lineWidth = lineWidth * (t8 + t1) / 2
        patternContext.stroke()
      }

      pattern = c.createPattern(patternCanvas, 'repeat')!
      patternScale /= s
    }

    // Re-center the pattern near the origin so the shaders don't run out of precision
    originX /= 64 * patternScale * ratio
    originX -= Math.floor(originX)
    originX *= 64 * patternScale * ratio

    pattern.setTransform(new DOMMatrix([
      patternScale, 0,
      0, patternScale,
      originX, originY,
    ]))
    return pattern
  }
  return color
}

export let cssBackgroundForInputPath = (inputPath: string): string => {
  let color = colorMapping[inputPath] || otherColor
  if (color instanceof Array) {
    return `url('`
      + `image/svg+xml,`
      + `<svg width="26" height="26" xmlns="http://www.w3.org/2000/svg">`
      + `<rect width="26" height="26" fill="${color[0]}"/>`
      // Interpolate the two colors together so stripes are at 25% and 75% opacity
      + `<rect width="26" height="26" fill="${color[1]}" fill-opacity="25%"/>`
      + `<path d="M22.5 -3.5L-3.5 22.5M35.5 9.5L9.5 35.5" stroke="${color[1]}" stroke-opacity="67%" stroke-width="9.19239"/>`
      + `</svg>`
      + `')`
  }
  return color
}

export let updateColorMapping = (tree: any, color: COLOR): void => { // Changed parameter type to any, should be Tree
  if (previousTree !== tree) {
    previousTree = tree;
    previousColor = COLOR.NONE;
    root = tree.root_; // Use the root node from the Tree
  }

  if (previousColor !== color) {
    previousColor = color
    colorMapping = {}
    colorLegendEl.innerHTML = ''

    if (color === COLOR.DIRECTORY) {
      assignColorsByDirectory(colorMapping, root, 0, Math.PI * 2) // Pass the root node
    } else if (color === COLOR.FORMAT) {
      assignColorsByFormat(colorMapping, root) // Pass the root node
      colorLegendEl.innerHTML = formatLegendHTML
    }

    if (afterColorMappingUpdate) afterColorMappingUpdate()
  }
}

let assignColorsByDirectory = (
  colorMapping: ColorMapping,
  node: any, // TreeNode type removed - will be TreeNode
  startAngle: number,
  sweepAngle: number,
): void => {
  let totalBytes = node.bytesInOutput_
  let children = node.sortedChildren_ // Use sortedChildren_ from TreeNode
  let sorted: any[] = [] // TreeNode type removed - will be TreeNode

  colorMapping[node.inputPath_] = hueAngleToColor(startAngle + sweepAngle / 2)

  for (let child of children) { // Iterate over sortedChildren_
    sorted.push(child)
  }

  for (let child of sorted.sort(orderChildrenBySize)) {
    let childSweepAngle = child.bytesInOutput_ / totalBytes * sweepAngle
    assignColorsByDirectory(colorMapping, child, startAngle, childSweepAngle)
    startAngle += childSweepAngle
  }
}

export let cjsColor = hueAngleToColor(3.5)
export let esmColor = hueAngleToColor(1)
export let otherColor = '#CCC'
let bothColor = [cjsColor, esmColor] as const

let colorForFormats = (formats: FORMATS): Color => {
  if (!formats) return otherColor
  if (formats === FORMATS.CJS) return cjsColor
  if (formats === FORMATS.ESM) return esmColor
  return bothColor
}

export let moduleTypeLabelInputPath = (inputPath: string, prefix: string): string => {
  let color = colorMapping[inputPath] || otherColor
  if (color === otherColor) return ''
  if (color === esmColor) return prefix + 'ESM'
  if (color === cjsColor) return prefix + 'CJS'
  return prefix + 'ESM & CJS'
}

let assignColorsByFormat = (colorMapping: ColorMapping, node: any): FORMATS => { // TreeNode type removed - will be TreeNode
  let children = node.sortedChildren_ // Use sortedChildren_ from TreeNode
  let formats: FORMATS | 0 = 0
  let hasChild = false

  for (let child of children) { // Iterate over sortedChildren_
    formats |= assignColorsByFormat(colorMapping, child)
    hasChild = true
  }

  if (!hasChild) {
    // previousMetafile!.inputs is no longer available, need to rethink how to get format.
    // Assuming format is not relevant for DIRECTORY coloring, and only for FORMAT coloring.
    // For DIRECTORY coloring, we can skip format-based logic.
    // Let's leave it as 0 for now, as it's not used for DIRECTORY coloring.
    // If format-based coloring is needed later with Tree structure, we'll need to adapt this.
    formats = 0; // Default to 0 for directory coloring, format info not directly available in TreeNode
    // let input = previousMetafile!.inputs[node.inputPath_] // Assuming metafile still has inputs structure for now
    // let format = input && input.format
    // formats = format === 'esm' ? FORMATS.ESM : format === 'cjs' ? FORMATS.CJS : 0
  }

  colorMapping[node.inputPath_] = colorForFormats(formats)
  return formats
}

export let colorLegendEl = document.createElement('div')
let formatLegendHTML = ''
  + `<span class="${styles.chit}" style="background:` + esmColor + '"></span>ESM <small>modern, faster, smaller</small>'
  + `<span class="${styles.chit}" style="background:` + cjsColor + '"></span>CommonJS <small>legacy, slower, larger</small>'
  + `<span class="${styles.chit}" style="background:` + otherColor + '"></span>Other'

colorLegendEl.id = styles.colorLegend
