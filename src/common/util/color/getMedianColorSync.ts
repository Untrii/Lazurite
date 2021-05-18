import Color from 'common/models/common/Color'
import parseGradient from './parseGradient'

export default function getMedianColorSync(type: 'color' | 'gradient' | 'gradicolor', value: string) {
  switch (type) {
    case 'color':
      return Color.fromHex(value)
    case 'gradicolor':
    case 'gradient':
      const { stops } = parseGradient(value)

      let r = 0,
        g = 0,
        b = 0
      for (let i = 1; i < stops.length; i++) {
        const range = stops[i].percent - stops[i - 1].percent
        const color = stops[i].color
        const prevColor = stops[i - 1].color
        r += ((prevColor.r + color.r) / 2) * range
        g += ((prevColor.g + color.g) / 2) * range
        b += ((prevColor.b + color.b) / 2) * range
      }

      return Color.fromRgb(Math.floor(r), Math.floor(g), Math.floor(b))
  }
}
