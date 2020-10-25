import IFigure, { getBlankObject as getBlankFigure } from './hocs/IFigure'

export default interface IEllipseBlock extends IFigure {}

export function getBlankObject(): IEllipseBlock {
  const result = {
    ...getBlankFigure(),
  }
  result.type = 'EllipseBlock'
  return result
}
