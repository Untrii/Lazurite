import { requireResourceAsync } from '@/dataLoader'

export default async function createImagePreview(url: string): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const image = (await requireResourceAsync(url)) as HTMLImageElement
  let scale = Math.min(256 / image.naturalHeight, 256 / image.naturalWidth, 1)
  canvas.width = image.naturalWidth * scale
  canvas.height = image.naturalHeight * scale

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      0.7
    )
  })
}
