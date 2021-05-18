import Color from 'common/models/common/Color'
import Background from './Background'
import FontPreset from './FontPreset'

export default class Theme {
  background = new Background()
  fontPresets = [] as FontPreset[]
  defaults = {
    tableRowBG: Color.white,
    tableRowStrippedBG: Color.white,
    tableHeaderBG: Color.white,

    mainText: Color.black,
    accentText0: Color.black,
    accentText1: Color.black,
  }
}
