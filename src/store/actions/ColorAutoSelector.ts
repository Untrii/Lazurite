import Color from '@/models/common/Color'
import { hsvToRgb, rgbToHsv } from '@/util/color/colorConvertion'
import getColorFeatures from '@/util/color/getColorFeatures'
import { StoreType } from '..'

export default class ColorAutoSelector {
  autoSelect(this: StoreType) {
    const presentation = this.getCurrentPresentation()
    const backgroundColor = presentation.theme.background.medianColor
    const { r, g, b } = backgroundColor
    const [h, s, v] = rgbToHsv(r, g, b)
    const { dark, semidark, semilight, light, bright, dim } = getColorFeatures(backgroundColor)

    let tableRowBG: Color, tableRowStrippedBG: Color, tableHeaderBG: Color

    if (dark || semidark) {
      tableRowBG = Color.fromRgb(r * 1.1, g * 1.1, b * 1.1)
      tableRowStrippedBG = Color.fromRgb(r * 1.2, g * 1.2, b * 1.2)
      tableHeaderBG = Color.fromRgb(r * 1.3, g * 1.3, b * 1.3)
    } else {
      tableRowBG = Color.fromRgb(r * 0.9, g * 0.9, b * 0.9)
      tableRowStrippedBG = Color.fromRgb(r * 0.8, g * 0.8, b * 0.8)
      tableHeaderBG = Color.fromRgb(r * 0.7, g * 0.7, b * 0.7)
    }

    let mainText = Color.white,
      accentText0: Color,
      accentText1: Color

    let sv = 90

    if (dim && light) mainText = Color.fromRgb(10, 12, 17)

    if (bright) sv = 10

    const [r0, g0, b0] = hsvToRgb((h - 20) % 360, sv, sv)
    accentText0 = Color.fromRgb(r0, g0, b0)

    const [r1, g1, b1] = hsvToRgb((h + 20) % 360, sv, sv)
    accentText1 = Color.fromRgb(r1, g1, b1)

    presentation.theme.defaults = {
      tableRowBG,
      tableRowStrippedBG,
      tableHeaderBG,
      mainText,
      accentText0,
      accentText1,
    }
    this.saveCurrentPresentation()
  }
}
