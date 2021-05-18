import { requireResource } from '@/dataLoader'
import ImageSlideObject from 'common/models/presentation/slideObjects/ImageSlideObject'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'

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
  second.width = Math.min(1280, image.naturalWidth)
  second.height = Math.min(1280 * ratio, image.naturalHeight)
  second.getContext('2d').drawImage(image, 0, 0, second.width, second.height)

  const third = document.createElement('canvas')
  third.width = Math.min(640, image.naturalWidth)
  third.height = Math.min(640 * ratio, image.naturalHeight)
  third.getContext('2d').drawImage(image, 0, 0, third.width, third.height)
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
