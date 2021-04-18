import { requireResource } from '@/dataLoader'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

export default function (context: CanvasRenderingContext2D, resolution: RendererResolution, object: ImageSlideObject) {
  let { top, left, width, height } = object
  ;[top, left, width, height] = [top, left, width, height].map((item) => item * resolution.scale)

  const image = requireResource(object.src) as HTMLImageElement | undefined
  if (!image) {
    console.warn(`Image ${object.src} not loaded`)
    return
  }

  context.drawImage(image, left, top, width, height)
}
