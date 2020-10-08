import PresentationRepository from '@/repositories/PresentationRepository'
import { promises as fs } from 'fs'
import BackgroundsRepository from '@/repositories/BackgroundsRepository'
import IBackgroundCollection from '@/entities/IBackgroundCollection'

let presentation = PresentationRepository.Instance
let backgrounds = BackgroundsRepository.Instance

interface IFontRecord {
  name: string
  variants: string[]
}

export default class DesignStore {
  get theme() {
    return presentation.theme
  }

  get backgroundCollection(): IBackgroundCollection {
    return backgrounds
  }

  _fontList
  async getFontList() {
    if (this._fontList.length != 0) return this._fontList

    let fontPrerendererElementName = 'xfontprerender'
    let fontList: IFontRecord[] = []
    let dataDir =
      process
        .cwd()
        .split('\\')
        .join('/') + '/data'
    let files = await fs.readdir(dataDir + '/fonts')
    console.log(files.length)
    for (let fileName of files) {
      let entry = fileName.replace('.ttf', '').split('__')

      let fontWeight = entry[1]
      let fontStyle = 'regular'
      let fontFamily = entry[0].split('_').join(' ')

      if (entry[1] == 'regular' || entry[1] == 'italic') fontWeight = '400'
      if (entry[1].includes('italic')) fontStyle = 'italic'

      fontWeight = fontWeight.replace('italic', '')
      let styleString = `@font-face { font-family: '${fontFamily}';font-style: ${fontStyle};font-weight: ${fontWeight};font-display: swap;src: url('${dataDir}/fonts/${fileName}');}`

      let styleElement = document.createElement('style')
      styleElement.innerHTML = styleString

      let paintElement = document.createElement(fontPrerendererElementName)
      paintElement.style.position = 'absolute'
      paintElement.style.left = '-9999px'
      paintElement.innerHTML = 'a'
      paintElement.style.fontFamily = fontFamily
      paintElement.style.fontWeight = fontWeight

      document.querySelector('head')?.appendChild(styleElement)
      document.querySelector('body')?.appendChild(paintElement)

      let found = false
      if (fontStyle == 'regular') {
        for (let font of fontList) {
          if (font.name == fontFamily) {
            font.variants.push(fontWeight)
            found = true
          }
        }
        if (!found) {
          let newEntry = {
            name: fontFamily,
            variants: [fontWeight]
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
