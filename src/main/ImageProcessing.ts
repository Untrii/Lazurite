import jimp from 'jimp'
import Color from './Color'

export async function getMedianColor(type, val: string): Promise<Color> {
  if (type == 'color') return new Color().fromHex(val)
  if (type == 'gradient') {
    let cols = val.split(' ')

    let col0 = new Color().fromHex(cols[1])
    let col1 = new Color().fromHex(cols[3])

    return new Color().fromRgb(
      Math.floor((col0.r + col1.r) / 2),
      Math.floor((col0.g + col1.g) / 2),
      Math.floor((col0.b + col1.b) / 2)
    )
  }
  if (type == 'image' || type == 'pattern') {
    val = process.cwd() + '/data' + val
    let img = await jimp.read(val)
    let h = img.bitmap.height
    let w = img.bitmap.width

    let r = 0,
      g = 0,
      b = 0

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        let col = jimp.intToRGBA(img.getPixelColor(j, i))
        r += col.r
        g += col.g
        b += col.b
      }
    }

    return new Color().fromRgb(
      Math.floor(r / h / w),
      Math.floor(g / h / w),
      Math.floor(b / h / w)
    )
  }
}
