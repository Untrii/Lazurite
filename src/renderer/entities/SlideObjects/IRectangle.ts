import ISlideObject, { getBlankObject as getBlankSlideObject } from '../ISlideObject'
import Color from '@/entities/Color'

export default interface IRectangle extends ISlideObject {
  color: Color
}

export function getBlankObject(): IRectangle {
  let result = {
    color: new Color(),
    ...getBlankSlideObject(),
  }
  return result
}
