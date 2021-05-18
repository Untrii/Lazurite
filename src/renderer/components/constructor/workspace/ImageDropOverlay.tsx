//import './ImageDropOverlay.scss'
import { requireResourceAsync } from '@/dataLoader'
import ImageSlideObject from 'common/models/presentation/slideObjects/ImageSlideObject'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'
import store from '@/store'
import handleFiles from 'common/util/handleFiles'
import { h, JSX } from 'preact'

interface IImageDropOverlayProps {
  children: JSX.Element
  width: number
  height: number
}

async function processImage(
  image: Blob,
  imageCenter: { x: number; y: number },
  presentationResolution: { width: number; height: number }
) {
  const { width: pWidth, height: pHeight } = presentationResolution
  const path = await store.addImageInProject(image)

  const imageElement = (await requireResourceAsync(path)) as HTMLImageElement
  let imageWidth = imageElement.naturalWidth
  let imageHeight = imageElement.naturalHeight

  let scale = 1
  scale = Math.min(scale, pWidth / 2 / imageWidth)
  scale = Math.min(scale, pHeight / 2 / imageHeight)

  const imageObject = new ImageSlideObject()
  imageObject.width = imageWidth * scale
  imageObject.height = imageHeight * scale
  imageObject.left = imageCenter.x - (imageWidth * scale) / 2
  imageObject.top = imageCenter.y - (imageHeight * scale) / 2
  imageObject.zIndex = store.nextZIndex()
  imageObject.src = path

  store.addObjectOnSlide(imageObject)
}

const ImageDropOverlay = ({ children, width, height }: IImageDropOverlayProps) => {
  const pResolution = store.getCurrentPresentation().resolution
  const { width: pWidth, height: pHeight } = pResolution
  const resolution = new RendererResolution(pWidth, pHeight)
  resolution.targetWidth = width

  const onDrop = async function (event: DragEvent) {
    const imageCenter = {
      x: event.offsetX / resolution.scale,
      y: event.offsetY / resolution.scale,
    }

    const images = await handleFiles(event.dataTransfer, ['image/jpeg', 'image/png'])
    for (const image of images) {
      processImage(image, imageCenter, pResolution)
    }
  }

  return (
    <div class="image-drop-overlay" onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
      {children}
    </div>
  )
}
export default ImageDropOverlay
