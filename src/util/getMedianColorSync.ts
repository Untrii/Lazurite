import Color from '@/models/common/Color'

export default function getMedianColorSync(type: 'color' | 'gradient' | 'gradicolor', value: string) {
  switch (type) {
    case 'color':
      return Color.fromHex(value)
    case 'gradicolor':
    case 'gradient':
      let cols = value.split(' ')

      let col0 = Color.fromHex(cols[1])
      let col1 = Color.fromHex(cols[3])

      return Color.fromRgb(
        Math.floor((col0.r + col1.r) / 2),
        Math.floor((col0.g + col1.g) / 2),
        Math.floor((col0.b + col1.b) / 2)
      )
  }
}
