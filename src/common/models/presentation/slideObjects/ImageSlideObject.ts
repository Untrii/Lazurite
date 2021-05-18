import ColorCorrection from './base/ColorCorrection'
import SlideObject from './base/SlideObject'

export default class ImageSlideObject extends SlideObject {
  type = ImageSlideObject.name
  colorCorrection = new ColorCorrection()
  src = ''
}
