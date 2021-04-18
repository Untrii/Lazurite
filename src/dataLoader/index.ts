import getFontFamilyName from '@/util/text/getFontFamilyName'
import isElectron from '@/util/isElectron'
import warmupFont from '@/util/text/warmupFont'
import { ipcRenderer } from 'electron'

const imageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gif']
const videoExtensions = ['mp4', 'mkv', 'avi']
const fontExtensions = ['ttf', 'woff', 'woff2', 'eot']

const loadedResources = new Map<string, LoadedResource>()
const pendingResources = new Map<string, Promise<void>>()

type LoadedResource = HTMLImageElement | HTMLVideoElement | HTMLStyleElement
type RequireManyResult = { [sourceName: string]: LoadedResource } | undefined

const contexts = {}
function applyContext(source: string) {
  for (const contextName in contexts) {
    source = source.replace('#' + contextName, contexts[contextName])
  }
  return source
}

export function setContext(contextName: string, value: string) {
  if (contextName == 'proj' && isElectron()) ipcRenderer.sendSync('setProjectContext', value)
  contexts[contextName] = value
}

export function startLoading(source: string) {
  source = applyContext(source)
  requireResource(source)
}

export function requireMany(sources: string[]): RequireManyResult {
  const result: RequireManyResult = {}

  for (const item of sources) {
    const resource = requireResource(applyContext(item))
    if (!resource) return
    result[item] = resource
  }

  return result
}

export function requireResource(source: string, overrideExtension?: string): LoadedResource | undefined {
  source = applyContext(source)
  if (!loadedResources.get(source)) {
    requireResourceAsync(source, overrideExtension)
    return
  } else return loadedResources.get(source)
}

export async function requireResourceAsync(source: string, overrideExtension?: string): Promise<LoadedResource> {
  source = applyContext(source)
  if (loadedResources.get(source)) return loadedResources.get(source)
  const startTime = performance.now()
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
          const el = document.createElement(tagName) as HTMLImageElement | HTMLVideoElement
          el.src = source
          if (tagName == 'img') el.onload = () => onLoad(el)
          else el.onloadedmetadata = () => onLoad(el)
        }

        const handleFont = async () => {
          const getFormat = (extension: string) => {
            switch (extension) {
              case 'ttf':
                return 'truetype'
              case 'woff':
                return 'woff'
              case 'woff2':
                return 'woff2'
            }
            return 'unknown'
          }

          const fontFamily = getFontFamilyName(source)
          const style = document.createElement('style')
          style.innerHTML = `@font-face {
            font-family: "${fontFamily}";
            src: url('${source}') format('${getFormat(extension)}');
          }`

          const head = document.querySelector('head')
          head.appendChild(style)
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
