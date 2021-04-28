import ObjectSelection from '@/models/editor/ObjectSelection'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

const dashAnimationSpeed = 8

let prevSelectionComposite = document.createElement('canvas')
let prevSelectionIdentity = []

function createComposite(width: number, height: number) {
  const result = document.createElement('canvas')
  result.width = width
  result.height = height
  return result
}

export default function renderSelection(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  selection: ObjectSelection,
  highlight: SlideObject | null,
  guideLines: { x?: number; y?: number } | null
) {
  const [outerTop, outerBottom, outerLeft, outerRight] = [
    Math.floor(selection.top * resolution.scale),
    Math.floor(selection.bottom * resolution.scale),
    Math.floor(selection.left * resolution.scale),
    Math.floor(selection.right * resolution.scale),
  ]

  const selectionWidth = outerRight - outerLeft + 2
  const selectionHeight = outerBottom - outerTop + 2

  const currentSelectionIdentity: any[] = [selectionWidth, selectionHeight]
  selection.items.forEach((item) => currentSelectionIdentity.push(item.id))
  const isSimilarIdentity = currentSelectionIdentity.length == prevSelectionIdentity.length

  let isSame = isSimilarIdentity
  for (let i = 0; isSame && i < currentSelectionIdentity.length; i++) {
    if (currentSelectionIdentity[i] !== prevSelectionIdentity[i]) isSame = false
  }

  if (isSame) {
    ctx.drawImage(prevSelectionComposite, outerLeft, outerTop)
  }

  let currentSelectionComposite = createComposite(selectionWidth, selectionHeight)
  let currentContext = currentSelectionComposite.getContext('2d')
  ctx.strokeStyle = '#058CD8'

  const renderOutline = function (
    ctx: CanvasRenderingContext2D,
    slideObject: SlideObject,
    offsetX = -outerLeft,
    offsetY = -outerTop
  ) {
    const [left, top, right, bottom] = [
      Math.floor(slideObject.left * resolution.scale),
      Math.floor(slideObject.top * resolution.scale),
      Math.floor(slideObject.right * resolution.scale),
      Math.floor(slideObject.bottom * resolution.scale),
    ]
    ctx.strokeRect(left + offsetX + 1, top + offsetY + 1, right - left - 1, bottom - top - 1)
  }

  ctx.setLineDash([4, 4])
  ctx.lineWidth = 2

  if (highlight && !selection.isInSelection(highlight)) {
    ctx.lineDashOffset = 0
    renderOutline(ctx, highlight, 0, 0)
  }

  if (selectionWidth == Number.NEGATIVE_INFINITY || selectionHeight == Number.NEGATIVE_INFINITY) return
  if (selectionWidth == 0 || selectionHeight == 0) return

  if (!isSame) {
    currentContext.strokeStyle = '#058CD8'
    currentContext.setLineDash([4, 4])
    currentContext.lineWidth = 2
    for (const item of selection.items) renderOutline(currentContext, item)

    currentContext.setLineDash([])
    currentContext.lineWidth = 2
    currentContext.strokeRect(1, 1, selectionWidth - 3, selectionHeight - 3)

    ctx.drawImage(currentSelectionComposite, outerLeft, outerTop)
    prevSelectionComposite = currentSelectionComposite
    prevSelectionIdentity = currentSelectionIdentity
  }

  if (guideLines) {
    ctx.lineWidth = 1
    if (guideLines.x > 0) {
      const scaledX = Math.floor(guideLines.x * resolution.scale)
      ctx.beginPath()
      ctx.moveTo(scaledX + 0.5, 0)
      ctx.lineTo(scaledX + 0.5, resolution.targetHeight)
      ctx.stroke()
    }
    if (guideLines.y > 0) {
      const scaledY = Math.floor(guideLines.y * resolution.scale)
      ctx.beginPath()
      ctx.moveTo(0, scaledY + 0.5)
      ctx.lineTo(resolution.targetWidth, scaledY + 0.5)
      ctx.stroke()
    }
  }
}
