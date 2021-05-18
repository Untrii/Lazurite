import { FontType } from 'common/models/common/Font'
import getFontFamilyName from 'common/util/text/getFontFamilyName'
import randomString from 'common/util/randomString'

export default class FontPreset {
  name = 'New preset'
  fontName = 'Roboto'
  fontSource = 'null://font'
  fontType = 'normal' as FontType
  size = 48
  weight = 400
  id = randomString()

  get fontFamily() {
    return getFontFamilyName(this.fontSource)
  }
}
