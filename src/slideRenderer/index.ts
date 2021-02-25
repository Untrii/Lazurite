import Presentation from '@/models/presentation/Presentation'
import Slide from '@/models/presentation/Slide'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import renderText from './objectRenderers/renderText'

export default function render(
  ctx: CanvasRenderingContext2D,
  presentation: Presentation,
  slideIndex: number
) {
  let targetWidth = ctx.canvas.width
  let resolution = new RendererResolution(
    presentation.resolution.width,
    presentation.resolution.height
  )
  resolution.targetWidth = targetWidth

  ctx.rect(0, 0, resolution.targetWidth, resolution.targetHeight)
  ctx.fillStyle = 'red'
  ctx.fill()

  let slide = presentation.slides[slideIndex]
  for (const objectID in slide) {
    const object = slide[objectID]
    switch (object.type) {
      case TextSlideObject.name:
        renderText(object as TextSlideObject, ctx, resolution)
        break
      default:
        console.error('Missing renderer for ' + object.type)
    }
  }
}
