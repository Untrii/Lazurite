import { requireResource } from '@/dataLoader'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

interface CompressLevels {
  original: HTMLImageElement | HTMLCanvasElement
  '1080p': HTMLImageElement | HTMLCanvasElement
  '720p': HTMLImageElement | HTMLCanvasElement
  '360p': HTMLImageElement | HTMLCanvasElement
}

const compressed = new Map<HTMLImageElement, CompressLevels>()
const cache = new Map<HTMLImageElement, Map<number, HTMLCanvasElement>>()

function compress(image: HTMLImageElement): CompressLevels {
  const ratio = image.naturalHeight / image.naturalWidth

  const second = document.createElement('canvas')
  second.width = 1280
  second.height = 1280 * ratio
  second.getContext('2d', { alpha: false }).drawImage(image, 0, 0, 1280, 1280 * ratio)

  const third = document.createElement('canvas')
  third.width = 640
  third.height = 640 * ratio
  third.getContext('2d', { alpha: false }).drawImage(image, 0, 0, 640, 640 * ratio)
  return {
    original: image,
    '1080p': image,
    '720p': second,
    '360p': third,
  }
}

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

  if (!compressed.has(image)) {
    compressed.set(image, compress(image))
  }

  const compressedLevels = compressed.get(image)
  if (width > 1920) return context.drawImage(compressedLevels.original, left, top, width, height)
  if (width > 1280) return context.drawImage(compressedLevels['1080p'], left, top, width, height)
  if (width > 640) return context.drawImage(compressedLevels['720p'], left, top, width, height)
  context.drawImage(compressedLevels['360p'], left, top, width, height)
}
