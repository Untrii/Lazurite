import RendererResolution from '@/models/slideRenderer/RendererResolution'

export default function renderSelectBox(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  selectBox: { left: number; top: number; right: number; bottom: number }
) {
  const scale = function (...values: number[]) {
    return values.map((value) => Math.floor(value * resolution.scale))
  }

  let { left, top, right, bottom } = selectBox
  ;[left, top, right, bottom] = scale(left, top, right, bottom)
  const width = right - left
  const height = bottom - top
  if (width < 2 || height < 2) return

  ctx.setLineDash([])
  ctx.fillStyle = '#058CD866'
  ctx.fillRect(left, top, width, height)
  ctx.strokeStyle = '#058CD8'
  ctx.lineWidth = 1
  ctx.strokeRect(left + 0.5, top + 0.5, width - 1, height - 1)
}
