import getFontFamilyName from 'common/util/text/getFontFamilyName'
import warmupFont from 'common/util/text/warmupFont'

const imageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gif']
const videoExtensions = ['mp4', 'mkv', 'avi']
const fontExtensions = ['ttf', 'woff', 'woff2', 'eot']

const loadedResources = new Map<string, LoadedResource>()
const pendingResources = new Map<string, Promise<void>>()

type LoadedResource = HTMLImageElement | HTMLVideoElement | HTMLStyleElement
type RequireManyResult = { [sourceName: string]: LoadedResource } | undefined

export function startLoading(source: string) {
  requireResource(source)
}

export function requireMany(sources: string[]): RequireManyResult {
  const result: RequireManyResult = {}

  for (const item of sources) {
    const resource = requireResource(item)
    if (!resource) return
    result[item] = resource
  }

  return result
}

export function requireResource(source: string, overrideExtension?: string): LoadedResource | undefined {
  if (!loadedResources.get(source)) {
    requireResourceAsync(source, overrideExtension)
    return
  } else return loadedResources.get(source)
}

export async function requireResourceAsync(source: string, overrideExtension?: string): Promise<LoadedResource> {
  if (loadedResources.get(source)) return loadedResources.get(source)
  if (!pendingResources.has(source)) {
    pendingResources.set(
      source,
      new Promise(async (resolve, reject) => {
        const fileName = source.split('/').pop()
        const extension = overrideExtension ? overrideExtension : fileName.split('.').pop()
        if (fileName == extension) reject('Files without extension is not allowed')

        const onLoad = (element: LoadedResource) => {
          loadedResources.set(source, element)
          pendingResources.delete(source)
          resolve()
        }

        const handleMedia = (tagName: string) => {
          let el = document.querySelector(`${tagName}[data-res-id="${fileName}"]`) as
            | HTMLImageElement
            | HTMLVideoElement
          if (!el) {
            console.warn('Presentation runtime compiler error')
            el = document.querySelector('img[data-placeholder-img]')
            if (tagName == 'img') {
              const img = el as HTMLImageElement
              if (img.complete) return onLoad(el)
            }
          }
          if (tagName == 'img') el.addEventListener('load', () => onLoad(el))
          else el.addEventListener('loadedmetadata', () => onLoad(el))
        }

        const handleFont = async () => {
          const fontFamily = getFontFamilyName(source)
          const style = document.querySelector(`style[data-res-id="${fileName}"]`) as HTMLStyleElement
          if (!style) return onLoad(document.createElement('style'))
          warmupFont(fontFamily)
          document.fonts.ready.then(() => onLoad(style))
        }

        if (imageExtensions.includes(extension)) handleMedia('img')
        if (videoExtensions.includes(extension)) handleMedia('video')
        if (fontExtensions.includes(extension)) handleFont()
      })
    )
  }
  await pendingResources.get(source)
  return loadedResources.get(source)
}

type CSSOMString = string
type FontFaceLoadStatus = 'unloaded' | 'loading' | 'loaded' | 'error'
type FontFaceSetStatus = 'loading' | 'loaded'

interface FontFace {
  family: CSSOMString
  style: CSSOMString
  weight: CSSOMString
  stretch: CSSOMString
  unicodeRange: CSSOMString
  variant: CSSOMString
  featureSettings: CSSOMString
  variationSettings: CSSOMString
  display: CSSOMString
  readonly status: FontFaceLoadStatus
  readonly loaded: Promise<FontFace>
  load(): Promise<FontFace>
}

interface FontFaceSet {
  readonly status: FontFaceSetStatus
  readonly ready: Promise<FontFaceSet>
  check(font: string, text?: string): Boolean
  load(font: string, text?: string): Promise<FontFace[]>
}

declare global {
  interface Document {
    fonts: FontFaceSet
  }
}
