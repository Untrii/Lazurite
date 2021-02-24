import Color from '@/models/common/Color'

type BackgroundType = 'color' | 'gradient' | 'gradicolor' | 'pattern' | 'image'

export default class Background {
  medianColor = Color.white
  type = 'color' as BackgroundType
  value = Color.white.toHex()
}
