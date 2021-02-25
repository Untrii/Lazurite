import getFontFamilyName from '@/util/getFontFamilyName'

const imageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gif']
const videoExtensions = ['mp4', 'mkv', 'avi']
const fontExtensions = ['ttf', 'woff', 'woff2', 'eot']

const loadedResources = new Map<string, LoadedResource>()
const pendingResources = new Map<string, Promise<void>>()

type LoadedResource = HTMLImageElement | HTMLVideoElement | HTMLStyleElement
type RequireManyResult = { [sourceName: string]: LoadedResource } | undefined

export function startLoading(source: string) {
  requireFile(source)
}

export function requireMany(sources: string[]): RequireManyResult {
  let result: RequireManyResult

  for (const item of sources) {
    const resource = requireFile(item)
    if (!resource) return
    result[item] = resource
  }

  return result
}

export function requireFile(source: string): LoadedResource | undefined {
  if (!loadedResources.get(source)) {
    waitForFile(source)
    return
  } else return loadedResources.get(source)
}

export async function waitForFile(source: string): Promise<LoadedResource> {
  if (loadedResources.get(source)) return loadedResources.get(source)
  debugger
  let startTime = performance.now()
  if (!pendingResources.has(source)) {
    pendingResources.set(
      source,
      new Promise(async (resolve, reject) => {
        let extension = source.split('.').pop()

        let onLoad = (element: LoadedResource) => {
          loadedResources.set(source, element)
          pendingResources.delete(source)
          resolve()
        }

        let handleMedia = (tagName: string) => {
          let el = document.createElement(tagName) as
            | HTMLImageElement
            | HTMLVideoElement
          el.src = source
          if (tagName == 'img') el.onload = () => onLoad(el)
          else el.onloadedmetadata = () => onLoad(el)
        }

        let handleFont = async () => {
          let format: string
          let getFormat = (extension: string) => {
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

          let res = await fetch(source)
          let blob = await res.blob()

          let reader = new FileReader()
          reader.readAsDataURL(blob) // конвертирует Blob в base64 и вызывает onload

          reader.onload = function () {
            let style = document.createElement('style')
            style.innerHTML = `@font-face {
              font-family: "ff_${getFontFamilyName(source)}";
              src: url('${reader.result}') format('${format}');
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
  console.log(`Loaded resource in ${performance.now() - startTime}ms`)
  return loadedResources.get(source)
}
