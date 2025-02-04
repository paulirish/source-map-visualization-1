// src/treemap-vis/helpers.ts
var hasOwnProperty = Object.prototype.hasOwnProperty;
var indexOf = Array.prototype.indexOf;
var numberFormat;
var isSourceMap = /\.\w+\.map$/;
var isMac = navigator.platform.indexOf("Mac") >= 0;
var now = () => {
  return (window.performance || Date).now();
};
var isSourceMapPath = (path) => {
  return isSourceMap.test(path);
};
var formatInteger = (value) => {
  return numberFormat ? numberFormat.format(value) : value + "";
};
var formatNumberWithDecimal = (value) => {
  let parts = value.toFixed(1).split(".", 2);
  return formatInteger(+parts[0]) + "." + parts[1];
};
var bytesToText = (bytes) => {
  if (bytes === 1) return "1 byte";
  if (bytes < 1e3) return formatInteger(bytes) + " bytes";
  if (bytes < 1e3 * 1e3) return formatNumberWithDecimal(bytes / 1e3) + " kB";
  if (bytes < 1e3 * 1e3 * 1e3) return formatNumberWithDecimal(bytes / (1e3 * 1e3)) + " MB";
  return formatNumberWithDecimal(bytes / (1e3 * 1e3 * 1e3)) + " GB";
};
var textToHTML = (text) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
var hueAngleToColor = (hueAngle) => {
  let saturation = 0.6 + 0.4 * Math.max(0, Math.cos(hueAngle));
  let lightness = 0.5 + 0.2 * Math.max(0, Math.cos(hueAngle + Math.PI * 2 / 3));
  return "hsl(" + hueAngle * 180 / Math.PI + "deg, " + Math.round(100 * saturation) + "%, " + Math.round(100 * lightness) + "%)";
};
var isFirefox = /\bFirefox\//.test(navigator.userAgent);
var strokeRectWithFirefoxBugWorkaround = (c, color, x, y, w, h) => {
  if (isFirefox) {
    let lineWidth = c.lineWidth;
    let halfWidth = lineWidth / 2;
    c.fillStyle = color;
    c.fillRect(x - halfWidth, y - halfWidth, w + lineWidth, lineWidth);
    c.fillRect(x - halfWidth, y + halfWidth, lineWidth, h - lineWidth);
    c.fillRect(x - halfWidth, y + h - halfWidth, w + lineWidth, lineWidth);
    c.fillRect(x + w - halfWidth, y + halfWidth, lineWidth, h - lineWidth);
    return;
  }
  c.strokeStyle = color;
  c.strokeRect(x, y, w, h);
};
var shortenDataURLForDisplay = (path) => {
  if (path.startsWith("data:") && path.indexOf(",") >= 0) {
    path = path.slice(0, 65).replace(/\n/g, "\\n");
    return "<" + (path.length > 64 ? path.slice(0, 64) + "..." : path) + ">";
  }
  return path;
};
var splitPathBySlash = (path) => {
  if (path.startsWith("data:") && path.indexOf(",") >= 0) {
    return [path];
  }
  const parts = path.split(/\//);
  if (parts.length >= 3 && parts[1] === "" && parts[0].endsWith(":")) {
    parts.splice(0, 3, parts.slice(0, 3).join("/"));
  }
  return parts;
};
var lastInteractionWasKeyboard = false;
var darkMode = matchMedia("(prefers-color-scheme: dark)");
var darkModeDidChange = () => darkModeListener && darkModeListener();
var wheelEventListener = null;
var resizeEventListener = null;
var darkModeListener = null;
var setWheelEventListener = (listener) => wheelEventListener = listener;
var setResizeEventListener = (listener) => resizeEventListener = listener;
var setDarkModeListener = (listener) => darkModeListener = listener;
document.addEventListener("keydown", () => lastInteractionWasKeyboard = true, { capture: true });
document.addEventListener("mousedown", () => lastInteractionWasKeyboard = false, { capture: true });
window.addEventListener("wheel", (e) => wheelEventListener && wheelEventListener(e), { passive: false });
window.addEventListener("resize", () => resizeEventListener && resizeEventListener());
try {
  darkMode.addEventListener("change", darkModeDidChange);
} catch (o) {
  darkMode.addListener(darkModeDidChange);
}
try {
  numberFormat = new Intl.NumberFormat();
} catch {
}

// src/treemap-vis/tree.ts
var orderChildrenBySize = (a, b) => {
  return b.bytesInOutput_ - a.bytesInOutput_ || +(a.inputPath_ > b.inputPath_) - +(a.inputPath_ < b.inputPath_);
};
var accumulatePath = (root2, source) => {
  let parts = splitPathBySlash(source.name);
  let n = parts.length;
  let parent = root2;
  let inputPath = "";
  root2.bytesInOutput_ += source.mappedByteTotal;
  for (let i = 0; i < n; i++) {
    let part = parts[i];
    let children = parent.children_;
    let child = children[part];
    let name = part + (i + 1 < n ? "/" : "");
    inputPath += name;
    if (!hasOwnProperty.call(children, part)) {
      child = {
        name_: name,
        source,
        inputPath_: inputPath,
        origPath: source.name,
        bytesInOutput_: 0,
        children_: {}
      };
      children[part] = child;
    }
    child.bytesInOutput_ += source.mappedByteTotal;
    parent = child;
  }
  return n;
};

// src/treemap-vis/whyfile.ts
var whyFileEl = document.createElement("div");
var isWhyFileVisible = () => whyFileEl.parentElement !== null;

// src/treemap-vis/color.css
var colorLegend = "color_colorLegend";
var chit = "color_chit";

// src/treemap-vis/color.ts
var previousPatternContext;
var previousPatternRatio;
var previousPatternScale;
var patternCanvas = document.createElement("canvas");
var patternContext = patternCanvas.getContext("2d");
var patternScale = 1;
var pattern;
var previousTree;
var previousColor = 0 /* NONE */;
var root;
var colorMapping = {};
var afterColorMappingUpdate = null;
var setAfterColorMappingUpdate = (callback) => afterColorMappingUpdate = callback;
var canvasFillStyleForInputPath = (c, inputPath, originX, originY, scale) => {
  let color = colorMapping[inputPath] || otherColor;
  if (color instanceof Array) {
    let ratio = window.devicePixelRatio || 1;
    if (previousPatternContext !== c || previousPatternRatio !== ratio || previousPatternScale !== scale) {
      let s = Math.round(64 * ratio) / 64;
      let t1;
      let t8;
      let lineWidth;
      patternScale = scale;
      patternScale = Math.log2(patternScale);
      patternScale -= Math.floor(patternScale);
      t1 = patternScale;
      t8 = Math.min(1, 8 * t1);
      patternScale = Math.pow(2, patternScale);
      lineWidth = 8 * Math.SQRT2 / patternScale;
      previousPatternContext = c;
      previousPatternRatio = ratio;
      previousPatternScale = scale;
      patternCanvas.width = patternCanvas.height = Math.round(64 * s);
      patternContext.scale(s, s);
      patternContext.fillStyle = color[0];
      patternContext.fillRect(0, 0, 64, 64);
      patternContext.globalAlpha = 0.25;
      patternContext.fillStyle = color[1];
      patternContext.fillRect(0, 0, 64, 64);
      patternContext.globalAlpha = 0.67;
      patternContext.strokeStyle = color[1];
      patternContext.beginPath();
      for (let i = 0; i <= 64; i += 16) {
        patternContext.moveTo(i - 32, i + 32);
        patternContext.lineTo(i + 32, i - 32);
      }
      patternContext.lineWidth = lineWidth * (1 - (t8 - t1) / 2);
      patternContext.stroke();
      if (t8 + t1 > 0) {
        patternContext.beginPath();
        for (let i = 8; i < 64; i += 16) {
          patternContext.moveTo(i - 32, i + 32);
          patternContext.lineTo(i + 32, i - 32);
        }
        patternContext.lineWidth = lineWidth * (t8 + t1) / 2;
        patternContext.stroke();
      }
      pattern = c.createPattern(patternCanvas, "repeat");
      patternScale /= s;
    }
    originX /= 64 * patternScale * ratio;
    originX -= Math.floor(originX);
    originX *= 64 * patternScale * ratio;
    pattern.setTransform(new DOMMatrix([
      patternScale,
      0,
      0,
      patternScale,
      originX,
      originY
    ]));
    return pattern;
  }
  return color;
};
var cssBackgroundForInputPath = (inputPath) => {
  let color = colorMapping[inputPath] || otherColor;
  if (color instanceof Array) {
    return `url('image/svg+xml,<svg width="26" height="26" xmlns="http://www.w3.org/2000/svg"><rect width="26" height="26" fill="${color[0]}"/><rect width="26" height="26" fill="${color[1]}" fill-opacity="25%"/><path d="M22.5 -3.5L-3.5 22.5M35.5 9.5L9.5 35.5" stroke="${color[1]}" stroke-opacity="67%" stroke-width="9.19239"/></svg>')`;
  }
  return color;
};
var updateColorMapping = (tree, color) => {
  if (previousTree !== tree) {
    previousTree = tree;
    previousColor = 0 /* NONE */;
    root = tree.root_;
  }
  if (previousColor !== color) {
    previousColor = color;
    colorMapping = {};
    colorLegendEl.innerHTML = "";
    if (color === 1 /* DIRECTORY */) {
      assignColorsByDirectory(colorMapping, root, 0, Math.PI * 2);
    } else if (color === 2 /* FORMAT */) {
      assignColorsByFormat(colorMapping, root);
      colorLegendEl.innerHTML = formatLegendHTML;
    }
    if (afterColorMappingUpdate) afterColorMappingUpdate();
  }
};
var assignColorsByDirectory = (colorMapping2, node, startAngle, sweepAngle) => {
  let totalBytes = node.bytesInOutput_;
  let children = node.sortedChildren_;
  let sorted = [];
  colorMapping2[node.inputPath_] = hueAngleToColor(startAngle + sweepAngle / 2);
  for (let child of children) {
    sorted.push(child);
  }
  for (let child of sorted.sort(orderChildrenBySize)) {
    let childSweepAngle = child.bytesInOutput_ / totalBytes * sweepAngle;
    assignColorsByDirectory(colorMapping2, child, startAngle, childSweepAngle);
    startAngle += childSweepAngle;
  }
};
var cjsColor = hueAngleToColor(3.5);
var esmColor = hueAngleToColor(1);
var otherColor = "#CCC";
var bothColor = [cjsColor, esmColor];
var colorForFormats = (formats) => {
  if (!formats) return otherColor;
  if (formats === 1 /* CJS */) return cjsColor;
  if (formats === 2 /* ESM */) return esmColor;
  return bothColor;
};
var moduleTypeLabelInputPath = (inputPath, prefix) => {
  let color = colorMapping[inputPath] || otherColor;
  if (color === otherColor) return "";
  if (color === esmColor) return prefix + "ESM";
  if (color === cjsColor) return prefix + "CJS";
  return prefix + "ESM & CJS";
};
var assignColorsByFormat = (colorMapping2, node) => {
  let children = node.sortedChildren_;
  let formats = 0;
  let hasChild = false;
  for (let child of children) {
    formats |= assignColorsByFormat(colorMapping2, child);
    hasChild = true;
  }
  if (!hasChild) {
    formats = 0;
  }
  colorMapping2[node.inputPath_] = colorForFormats(formats);
  return formats;
};
var colorLegendEl = document.createElement("div");
var formatLegendHTML = `<span class="${chit}" style="background:` + esmColor + `"></span>ESM <small>modern, faster, smaller</small><span class="${chit}" style="background:` + cjsColor + `"></span>CommonJS <small>legacy, slower, larger</small><span class="${chit}" style="background:` + otherColor + '"></span>Other';
colorLegendEl.id = colorLegend;

// src/treemap-vis/treemap.ts
var colorMode = [1 /* DIRECTORY */, 2 /* FORMAT */][Math.round(Math.random() * 0.01)];
var analyzeSourceMapTree = (sourceMapData) => {
  const sources = sourceMapData.sources;
  let maxDepth = 0;
  let commonPrefix;
  let rootNode = {
    name_: "",
    source: {},
    inputPath_: "",
    bytesInOutput_: 0,
    children_: {
      // If we eventually do a treemap of multiple bundles, this'll have to extrapolate.
      [sourceMapData.file]: {
        name_: sourceMapData.file,
        source: {},
        inputPath_: "",
        bytesInOutput_: 0,
        children_: {},
        origPath: ""
      }
    },
    origPath: ""
    // added origPath
  };
  let sortChildren = (node, isOutputFile) => {
    let children = node.children_;
    let sorted = [];
    for (let file in children) {
      sorted.push(sortChildren(children[file], false));
    }
    let name = commonPrefix ? splitPathBySlash(node.name_).slice(commonPrefix.length).join("/") : node.name_;
    return {
      name_: name,
      source: node.source,
      inputPath_: node.inputPath_,
      sizeText_: bytesToText(node.bytesInOutput_),
      bytesInOutput_: node.bytesInOutput_,
      sortedChildren_: sorted.sort(orderChildrenBySize),
      isOutputFile_: isOutputFile
    };
  };
  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex];
    if (isSourceMapPath(source.name)) continue;
    let depth = accumulatePath(rootNode.children_[sourceMapData.file], source);
    if (depth > maxDepth) maxDepth = depth;
  }
  rootNode.bytesInOutput_ = Object.values(rootNode.children_).reduce((sum, child) => sum + child.bytesInOutput_, 0);
  const root_ = sortChildren(rootNode, false);
  root_.sortedChildren_.forEach((child) => {
    child.isOutputFile_ = true;
  });
  return {
    root_,
    maxDepth_: maxDepth + 1
  };
};
var layoutTreemap = (sortedChildren, x, y, w, h) => {
  let children = [];
  let worst = (start, end, shortestSide, totalArea, bytesToArea) => {
    let maxArea = sortedChildren[start].bytesInOutput_ * bytesToArea;
    let minArea = sortedChildren[end].bytesInOutput_ * bytesToArea;
    return Math.max(
      shortestSide * shortestSide * maxArea / (totalArea * totalArea),
      totalArea * totalArea / (shortestSide * shortestSide * minArea)
    );
  };
  let squarify = (start, x2, y2, w2, h2) => {
    while (start < sortedChildren.length) {
      let totalBytes = 0;
      for (let i = start; i < sortedChildren.length; i++) {
        totalBytes += sortedChildren[i].bytesInOutput_;
      }
      let shortestSide = Math.min(w2, h2);
      let bytesToArea = w2 * h2 / totalBytes;
      let end = start;
      let areaInRun = 0;
      let oldWorst = 0;
      while (end < sortedChildren.length) {
        let area = sortedChildren[end].bytesInOutput_ * bytesToArea;
        let newWorst = worst(start, end, shortestSide, areaInRun + area, bytesToArea);
        if (end > start && oldWorst < newWorst) break;
        areaInRun += area;
        oldWorst = newWorst;
        end++;
      }
      let split = Math.round(areaInRun / shortestSide);
      let areaInLayout = 0;
      for (let i = start; i < end; i++) {
        let child = sortedChildren[i];
        let area = child.bytesInOutput_ * bytesToArea;
        let lower = Math.round(shortestSide * areaInLayout / areaInRun);
        let upper = Math.round(shortestSide * (areaInLayout + area) / areaInRun);
        let [cx, cy, cw, ch] = w2 >= h2 ? [x2, y2 + lower, split, upper - lower] : [x2 + lower, y2, upper - lower, split];
        children.push({
          node_: child,
          box_: [cx, cy, cw, ch],
          children_: cw > 8 /* INSET_X */ && ch > 24 /* INSET_Y */ ? layoutTreemap(
            child.sortedChildren_,
            cx + 4 /* PADDING */,
            cy + 20 /* HEADER_HEIGHT */,
            cw - 8 /* INSET_X */,
            ch - 24 /* INSET_Y */
          ) : []
        });
        areaInLayout += area;
      }
      start = end;
      if (w2 >= h2) {
        x2 += split;
        w2 -= split;
      } else {
        y2 += split;
        h2 -= split;
      }
    }
  };
  squarify(0, x, y, w, h);
  return children;
};
var createTreemap = (sourceMapData, getSplitPct) => {
  let tree = analyzeSourceMapTree(sourceMapData);
  updateColorMapping(tree, colorMode);
  let layoutNodes = [];
  let componentEl = document.createElement("div");
  let canvas = document.createElement("canvas");
  let c = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let animationFrame = null;
  let hoveredNode = null;
  let bgOriginX = 0;
  let bgOriginY = 0;
  let bgColor = "";
  let fgOnColor = "";
  let normalFont = "14px sans-serif", boldWidthCache = {};
  let boldFont = "bold " + normalFont, normalWidthCache = {};
  let ellipsisWidth = 0;
  let currentWidthCache = normalWidthCache;
  let currentNode = null;
  let currentLayout = null;
  let currentOriginX = 0;
  let currentOriginY = 0;
  let animationStart = 0;
  let animationBlend = 1;
  let animationSource = null;
  let animationTarget = null;
  let updateCurrentLayout = () => {
    if (currentNode) {
      let [ox1, oy1, ow, oh] = currentNode.box_;
      let ox2 = ox1 + ow;
      let oy2 = oy1 + oh;
      let nx1 = Math.round(width / 10);
      let ny1 = Math.round(height / 10);
      let nx2 = width - nx1 - 1;
      let ny2 = height - ny1 - 1;
      let t = animationTarget ? animationBlend : 1 - animationBlend;
      let x1 = Math.round(ox1 + (nx1 - ox1) * t);
      let y1 = Math.round(oy1 + (ny1 - oy1) * t);
      let x2 = Math.round(ox2 + (nx2 - ox2) * t);
      let y2 = Math.round(oy2 + (ny2 - oy2) * t);
      let wrap64 = (x) => x - Math.floor(x / 64 - 0.5) * 64;
      currentLayout = layoutTreemap([currentNode.node_], x1, y1, x2 - x1, y2 - y1)[0];
      currentOriginX = wrap64(-(ox1 + ox2) / 2) * (1 - t) + (x1 + x2) / 2;
      currentOriginY = wrap64(-(oy1 + oy2) / 2) * (1 - t) + (y1 + y2) / 2;
    } else {
      currentLayout = null;
      currentOriginX = 0;
      currentOriginY = 0;
    }
  };
  let resize = () => {
    let oldWidth = width;
    let oldHeight = height;
    let ratio = window.devicePixelRatio || 1;
    width = innerWidth;
    height = innerHeight * (1 - getSplitPct());
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.top = innerHeight * getSplitPct() + "px";
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    c.scale(ratio, ratio);
    if (width !== oldWidth || height !== oldHeight) {
      layoutNodes = layoutTreemap(tree.root_.sortedChildren_, 0, 0, width - 1, height - 1);
      updateCurrentLayout();
    }
    draw();
  };
  let tick = () => {
    let oldAnimationBlend = animationBlend;
    let oldCurrentNode = currentNode;
    animationBlend = (now() - animationStart) / 350 /* ANIMATION_DURATION */;
    if (animationBlend < 0 || animationBlend > 1) {
      currentNode = animationTarget;
      animationBlend = 1;
      animationFrame = null;
    } else {
      animationBlend = 1 - animationBlend;
      animationBlend *= animationBlend * animationBlend;
      animationBlend = 1 - animationBlend;
      animationFrame = requestAnimationFrame(tick);
    }
    if (animationBlend !== oldAnimationBlend || currentNode !== oldCurrentNode) {
      updateCurrentLayout();
    }
    draw();
  };
  let invalidate = () => {
    if (animationFrame === null) animationFrame = requestAnimationFrame(tick);
  };
  let charCodeWidth = (ch) => {
    let width2 = currentWidthCache[ch];
    if (width2 === void 0) {
      width2 = c.measureText(String.fromCharCode(ch)).width;
      currentWidthCache[ch] = width2;
    }
    return width2;
  };
  let textOverflowEllipsis = (text, width2) => {
    if (width2 < ellipsisWidth) return ["", 0];
    let textWidth = 0;
    let n = text.length;
    let i = 0;
    while (i < n) {
      let charWidth = charCodeWidth(text.charCodeAt(i));
      if (width2 < textWidth + ellipsisWidth + charWidth) {
        return [text.slice(0, i) + "...", textWidth + ellipsisWidth];
      }
      textWidth += charWidth;
      i++;
    }
    return [text, textWidth];
  };
  let drawNodeBackground = (layout, culling) => {
    let node = layout.node_;
    let [x, y, w, h] = layout.box_;
    let flags = (node === hoveredNode ? 1 /* CONTAINS_HOVER */ : 0) | (layout === animationTarget ? 2 /* CONTAINS_TARGET */ : 0);
    if (culling === 1 /* Enabled */ && currentLayout) {
      let [cx, cy, cw, ch] = currentLayout.box_;
      if (x >= cx && y >= cy && x + w <= cx + cw && y + h <= cy + ch) {
        culling = 2 /* Culled */;
      }
    }
    for (let child of layout.children_) {
      flags |= drawNodeBackground(child, culling);
    }
    if (culling !== 2 /* Culled */ && !node.isOutputFile_) {
      c.fillStyle = canvasFillStyleForInputPath(c, node.inputPath_, bgOriginX, bgOriginY, 1);
      if (layout.children_.length) {
        c.fillRect(x, y, w, 20 /* HEADER_HEIGHT */);
        c.fillRect(x, y + h - 4 /* PADDING */, w, 4 /* PADDING */);
        c.fillRect(x, y + 20 /* HEADER_HEIGHT */, 4 /* PADDING */, h - 24 /* INSET_Y */);
        c.fillRect(x + w - 4 /* PADDING */, y + 20 /* HEADER_HEIGHT */, 4 /* PADDING */, h - 24 /* INSET_Y */);
      } else {
        c.fillRect(x, y, w, h);
      }
    }
    return flags;
  };
  let drawNodeForeground = (layout, inCurrentNode) => {
    let node = layout.node_;
    let [x, y, w, h] = layout.box_;
    let isOutputFile = node.isOutputFile_;
    if (hoveredNode === node && !isOutputFile && (!currentNode || inCurrentNode)) {
      c.fillStyle = "rgba(255,255,255,0.5)";
      c.fillRect(x, y, w, h);
    }
    if (!isOutputFile) {
      strokeRectWithFirefoxBugWorkaround(c, "#222", x + 0.5, y + 0.5, w, h);
    }
    if (h >= 20 /* HEADER_HEIGHT */) {
      c.fillStyle = isOutputFile ? fgOnColor : "#000";
      if (isOutputFile) {
        c.font = boldFont;
        currentWidthCache = boldWidthCache;
        ellipsisWidth = 3 * charCodeWidth(46 /* DOT_CHAR_CODE */);
      }
      let maxWidth = w - 8 /* INSET_X */;
      let textY = y + Math.round(24 /* INSET_Y */ / 2);
      let [nameText, nameWidth] = textOverflowEllipsis(node.name_, maxWidth);
      let textX = x + Math.round((w - nameWidth) / 2);
      if (isOutputFile) {
        c.font = normalFont;
        currentWidthCache = normalWidthCache;
        ellipsisWidth = 3 * charCodeWidth(46 /* DOT_CHAR_CODE */);
      }
      if (nameText === node.name_ && node.sortedChildren_.length) {
        let detailText = " \u2013 " + (colorMode === 2 /* FORMAT */ ? moduleTypeLabelInputPath(node.inputPath_, "") : node.sizeText_);
        let [sizeText, sizeWidth] = textOverflowEllipsis(detailText, maxWidth - nameWidth);
        textX = x + Math.round((w - nameWidth - sizeWidth) / 2);
        c.globalAlpha = 0.5;
        c.fillText(sizeText, textX + nameWidth, textY);
        c.globalAlpha = 1;
      }
      if (isOutputFile) {
        c.font = boldFont;
        currentWidthCache = boldWidthCache;
        ellipsisWidth = 3 * charCodeWidth(46 /* DOT_CHAR_CODE */);
      }
      c.fillText(nameText, textX, textY);
      if (isOutputFile) {
        c.font = normalFont;
        currentWidthCache = normalWidthCache;
        ellipsisWidth = 3 * charCodeWidth(46 /* DOT_CHAR_CODE */);
      }
      if (h > 24 /* INSET_Y */ + 16 && !node.sortedChildren_.length) {
        let detailText = colorMode === 2 /* FORMAT */ ? moduleTypeLabelInputPath(node.inputPath_, "") : node.sizeText_;
        let [sizeText, sizeWidth] = textOverflowEllipsis(detailText, maxWidth);
        c.globalAlpha = 0.5;
        c.fillText(sizeText, x + Math.round((w - sizeWidth) / 2), y + 20 /* HEADER_HEIGHT */ + Math.round(h - 24 /* INSET_Y */) / 2);
        c.globalAlpha = 1;
      }
      for (let child of layout.children_) {
        drawNodeForeground(child, inCurrentNode);
      }
    }
  };
  let draw = () => {
    let bodyStyle = getComputedStyle(document.body);
    bgColor = bodyStyle.getPropertyValue("--bg");
    fgOnColor = bodyStyle.getPropertyValue("--fg-on");
    animationFrame = null;
    c.clearRect(0, 0, width, height);
    c.textBaseline = "middle";
    ellipsisWidth = c.measureText("...").width;
    let nodeContainingHover = null;
    let nodeContainingTarget = null;
    let transition = !currentLayout ? 0 : !animationSource ? animationBlend : !animationTarget ? 1 - animationBlend : 1;
    bgOriginX = bgOriginY = 0;
    for (let node of layoutNodes) {
      let flags = drawNodeBackground(node, 1 /* Enabled */);
      if (flags & 1 /* CONTAINS_HOVER */) nodeContainingHover = node;
      if (flags & 2 /* CONTAINS_TARGET */) nodeContainingTarget = node;
    }
    for (let node of layoutNodes) {
      drawNodeForeground(node, false);
      if (currentLayout || nodeContainingHover && node !== nodeContainingHover) {
        let [x, y, w, h] = node.box_;
        c.globalAlpha = 0.6 * (!currentLayout || !animationSource && nodeContainingTarget && node !== nodeContainingTarget ? 1 : transition);
        c.fillStyle = bgColor;
        c.fillRect(x, y, w, h);
        c.globalAlpha = 1;
      }
    }
    if (currentLayout) {
      let [x, y, w, h] = currentLayout.box_;
      let matrix = c.getTransform();
      let scale = Math.sqrt(matrix.a * matrix.d);
      c.save();
      c.shadowColor = "rgba(0,0,0,0.5)";
      c.shadowBlur = scale * (30 * transition);
      c.shadowOffsetX = scale * (2 * width);
      c.shadowOffsetY = scale * (2 * height + 15 * transition);
      c.fillRect(x - 2 * width, y - 2 * height, w, h);
      c.restore();
      bgOriginX = currentOriginX;
      bgOriginY = currentOriginY;
      drawNodeBackground(currentLayout, 0 /* Disabled */);
      drawNodeForeground(currentLayout, true);
    }
  };
  let tooltipEl = document.createElement("div");
  let showTooltip = (x, y, html) => {
    tooltipEl.style.display = "block";
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
    tooltipEl.classList.add("tooltip");
    tooltipEl.innerHTML = html;
    let right = tooltipEl.offsetWidth;
    for (let el = tooltipEl; el; el = el.offsetParent) {
      right += el.offsetLeft;
    }
    if (right > width) {
      tooltipEl.style.left = x + width - right + "px";
    }
  };
  let hideTooltip = () => {
    tooltipEl.style.display = "none";
  };
  let hitTestNode = (mouseEvent) => {
    let visit = (nodes, isTopLevel) => {
      for (let node of nodes) {
        let [x, y, w, h] = node.box_;
        if (mouseX >= x && mouseY >= y && mouseX < x + w && mouseY < y + h) {
          return visit(node.children_, false) || (isTopLevel ? null : node);
        }
      }
      return null;
    };
    let mouseX = mouseEvent.pageX;
    let mouseY = mouseEvent.pageY;
    for (let el = canvas; el; el = el.offsetParent) {
      mouseX -= el.offsetLeft;
      mouseY -= el.offsetTop;
    }
    return currentLayout ? visit([currentLayout], false) : visit(layoutNodes, true);
  };
  let updateHover = (e) => {
    let layout = hitTestNode(e);
    changeHoveredNode(layout && layout.node_);
    if (layout) {
      let node = layout.node_;
      let tooltip = node.name_ === node.inputPath_ ? shortenDataURLForDisplay(node.inputPath_) : node.inputPath_;
      let nameSplit = tooltip.length - node.name_.length;
      tooltip = textToHTML(tooltip.slice(0, nameSplit)) + "<b>" + textToHTML(tooltip.slice(nameSplit)) + "</b>";
      tooltip += colorMode === 2 /* FORMAT */ ? textToHTML(moduleTypeLabelInputPath(node.inputPath_, " \u2013 ")) : " \u2013 " + textToHTML(bytesToText(node.bytesInOutput_));
      showTooltip(e.pageX, e.pageY + 20, tooltip);
    } else {
      hideTooltip();
    }
  };
  let changeHoveredNode = (node) => {
    if (hoveredNode !== node) {
      hoveredNode = node;
      canvas.style.cursor = node ? node.sortedChildren_.length ? currentLayout?.node_ === node ? "auto" : "zoom-in" : "pointer" : "auto";
      invalidate();
      let backgroundColor;
      if (node && !node.sortedChildren_.length) {
        backgroundColor = onNodeSelection(sourceMapData, node);
      }
      componentEl?.onNodeSelection(backgroundColor);
    }
  };
  componentEl.onNodeSelection = null;
  let searchFor = (children, node) => {
    for (let child of children) {
      let result = child.node_ === node ? child : searchFor(child.children_, node);
      if (result) return result;
    }
    return null;
  };
  let changeCurrentNode = (node) => {
    if (currentNode !== node) {
      animationBlend = 0;
      animationStart = now();
      animationSource = currentNode;
      animationTarget = node;
      currentNode = node || searchFor(layoutNodes, currentNode.node_);
      updateCurrentLayout();
      invalidate();
    }
  };
  canvas.onmousemove = (e) => {
    updateHover(e);
  };
  canvas.onmouseout = (e) => {
    changeHoveredNode(null);
    hideTooltip();
  };
  componentEl.onclick = (e) => {
    let layout = hitTestNode(e);
    if (layout) {
      let node = layout.node_;
      if (!node.sortedChildren_.length) {
        onNodeSelection(sourceMapData, node);
        updateHover(e);
      } else if (layout !== currentLayout) {
        changeCurrentNode(layout);
        changeHoveredNode(null);
        hideTooltip();
      } else {
        updateHover(e);
      }
    } else if (currentNode) {
      changeCurrentNode(null);
      updateHover(e);
    }
  };
  setWheelEventListener((e) => {
    if (isWhyFileVisible()) return;
    updateHover(e);
  });
  resize();
  Promise.resolve().then(resize);
  setDarkModeListener(draw);
  setAfterColorMappingUpdate(draw);
  setResizeEventListener(resize);
  componentEl.id = "treemapPanel";
  componentEl.innerHTML = `<div class="index_summary"></div>`;
  componentEl.append(canvas, tooltipEl);
  let sectionEl = document.createElement("section");
  sectionEl.append(colorLegendEl);
  componentEl.append(sectionEl);
  componentEl.highlightNode = (hover, sourceIndex) => {
    const originalSource = sourceMapData.sources[sourceIndex];
    if (originalSource) {
      const inputPath = originalSource.name;
      const findNodeByInputPath = (nodes, targetInputPath) => {
        for (const n of nodes) {
          if (n.node_.inputPath_ === targetInputPath) {
            return n.node_;
          }
          const foundInChildren = findNodeByInputPath(n.children_, targetInputPath);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
        return null;
      };
      hoveredNode = findNodeByInputPath(layoutNodes, inputPath);
      draw();
    }
  };
  componentEl.resize = resize;
  return componentEl;
};
var onNodeSelection = (sourceMapData, node) => {
  const encoder = new TextEncoder();
  const byteLength = (str) => encoder.encode(str).length;
  window.fileList.value = node.inputPath_;
  window.fileList.reveal();
  return cssBackgroundForInputPath(node.inputPath_);
};
export {
  createTreemap
};
//# sourceMappingURL=treemap.js.map
