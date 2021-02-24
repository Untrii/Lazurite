import SlideObject from './base/SlideObject'
import TextStyle from './base/TextStyle'

type VerticalAlignVariants = 'top' | 'middle' | 'bottom'
type HorizontalAlignVariants = 'left' | 'middle' | 'right'

export default class TextSlideObject extends SlideObject {
  content = ''
  type = TextSlideObject.name
  verticalAlign: VerticalAlignVariants = 'top'
  horizontalAlign: HorizontalAlignVariants = 'left'
  style: TextStyle = { presetName: 'null' }
}
