import ReactiveService from './ReactiveService'
import ElementPreset from '@/entities/ElementPreset'
import DesignService from './DesignService'
import { Instance } from '@/repositories/CommonRepository'
import assets from '@/assets'
import DialogService from './DialogService'
import ResourceService from './ResourceService'

export default class ElementService extends ReactiveService {
  private _groups: Map<string, ElementPreset[]> = new Map()

  constructor() {
    super()
    let designService = new DesignService()
    designService.addOnChangeListener(() => this.reloadFontPresets())
    this.setGroup('media', [
      new ElementPreset(
        assets.logo,
        'image',
        'ImageBlock',
        this.generateImageProps
      ),
    ])
    this.setGroup('datavis', [
      new ElementPreset(assets.logo, 'spreadsheet', 'Spreadsheet', {
        rowCount: 5,
        columnCount: 5,
        rowSizes: [0.2, 0.2, 0.2, 0.2, 0.2],
        columnSizes: [0.2, 0.2, 0.2, 0.2, 0.2],
        highlightTop: true,
        highlightBottom: false,
        highlightLeft: false,
        highlightRight: false,
        stripHorizontally: true,
        stripVertically: false,
        darkStyle: false,
        borderRadius: 10,
        content: this.genetate2DMap('', 5),

        top: 270,
        left: 480,
        width: 960,
        height: 540,
        fontSize: 44,
        showBorders: true,
      }),
    ])
  }

  private genetate2DMap(
    value: string,
    size: number
  ): Map<number, Map<number, string>> {
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

  private async generateImageProps() {
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
    return {
      src: Instance.workspaceDataFolder + '/' + fileName,
      height: imageSize.height,
      width: imageSize.width,
    }
  }

  private reloadFontPresets() {
    if (!Instance.openedPresentation) return
    let fontPresets = Instance.openedPresentation.theme.fontPresets
    let elementPresets: ElementPreset[] = []
    for (const entry of fontPresets) {
      elementPresets.push(
        new ElementPreset(assets.text, entry.name, 'TextBlock', {
          height: entry.size * 1.75,
          width: entry.size * 10.5,
          fontWeight: entry.weight,
          fontSize: entry.size,
          fontFamily: entry.family,
          content: 'Type here',
        })
      )
    }
    this.setGroup('Text', elementPresets)
  }
  setGroup(name: string, entries: ElementPreset[]) {
    this._groups.set(name, entries)
    this.onChange()
  }

  getGroups() {
    return new Map(this._groups)
  }
}
