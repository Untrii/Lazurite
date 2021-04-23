import Font from '@/models/common/Font'
import getFontFamilyName from '@/util/text/getFontFamilyName'

export default class FontRegistery {
  private _registeredFonts = [] as Font[]
  addFonts(...fonts: Font[]) {
    for (const font of fonts) {
      this._registeredFonts.push(font)
    }
  }

  getFontBySource(source: string): Font | undefined {
    for (const font of this._registeredFonts) {
      if (font.variants.find((item) => item.source == source)) return font
    }
  }

  getFonts() {
    return this._registeredFonts
  }
}
