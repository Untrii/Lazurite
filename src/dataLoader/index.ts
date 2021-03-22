import getFontFamilyName from '@/util/getFontFamilyName'

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
    requireResourceAsync(source)
    return
  } else return loadedResources.get(source)
}

export async function requireResourceAsync(source: string, overrideExtension?: string): Promise<LoadedResource> {
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

          const res = await fetch(source)
          const blob = await res.blob()

          const reader = new FileReader()
          reader.readAsDataURL(blob) // конвертирует Blob в base64 и вызывает onload

          reader.onload = function () {
            const style = document.createElement('style')
            style.innerHTML = `@font-face {
              font-family: "${getFontFamilyName(source)}";
              src: url('${reader.result}') format('${getFormat(extension)}');
            }`

            const head = document.querySelector('head')
            head.appendChild(style)
            onLoad(style)

            reader.result
          }
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
