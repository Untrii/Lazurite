import Background from '@/models/presentation/theme/Background'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import { requireFile } from './dataLoader'

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
    case 'gradient':
      {
        console.error('Rendering gradient background...\nNot implemented')
      }
      break
    case 'image':
      {
        const image = requireFile(background.value) as HTMLImageElement
        if (image) {
          const { naturalWidth, naturalHeight } = image
          const { targetWidth, targetHeight } = resolution
          const scale = Math.max(targetWidth / naturalWidth, targetHeight / naturalHeight)

          const imageWidth = scale * naturalWidth
          const imageHeight = scale * naturalHeight
          const offsetX = (targetWidth - imageWidth) / 2
          const offsetY = (targetHeight - imageHeight) / 2

          ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight, offsetX, offsetY, imageWidth, imageHeight)
        }
      }
      break
    case 'pattern':
      {
        const image = requireFile(background.value) as HTMLImageElement
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
        }
      }
      break
  }
}
