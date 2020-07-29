import SlideObject, { getBlankObject } from '@/entities/slideObject'
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

export function getDefaultCorrection(): ColorCorrector {
  return {
    blur: 0,
    brightness: 1,
    contrast: 1,
    grayscale: 0,
    hueRotate: 0,
    opacity: 1,
    saturate: 1,
    sepia: 0,
    dropShadow: 0,
    ...getBlankObject(),
  }
}
