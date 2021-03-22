import TextToSvg from 'text-to-svg'
import { promises as fs } from 'fs'

export default function createFontPreview(text, pathToFont, pathToResult) {
  return new Promise<void>((resolve, reject) => {
    TextToSvg.load(pathToFont, async (error, converter) => {
      if (error) {
        reject('Cannot create font preview')
      } else {
        const svg = converter.getSVG(text, {
          anchor: 'left top',
          fontSize: 36,
          attributes: {
            fill: 'white',
          },
        })
        try {
          await fs.writeFile(pathToResult, svg)
          resolve()
        } catch {
          reject('Failed to save preview file')
        }
      }
    })
  })
}
