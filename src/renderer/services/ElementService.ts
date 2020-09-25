import ReactiveService from './ReactiveService'
import ElementPreset from '@/entities/ElementPreset'
import DesignService from './DesignService'
import CommonRepository from '@/repositories/CommonRepository'
import assets from '@/assets'
import DialogService from './DialogService'
import ResourceService from './ResourceService'
import generateString from '@/utils/StringGenerator'
import BlankObjects from '@/entities/slideObjects/BlankObjects'

export default class ElementService extends ReactiveService {
  private _groups!: Map<string, ElementPreset[]>

  constructor() {
    let currentObj: any = super('ElementService', [CommonRepository])

    currentObj._groups = currentObj._groups ?? new Map()

    let designService = new DesignService()
    designService.addOnChangeListener(() => currentObj.reloadFontPresets())
    currentObj.reloadFontPresets()
    currentObj.setGroup('media', [
      new ElementPreset(assets.logo, 'image', 'ImageBlock', currentObj.generateImageProps),
      new ElementPreset(assets.logo, 'video', 'VideoBlock', currentObj.generateVideoProps),
      new ElementPreset(assets.logo, 'youtubeVideo', 'EmbeddedVideoBlock', BlankObjects.EmbeddedVideoBlock),
    ])
    currentObj.setGroup('figures', [
      new ElementPreset(assets.logo, 'rectangle', 'Rectangle', BlankObjects.Rectangle),
      new ElementPreset(assets.logo, 'ellipse', 'EllipseBlock', BlankObjects.EllipseBlock),
      new ElementPreset(assets.logo, 'star', 'Star', BlankObjects.Star),
      //new ElementPreset(assets.logo, 'triangle', 'Triangle', BlankObjects.Triangle),
    ])
    currentObj.setGroup('datavis', [
      new ElementPreset(assets.logo, 'spreadsheet', 'Spreadsheet', BlankObjects.Spreadsheet),
    ])
    return currentObj
  }

  getStandartFigure() {}

  genetate2DMap(value: string, size: number): Map<number, Map<number, string>> {
    let result = new Map<number, Map<number, string>>()
    let sampleMap = new Map<number, string>()
    for (let i = 0; i < size; i++) {
      sampleMap.set(i, value)
    }
    for (let i = 0; i < size; i++) {
      result.set(i, sampleMap)
    }
    return result
  }

  async generateImageProps() {
    let dialogService = new DialogService()
    let resourceService = new ResourceService()
    let fileName = await dialogService.openChooseFileDialog('image')

    let imageSize = resourceService.getImageSize(fileName)
    if (imageSize.height > 540) {
      imageSize.width /= imageSize.height / 540
      imageSize.height = 540
    }
    if (imageSize.width > 960) {
      imageSize.height /= imageSize.width / 960
      imageSize.width = 960
    }
    let result = BlankObjects.ImageBlock
    result.height = imageSize.height
    result.width = imageSize.width
    result.src = CommonRepository.workspaceDataFolder + '/' + fileName
    result.id = generateString(12)

    return result
  }

  async generateVideoProps() {
    let dialogService = new DialogService()
    let resourceService = new ResourceService()
    let fileName = await dialogService.openChooseFileDialog('video')

    let videoSize = await resourceService.getVideoSize(fileName)
    if (videoSize.height > 540) {
      videoSize.width /= videoSize.height / 540
      videoSize.height = 540
    }
    if (videoSize.width > 960) {
      videoSize.height /= videoSize.width / 960
      videoSize.width = 960
    }

    let result = BlankObjects.VideoBlock
    result.height = videoSize.height
    result.width = videoSize.width
    result.src = CommonRepository.workspaceDataFolder + '/' + fileName
    result.id = generateString(12)

    return result
  }

  reloadFontPresets() {
    if (!CommonRepository.openedPresentation) return
    let fontPresets = CommonRepository.openedPresentation.theme.fontPresets
    let elementPresets: ElementPreset[] = []

    for (const entry of fontPresets) {
      let sampleTextBlock = {
        ...BlankObjects.TextBlock,
        ...{
          height: entry.size * 1.75,
          width: entry.size * 10.5,
          fontWeight: entry.weight,
          fontSize: entry.size,
          fontFamily: entry.family,
          content: 'Type here',
        },
      }
      elementPresets.push(new ElementPreset(assets.text, entry.name, 'TextBlock', sampleTextBlock))
    }
    this.setGroup('text', elementPresets)
  }
  setGroup(name: string, entries: ElementPreset[]) {
    this._groups.set(name, entries)
    this.onChange()
  }

  getGroups() {
    return new Map(this._groups)
  }
}
