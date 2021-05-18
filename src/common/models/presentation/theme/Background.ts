import Color from 'common/models/common/Color'

export type BackgroundType = 'color' | 'gradient' | 'gradicolor' | 'pattern' | 'image'

export type BackgroundCollection = {
  [key in BackgroundType]: Background[]
}

export default class Background {
  medianColor = Color.white
  type = 'color' as BackgroundType
  value = Color.white.toHex()
  displayValue = Color.white.toHex()
}
