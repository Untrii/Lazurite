import { BackgroundType, stringFromType, typeFromString } from '@/entities/ITheme'
import BackgroundsRepository from '@/repositories/BackgroundsRepository'
import PresentationRepository from '@/repositories/PresentationRepository'
import { remote } from 'electron'
import Color from '@/entities/Color'
import ConstrctorStore from '../store/ConstructorStore'
import path from 'path'
import fs from 'fs'
const ImageProcessing = remote.require('./ImageProcessing')

const presentation = PresentationRepository.Instance
const backgrounds = BackgroundsRepository.Instance

export default class BackgroundService {
  addBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)

    if (backgrounds.custom.has(type)) {
      const arr = backgrounds.custom.get(type)
      if (!arr) return
      if (arr.indexOf(value) != -1) return
      else {
        let typedBackgrounds = backgrounds.custom.get(type)
        if (typedBackgrounds) typedBackgrounds.push(value)
      }
    }
  }

  deleteBackground(type: BackgroundType | string, value: string) {
    console.log(value)
    if (typeof type != 'string') type = stringFromType(type)

    const store = new ConstrctorStore()
    const previewPath = store.dataFolder + value
    const mainFilePath = previewPath.replace('/preview/', '/')

    if (fs.existsSync(previewPath)) fs.unlinkSync(previewPath)
    if (fs.existsSync(mainFilePath)) fs.unlinkSync(mainFilePath)

    const customCollection = backgrounds.custom.get(type)
    if (customCollection) {
      backgrounds.custom.set(
        type,
        customCollection.filter((entry) => entry != value)
      )
    }
  }

  async selectBackground(type: BackgroundType | string, value: string) {
    if (typeof type == 'string') type = typeFromString(type)

    presentation.theme.backgroundType = type
    presentation.theme.backgroundValue = value

    const start = new Date()
    console.log('median color calculating')
    const v = await ImageProcessing.getMedianColor(stringFromType(type), value)

    presentation.theme.backgroundColor = Color.fromRgb(v.r, v.g, v.b)
    console.log(`Got median color ${v} in ${new Date().getTime() - start.getTime()}ms`)
  }
}
