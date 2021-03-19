import Color from '@/models/common/Color'
import { BackgroundType } from '@/models/presentation/theme/Background'
import { requireResourceAsync } from '@/dataLoader'
import getMedianColorSync from './getMedianColorSync'

export default async function getMedianColor(type: BackgroundType, value: string) {
  switch (type) {
    case 'color':
    case 'gradicolor':
    case 'gradient':
      return getMedianColorSync(type, value)
    case 'image':
    case 'pattern':
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d')

      const image = (await requireResourceAsync(value)) as HTMLImageElement
      const startTime = new Date()
      context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, 1, 1)

      const [r, g, b] = context.getImageData(0, 0, 1, 1).data
      console.info(`Got median color of ${value} in ${new Date().getTime() - startTime.getTime()}ms`)
      return Color.fromRgb(r, g, b)
  }
}
