import { requireResource } from '@/dataLoader'
import TextSlideObject from 'common/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'
import getFontScale from 'common/util/text/getFontScale'
import getTextLines from 'common/util/text/getTextLines'
import getTextWidth from 'common/util/text/getTextWidth'

const loadedFonts = new Set<string>()

export function getRenderTextDeps(object: TextSlideObject) {
  const { top, left, width, height, horizontalAlign, verticalAlign, style, content } = object
  const { fontSize, fontWeight, fontFamily, fontSource } = style

  return [
    left,
    top,
    width,
    height,
    content,
    horizontalAlign,
    verticalAlign,
    fontSize,
    fontWeight,
    fontFamily,
    fontSource,
    style.color.toHex(),
  ]
}

export default function renderText(
  context: CanvasRenderingContext2D,
  resolution: RendererResolution,
  object: TextSlideObject
) {
  const { fontSize, fontWeight, fontFamily, fontSource } = object.style
  const lines = getTextLines(object)
  const lineHeight = fontSize * getFontScale(fontFamily, fontWeight)
  const totalLinesHeight = lines.length * lineHeight
  const { top, left, width, height, horizontalAlign, verticalAlign, style } = object

  const font = requireResource(fontSource)
  if (!font) throw new Error("Font doesn't loaded")

  context.font = `normal ${fontWeight} ${fontSize * resolution.scale}px ${fontFamily}`
  context.fillStyle = style.color.toHex()
  context.textBaseline = 'top'

  let blockOffsetY = top

  switch (verticalAlign) {
    case 'center':
      blockOffsetY += (height - totalLinesHeight) / 2
      break
    case 'bottom':
      blockOffsetY += height - totalLinesHeight
      break
  }

  const getOffsetX = function (line: string) {
    const lineWidth = getTextWidth(style, line)
    switch (horizontalAlign) {
      case 'left':
        return 0
      case 'center':
        return (width - lineWidth) / 2
      case 'right':
        return width - lineWidth
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    const offsetX = (left + getOffsetX(currentLine)) * resolution.scale
    const offsetY = (blockOffsetY + lineHeight * i) * resolution.scale
    context.fillText(currentLine, offsetX, offsetY)
  }
}
