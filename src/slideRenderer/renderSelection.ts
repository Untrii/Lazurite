import ObjectSelection from '@/models/editor/ObjectSelection'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

const dashAnimationSpeed = 8

export default function renderSelection(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  selection: ObjectSelection,
  highlight: SlideObject | null,
  requestRender: () => void
) {
  ctx.strokeStyle = '#058CD8'
  //const offset = (performance.now() / 1000) * dashAnimationSpeed
  //ctx.lineDashOffset = offset

  const renderOutline = function (slideObject: SlideObject) {
    const [left, top, right, bottom] = [
      Math.floor(slideObject.left * resolution.scale),
      Math.floor(slideObject.top * resolution.scale),
      Math.floor(slideObject.right * resolution.scale),
      Math.floor(slideObject.bottom * resolution.scale),
    ]
    ctx.strokeRect(left, top, right - left, bottom - top)
  }

  ctx.setLineDash([4, 4])
  ctx.lineWidth = 2
  for (const item of selection.items) renderOutline(item)

  if (highlight && !selection.isInSelection(highlight)) {
    ctx.lineDashOffset = 0
    renderOutline(highlight)
  }

  const [outerTop, outerBottom, outerLeft, outerRight] = [
    Math.floor(selection.top * resolution.scale),
    Math.floor(selection.bottom * resolution.scale),
    Math.floor(selection.left * resolution.scale),
    Math.floor(selection.right * resolution.scale),
  ]

  ctx.setLineDash([])
  ctx.lineWidth = 2
  ctx.strokeRect(outerLeft, outerTop, outerRight - outerLeft, outerBottom - outerTop)
  if (selection.size > 1) requestRender()
}
