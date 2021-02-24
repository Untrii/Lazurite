import Color from '../../common/Color'
import SlideObject from './base/SlideObject'
import TextStyle from './base/TextStyle'

type VerticalAlignVariants = 'top' | 'middle' | 'bottom'
type HorizontalAlignVariants = 'left' | 'middle' | 'right'

export default class TableSlideObject extends SlideObject {
  type = TableSlideObject.name
  content = [['']]
  markup = {
    rowSizes: [1],
    columnSizes: [1],
  }
  text = {
    verticalAlign: 'top' as VerticalAlignVariants,
    horizontalAlign: 'left' as HorizontalAlignVariants,
    style: { presetName: 'null' } as TextStyle,
  }
  highlight = {
    top: true,
    bottom: false,
    left: false,
    right: false,
  }
  strip = {
    vertically: false,
    horizontaly: false,
  }
  cornerRadius: number
  showBorders: boolean
  color: Color
}
