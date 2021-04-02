import Presentation from '@/models/presentation/Presentation'
import Slide from '@/models/presentation/Slide'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import renderText from './objectRenderers/renderText'
import renderBackground from './renderBackground'

export default function render(
  ctx: CanvasRenderingContext2D,
  presentation: Presentation,
  presentationPath: string,
  slide: Slide
) {
  try {
    let targetWidth = ctx.canvas.width
    let resolution = new RendererResolution(presentation.resolution.width, presentation.resolution.height)
    resolution.targetWidth = targetWidth

    if (targetWidth < 4) return

    renderBackground(ctx, resolution, presentation.theme.background, presentationPath)

    for (const objectID in slide) {
      const object = slide[objectID]
      switch (object.type) {
        case TextSlideObject.name:
          renderText(ctx, resolution, object as TextSlideObject)
          break
        default:
          console.error('Missing renderer for ' + object.type)
      }
    }
  } catch {
    requestAnimationFrame(() => render(ctx, presentation, presentationPath, slide))
  }
}
