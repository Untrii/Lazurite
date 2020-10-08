import { BackgroundType, stringFromType, typeFromString } from '@/entities/ITheme'
import BackgroundsRepository from '@/repositories/BackgroundsRepository'
import PresentationRepository from '@/repositories/PresentationRepository'
import { remote } from 'electron'
import Color from 'src/main/Color'
const { ImageProcessing } = remote.require('./main')

let presentation = PresentationRepository.Instance
let backgrounds = BackgroundsRepository.Instance

export default class BackgroundService {
  addBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)

    if (backgrounds.custom.has(type)) {
      let arr = backgrounds.custom.get(type)
      if (!arr) return
      if (arr.indexOf(value) != -1) return
      else {
        backgrounds.custom.get(type)?.push(value)
      }
    }
  }

  deleteBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)

    let customCollection = backgrounds.custom.get(type)
    if (customCollection) {
      backgrounds.custom.set(
        type,
        customCollection.filter(entry => entry != value)
      )
    }
  }

  async selectBackground(type: BackgroundType | string, value: string) {
    if (typeof type == 'string') type = typeFromString(type)

    presentation.theme.backgroundType = type
    presentation.theme.backgroundValue = value

    let start = new Date()
    let v = await ImageProcessing.getMedianColor(stringFromType(type), value)

    presentation.theme.backgroundColor = Color.fromRgb(v.r, v.g, v.b)
    console.log(`Got median color ${v} in ${new Date().getTime() - start.getTime()}ms`)
  }
}
