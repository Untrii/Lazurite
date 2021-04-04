import { requireResourceAsync } from '@/dataLoader'

export default async function createImagePreview(url: string): Promise<ArrayBuffer> {
  const canvas = document.createElement('canvas')
  const image = (await requireResourceAsync(url)) as HTMLImageElement
  let scale = Math.min(256 / image.naturalHeight, 256 / image.naturalWidth, 1)
  canvas.width = image.naturalWidth * scale
  canvas.height = image.naturalHeight * scale

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return new Promise<ArrayBuffer>((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        resolve(await blob.arrayBuffer())
      },
      'image/jpeg',
      0.7
    )
  })
}
