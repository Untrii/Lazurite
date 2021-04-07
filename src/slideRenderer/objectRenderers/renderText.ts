import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import getFontScale from '@/util/getFontScale'
import getTextLines from '@/util/getTextLines'
import getTextWidth from '@/util/getTextWidth'

export default function renderText(
  context: CanvasRenderingContext2D,
  resolution: RendererResolution,
  object: TextSlideObject
) {
  const { fontSize, fontWeight, fontFamily } = object.style
  const lines = getTextLines(object)
  const lineHeight = fontSize * getFontScale(fontFamily, fontWeight)
  const totalLinesHeight = lines.length * lineHeight
  const { top, left } = object

  if (!document.fonts.check('12px ' + fontFamily)) throw new Error("Font doesn't loaded")

  context.font = `normal ${fontWeight} ${fontSize * resolution.scale}px ${fontFamily}`
  context.fillStyle = object.style.color.toHex()
  context.textBaseline = 'top'

  let blockOffsetY = object.top

  switch (object.verticalAlign) {
    case 'middle':
      blockOffsetY += (object.height - totalLinesHeight) / 2
      break
    case 'bottom':
      blockOffsetY += object.height - totalLinesHeight
      break
  }

  const getOffsetX = function (line: string) {
    const lineWidth = getTextWidth(object.style, line)
    switch (object.horizontalAlign) {
      case 'left':
        return 0
      case 'middle':
        return (object.width - lineWidth) / 2
      case 'right':
        return object.width - lineWidth
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    const offsetX = (object.left + getOffsetX(currentLine)) * resolution.scale
    const offsetY = (blockOffsetY + lineHeight * i) * resolution.scale
    context.fillText(currentLine, offsetX, offsetY)
  }
}
