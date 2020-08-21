import jimp from 'jimp'
import Color from './Color'
import { promises as fs } from 'fs'

export async function getMedianColor(type, val: string & { matchAll?: Function }): Promise<Color> {
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
  if (type == 'gradicolor' && val.matchAll) {
    let regexp = /(\d+),(\d+),(\d+),\d+/g
    let matches = Array.from(val.matchAll(regexp))
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i < matches.length; i++) {
      const element: any = matches[i]
      r += parseInt(element[1])
      g += parseInt(element[2])
      b += parseInt(element[3])
    }
    return new Color().fromRgb(
      Math.floor(r / matches.length),
      Math.floor(g / matches.length),
      Math.floor(b / matches.length)
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

    return new Color().fromRgb(Math.floor(r / h / w), Math.floor(g / h / w), Math.floor(b / h / w))
  }
  return new Color()
}

export async function createPreviews() {
  let imgpath = 'data/background'
  let previewPath = imgpath + '/preview'

  console.log('preparing preview')

  try {
    await fs.mkdir(imgpath)
  } catch (e) {}
  try {
    await fs.mkdir(previewPath)
  } catch (e) {}

  try {
    let files = await fs.readdir(imgpath)
    let previewFiles = await fs.readdir(previewPath)

    if (!previewFiles) previewFiles = []

    for (let file of files) {
      let inf = await fs.lstat(imgpath + '/' + file)
      if (!inf.isDirectory())
        if (!previewFiles.includes(file)) {
          let img = await jimp.read(imgpath + '/' + file)
          img
            .resize(200, 140) // resize
            .quality(80) // set JPEG quality
            .write(previewPath + '/' + file) // save
        }
    }
  } catch (e) {
    console.log(e)
  }
}
