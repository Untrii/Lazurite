import { requireResource } from '@/dataLoader'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

const cache = new Map<HTMLImageElement, Map<number, HTMLCanvasElement>>()

export function getRenderImageDeps(object: ImageSlideObject) {
  const { left, top, width, height } = object
  return [left, top, width, height]
}

export default function renderImage(
  context: CanvasRenderingContext2D,
  resolution: RendererResolution,
  object: ImageSlideObject
) {
  let { top, left, width, height } = object
  top *= resolution.scale
  left *= resolution.scale
  width *= resolution.scale
  height *= resolution.scale

  const image = requireResource(object.src) as HTMLImageElement | undefined
  if (!image) {
    throw new Error(`Image ${object.src} not loaded`)
  }

  const identifier = width + height

  if (!cache.has(image)) cache.set(image, new Map())
  const cachedImages = cache.get(image)
  if (!cachedImages.get(identifier)) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = Math.ceil(width)
    canvasElement.height = Math.ceil(height)
    canvasElement.getContext('2d').drawImage(image, 0, 0, width, height)
    cachedImages.clear()
    cachedImages.set(identifier, canvasElement)
  }
  const cachedImage = cachedImages.get(identifier)
  context.drawImage(cachedImage, left, top)
}
