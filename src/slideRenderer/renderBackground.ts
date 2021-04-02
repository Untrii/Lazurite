import Background from '@/models/presentation/theme/Background'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import parseGradient from '@/util/parseGradient'
import { requireResource } from '../dataLoader'

function getGradientCoords(resolution: RendererResolution, angle: number): [number, number, number, number] {
  const centerX = resolution.targetWidth / 2
  const centerY = resolution.targetHeight / 2

  let canvasAngle = (angle + 180) % 360
  const rads = canvasAngle * (Math.PI / 180)

  const hypt = centerY / Math.cos((rads + Math.PI) % (Math.PI / 2))
  const fromTopRight = centerX - Math.sqrt(hypt * hypt - centerY * centerY)
  const diag = Math.sin((rads + Math.PI) % (Math.PI / 2)) * fromTopRight
  const length = hypt + diag

  return [
    centerX + Math.cos(-Math.PI / 2 + rads) * length,
    centerY + Math.sin(-Math.PI / 2 + rads) * length,
    centerX + Math.cos(Math.PI / 2 + rads) * length,
    centerY + Math.sin(Math.PI / 2 + rads) * length,
  ]
}

export default function renderBackground(
  ctx: CanvasRenderingContext2D,
  resolution: RendererResolution,
  background: Background
) {
  switch (background.type) {
    case 'color':
      {
        ctx.fillStyle = background.value
        ctx.fillRect(0, 0, resolution.targetWidth, resolution.targetHeight)
      }
      break
    case 'gradicolor':
      {
        console.error('Rendering gradient background...\nNot implemented')
      }
      break
    case 'gradient':
      const gradientValue = parseGradient(background.value)
      const gradientCoords = getGradientCoords(resolution, gradientValue.angle)
      const gradient = ctx.createLinearGradient(...gradientCoords)

      for (const stop of gradientValue.stops) {
        gradient.addColorStop(stop.percent, stop.color.toHex())
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, resolution.targetWidth, resolution.targetHeight)
      break
    case 'image':
      {
        const image = requireResource(background.value) as HTMLImageElement
        if (image) {
          const { naturalWidth, naturalHeight } = image
          const { targetWidth, targetHeight } = resolution
          const scale = Math.max(targetWidth / naturalWidth, targetHeight / naturalHeight)

          const imageWidth = scale * naturalWidth
          const imageHeight = scale * naturalHeight
          const offsetX = (targetWidth - imageWidth) / 2
          const offsetY = (targetHeight - imageHeight) / 2

          ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight, offsetX, offsetY, imageWidth, imageHeight)
        } else throw new Error('Resource not loaded')
      }
      break
    case 'pattern':
      {
        const image = requireResource(background.value) as HTMLImageElement
        if (image) {
          const { scale } = resolution
          const { naturalWidth, naturalHeight } = image
          const scaledImageWidth = naturalWidth * scale
          const scaledImageHeight = naturalHeight * scale
          let repeats = Math.max(Math.round(270 / naturalHeight), Math.round(480 / naturalWidth), 1)
          repeats = Math.min(repeats, 10)

          const patternCanvas = document.createElement('canvas')
          const patternCtx = patternCanvas.getContext('2d')
          patternCanvas.width = scaledImageWidth * repeats
          patternCanvas.height = scaledImageHeight * repeats

          //Паттерн меняет свой размер в зависимости от размера презентации
          //при использовании паттернов маленького разрешения они начинают скакать как хохлы
          //при изменении размера слайда, из-за того, что рендерятся в целых координатах
          for (let i = 0; i < repeats; i++)
            for (let j = 0; j < repeats; j++)
              patternCtx.drawImage(
                image,
                scaledImageWidth * i,
                scaledImageHeight * j,
                scaledImageWidth,
                scaledImageHeight
              )

          const pattern = ctx.createPattern(patternCanvas, 'repeat')
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, resolution.targetWidth, resolution.targetHeight)
        } else throw new Error('Resource not loaded')
      }
      break
  }
}
