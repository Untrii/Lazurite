import Color from '@/models/common/Color'
import Background from './Background'
import FontPreset from './FontPreset'

export default class Theme {
  background = new Background()
  fontPresets = [] as FontPreset[]
  palette = [] as Color[]
}
