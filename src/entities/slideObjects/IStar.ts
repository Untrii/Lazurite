import IFigure, { getBlankObject as getBlankFigure } from './hocs/IFigure'

export default interface IStar extends IFigure {}

export function getBlankObject(): IStar {
  const result = {
    ...getBlankFigure(),
  }
  result.type = 'Star'
  return result
}
