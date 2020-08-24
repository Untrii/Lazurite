import SlideObject, { getBlankObject as getBlankSlideObject } from '../SlideObject'
import Color from '@/entities/Color'

export default interface Rectangle extends SlideObject {
  color: Color
}

export function getBlankObject(): Rectangle {
  let result = {
    color: new Color(),
    ...getBlankSlideObject(),
  }
  return result
}
