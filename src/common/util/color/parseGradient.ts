import Color from 'common/models/common/Color'

export default function parseGradient(value: string) {
  let stops = value.split(',').map((item) => item.trim())
  let startFrom = 1

  const result = {
    angle: parseFloat(stops[0]),
    stops: [] as { color: Color; percent: number }[],
  }
  if (value.includes('rgb')) {
    stops = value.match(/rgb\( *\d+ *, *\d+ *, *\d+ *\) +\d+\.*\d*%/g)
    startFrom = 0
  }
  for (let i = startFrom; i < stops.length; i++) {
    const lastSpace = stops[i].lastIndexOf(' ')
    const color = stops[i].substring(0, lastSpace)
    const percent = stops[i].substring(lastSpace + 1)

    let currentColor = Color.white
    if (color.startsWith('#')) currentColor = Color.fromHex(color)
    if (color.startsWith('rgb')) {
      const [r, g, b] = color
        .replace('rgb(', '')
        .replace(')', '')
        .split(',')
        .map((item) => parseInt(item))
      currentColor = Color.fromRgb(r, g, b)
    }
    result.stops.push({
      color: currentColor,
      percent: parseFloat(percent) / 100,
    })
  }

  const firstStop = result.stops[0]
  const lastStop = result.stops[result.stops.length - 1]
  if (firstStop.percent != 0) result.stops.unshift({ color: firstStop.color, percent: 0 })
  if (lastStop.percent != 1) result.stops.push({ color: lastStop.color, percent: 1 })

  return result
}
