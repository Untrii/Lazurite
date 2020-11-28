import PresentationRepository from '@/repositories/PresentationRepository'
import { promises as fs } from 'fs'
import BackgroundsRepository from '@/repositories/BackgroundsRepository'
import IBackgroundCollection from '@/entities/IBackgroundCollection'
import IFontRecord from '@/entities/IFontRecord'

const presentation = PresentationRepository.Instance
const backgrounds = BackgroundsRepository.Instance

export default class DesignStore {
  get theme() {
    return presentation.theme
  }

  get backgroundCollection(): IBackgroundCollection {
    return backgrounds
  }

  _fontList: IFontRecord[] = []
  async getFontList() {
    console.log('getFontList')
    if (this._fontList.length != 0) return this._fontList

    const fontPrerendererElementName = 'xfontprerender'
    const fontList: IFontRecord[] = []
    const dataDir =
      process
        .cwd()
        .split('\\')
        .join('/') + '/data'
    const files = await fs.readdir(dataDir + '/fonts')
    console.log(files.length)
    const isStylesRendered =
      document.querySelectorAll(fontPrerendererElementName).length > 0
    for (const fileName of files) {
      const entry = fileName.replace('.ttf', '').split('__')

      let fontWeight = entry[1]
      let fontStyle = 'regular'
      const fontFamily = entry[0].split('_').join(' ')

      if (entry[1] == 'regular' || entry[1] == 'italic') fontWeight = '400'
      if (entry[1].includes('italic')) fontStyle = 'italic'

      fontWeight = fontWeight.replace('italic', '')
      const styleString = `@font-face { font-family: '${fontFamily}';font-style: ${fontStyle};font-weight: ${fontWeight};font-display: swap;src: url('local-font://${dataDir}/fonts/${fileName}');}`

      const styleElement = document.createElement('style')
      styleElement.innerHTML = styleString

      const paintElement = document.createElement(fontPrerendererElementName)
      paintElement.style.position = 'absolute'
      paintElement.style.left = '-9999px'
      paintElement.innerHTML = 'a'
      paintElement.style.fontFamily = fontFamily
      paintElement.style.fontWeight = fontWeight
      if (!isStylesRendered) {
        document.querySelector('head')?.appendChild(styleElement)
        document.querySelector('body')?.appendChild(paintElement)
      }
      let found = false
      if (fontStyle == 'regular') {
        for (const font of fontList) {
          if (font.name == fontFamily) {
            font.variants.push(fontWeight)
            found = true
          }
        }
        if (!found) {
          const newEntry = {
            name: fontFamily,
            variants: [fontWeight],
          }
          fontList.push(newEntry)
        }
      }
    }

    for (let i = 0; i < fontList.length; i++) {
      fontList[i].variants.sort((a, b) => parseInt(a) - parseInt(b))
    }
    this._fontList = fontList
    return fontList
  }

  public openedTab = 'background'
}
