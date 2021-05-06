import Color from '@/models/common/Color'
import { rgbToHsv } from './colorConvertion'

export default function getColorFeatures(color: Color) {
  const { r, g, b } = color
  const [h, s, v] = rgbToHsv(r, g, b)

  let dark = false,
    semidark = false,
    light = false,
    semilight = false,
    bright = false,
    dim = false,
    acid = false

  if (v <= 25) dark = true
  else if (v <= 50) semidark = true
  else if (v <= 75) semilight = true
  else light = true

  if (s <= 60) dim = true
  else bright = true

  if (light && bright && r + g + b < 300) acid = true
  return { dark, semidark, light, semilight, bright, dim, acid }
}
