import ObjectSelection from '@/models/editor/ObjectSelection'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

const dashAnimationSpeed = 8
const selectionColor = '#058CD8'
const guideLinesColor = '#F07427'
const shadowOutlineColor = '#00000020'

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
  slideObjects: SlideObject[],
  highlight: SlideObject | null,
  highlightAll = false,
  guideLines: { x?: number[]; y?: number[] } | null
) {
  const scale = function (...values: number[]) {
    return values.map((value) => Math.floor(value * resolution.scale))
  }

  const [outerTop, outerBottom, outerLeft, outerRight] = scale(
    selection.top,
    selection.bottom,
    selection.left,
    selection.right
  )

  if (guideLines) {
    ctx.lineWidth = 1
    ctx.strokeStyle = guideLinesColor
    ctx.setLineDash([])
    for (const x of guideLines.x ?? []) {
      const scaledX = Math.floor(x * resolution.scale)
      ctx.beginPath()
      ctx.moveTo(scaledX + 0.5, 0)
      ctx.lineTo(scaledX + 0.5, resolution.targetHeight)
      ctx.stroke()
    }
    for (const y of guideLines.y ?? []) {
      const scaledY = Math.floor(y * resolution.scale)
      ctx.beginPath()
      ctx.moveTo(0, scaledY + 0.5)
      ctx.lineTo(resolution.targetWidth, scaledY + 0.5)
      ctx.stroke()
    }
  }

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
  ctx.strokeStyle = selectionColor

  const renderOutline = function (
    ctx: CanvasRenderingContext2D,
    slideObject: SlideObject,
    offsetX = -outerLeft,
    offsetY = -outerTop,
    outlineWidth = 2
  ) {
    const [left, top, right, bottom] = scale(slideObject.left, slideObject.top, slideObject.right, slideObject.bottom)
    ctx.strokeRect(left + offsetX + outlineWidth / 2, top + offsetY + outlineWidth / 2, right - left, bottom - top)
  }

  ctx.setLineDash([4, 4])
  ctx.lineWidth = 2

  if (highlight && !selection.isInSelection(highlight)) {
    ctx.lineDashOffset = 0
    renderOutline(ctx, highlight, 0, 0)
  }

  if (selectionWidth == Number.NEGATIVE_INFINITY || selectionHeight == Number.NEGATIVE_INFINITY) return
  if (selectionWidth == 0 || selectionHeight == 0) return

  if (highlightAll) {
    ctx.strokeStyle = shadowOutlineColor
    ctx.setLineDash([])
    ctx.lineWidth = 1
    for (const item of slideObjects) {
      if (item instanceof TextSlideObject) renderOutline(ctx, item, 0, 0, 1)
    }
  }

  if (!isSame) {
    currentContext.strokeStyle = selectionColor
    currentContext.setLineDash([4, 4])
    currentContext.lineWidth = 2
    for (const item of selection.items) renderOutline(currentContext, item)

    currentContext.strokeStyle = selectionColor
    currentContext.setLineDash([])
    currentContext.lineWidth = 2
    currentContext.strokeRect(1, 1, selectionWidth - 2, selectionHeight - 2)

    ctx.drawImage(currentSelectionComposite, outerLeft, outerTop)
    prevSelectionComposite = currentSelectionComposite
    prevSelectionIdentity = currentSelectionIdentity
  }
}
