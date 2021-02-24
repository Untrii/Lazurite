import Color from '../../common/Color'

type FigureName = 'rectangle' | 'line' | 'arrow' | 'ellipse' | 'star'

export default class FigureSlideObject {
  type = FigureSlideObject.name
  figureName = 'rectangle' as FigureName
  color: Color
  strokeColor: Color
  strokeSize: number
}
