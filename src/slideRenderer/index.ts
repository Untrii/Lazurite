import { startLoading } from '@/dataLoader'
import ObjectSelection from '@/models/editor/ObjectSelection'
import Presentation from '@/models/presentation/Presentation'
import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import renderImage from './objectRenderers/renderImage'
import renderText from './objectRenderers/renderText'
import renderBackground from './renderBackground'
import renderSelection from './renderSelection'

export default function render(
  ctx: CanvasRenderingContext2D,
  presentation: Presentation,
  slide: Slide,
  requestRerender = () => {},
  selection?: ObjectSelection,
  highlight?: SlideObject
) {
  let targetWidth = ctx.canvas.width
  let resolution = new RendererResolution(presentation.resolution.width, presentation.resolution.height)

  try {
    resolution.targetWidth = targetWidth

    if (targetWidth < 4) return

    renderBackground(ctx, resolution, presentation.theme.background)

    for (const object of slide) {
      switch (object.type) {
        case TextSlideObject.name:
          renderText(ctx, resolution, object as TextSlideObject)
          break
        case ImageSlideObject.name:
          renderImage(ctx, resolution, object as ImageSlideObject)
          break
        default:
          console.error('Missing renderer for ' + object.type)
      }
    }
  } catch (err) {
    requestRerender()
    console.warn(err)
  } finally {
    if (selection) {
      renderSelection(ctx, resolution, selection, highlight, requestRerender)
    }
  }
}
