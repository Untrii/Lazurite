import SlideObject from '../../slideObject'
export default interface ColorCorrector extends SlideObject {
  blur: number
  brightness: number
  contrast: number
  grayscale: number
  hueRotate: number
  opacity: number
  saturate: number
  sepia: number
  dropShadow: number
}
