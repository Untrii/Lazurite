import Color from '@/models/common/Color'

export default class TextStyle {
  fontSource = 'null://font'
  fontFamily = 'Arial'
  fontSize = 10
  fontWeight = 400
  fontType = 'normal' as 'normal' | 'italic'
  color = new Color()
}
