import IFigure, { getBlankObject as getBlankFigure } from './hocs/IFigure'

export default interface IRectangle extends IFigure {}

export function getBlankObject(): IRectangle {
  let result = {
    ...getBlankFigure(),
  }
  result.type = 'EllipseBlock'
  return result
}
