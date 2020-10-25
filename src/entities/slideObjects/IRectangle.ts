import IFigure, { getBlankObject as getBlankFigure } from './hocs/IFigure'

export default interface IRectangle extends IFigure {}

export function getBlankObject(): IRectangle {
  const result = {
    ...getBlankFigure(),
  }
  result.type = 'Rectangle'
  return result
}
