import ObjectSelection from '@/models/editor/ObjectSelection'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

export default function renderSelection(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  selection: ObjectSelection
) {
  //outer selection
  if (selection.isEmpty) return

  const [outerTop, outerBottom, outerLeft, outerRight] = [
    Math.floor(selection.top * resolution.scale),
    Math.floor(selection.bottom * resolution.scale),
    Math.floor(selection.left * resolution.scale),
    Math.floor(selection.right * resolution.scale),
  ]

  ctx.strokeStyle = '#058CD8'
  ctx.lineWidth = 2
  ctx.strokeRect(outerLeft, outerTop, outerRight - outerLeft, outerBottom - outerTop)
}
