import ISlideObject, { getBlankObject as getBlankSlideObject } from '@/entities/ISlideObject'
import IColor from '@/entities/IColor'
import Color from '@/entities/Color'

export default interface IFigure extends ISlideObject {
  color: IColor;
  strokeColor: IColor;
  strokeSize: number;
}

export function getBlankObject(): IFigure {
  const result = {
    ...getBlankSlideObject(),
    color: { r: 100, g: 100, b: 100 },
    strokeColor: new Color(),
    strokeSize: 0,
    height: 100,
    width: 100,
  }
  return result
}
