import Color from '@/models/common/Color'
import SlideObject from './base/SlideObject'
import TextStyle from './base/TextStyle'

type VerticalAlignVariants = 'top' | 'center' | 'bottom'
type HorizontalAlignVariants = 'left' | 'center' | 'right'

export default class TextSlideObject extends SlideObject {
  content = ''
  type = TextSlideObject.name
  verticalAlign: VerticalAlignVariants = 'top'
  horizontalAlign: HorizontalAlignVariants = 'left'
  presetId = ''
  style = new TextStyle()
}
