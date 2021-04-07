import ObjectSelection from '@/models/editor/ObjectSelection'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

export default function renderSelection(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  selection: ObjectSelection
) {
  if (selection.isEmpty) return

  ctx.strokeStyle = '#058CD8'
  for (const item of selection.items) {
    const [left, top, right, bottom] = [
      Math.floor(item.left * resolution.scale),
      Math.floor(item.top * resolution.scale),
      Math.floor(item.right * resolution.scale),
      Math.floor(item.bottom * resolution.scale),
    ]
    ctx.setLineDash([4, 4])
    ctx.lineWidth = 2
    ctx.strokeRect(left, top, right - left, bottom - top)
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
}
