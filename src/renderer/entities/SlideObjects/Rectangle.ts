import ISlideObject, { getBlankObject as getBlankSlideObject } from '../ISlideObject'
import Color from '@/entities/Color'

export default interface Rectangle extends ISlideObject {
  color: Color
}

export function getBlankObject(): Rectangle {
  let result = {
    color: new Color(),
    ...getBlankSlideObject(),
  }
  return result
}
