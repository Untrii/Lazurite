import Font, { FontType } from '@/models/common/Font'
import randomString from '@/util/randomString'

export default class FontPreset {
  name = 'New preset'
  fontName = 'Roboto'
  fontSource = 'null://font'
  fontType = 'normal' as FontType
  size = 48
  weight = 400
  id = randomString()
}
