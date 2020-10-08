import assets from '@/assets'
import generateString from '@/utils/StringGenerator'
import BlankObjects from '@/entities/slideObjects/BlankObjects'
import DialogService from '../DialogService'
import PresentationRepository from '@/repositories/PresentationRepository'
import ConstructorStore from '@/services/store/ConstructorStore'
import ElementPreset from '@/entities/ElementPreset'
import IElementGroup from '@/entities/IElementGroup'

let presentation = PresentationRepository.Instance
let store = new ConstructorStore()

let groupsInfo = {
  media: [
    {
      name: 'image',
      elementType: 'ImageBlock',
      image: assets.logo,
      factoryFunction: 'generateImageProps'
    },
    {
      name: 'video',
      elementType: 'VideoBlock',
      image: assets.logo,
      factoryFunction: 'generateVideoProps'
    },
    {
      name: 'youtubeVideo',
      elementType: 'EmbeddedVideoBlock',
      image: assets.logo
    }
  ],
  figures: [
    {
      name: 'rectangle',
      elementType: 'Rectangle',
      image: assets.logo
    },
    {
      name: 'ellipse',
      elementType: 'EllipseBlock',
      image: assets.logo
    },
    {
      name: 'star',
      elementType: 'Star',
      image: assets.logo
    }
  ],
  datavis: [
    {
      name: 'table',
      elementType: 'Spreadsheet',
      image: assets.logo
    }
  ]
}

let dialogService = new DialogService()

export default class ElementPresetFactory {
  generateMediaProps(
    type: string,
    originalSize: { height: number; width: number },
    fileName: string
  ) {
    if (originalSize.height > 540) {
      originalSize.width /= originalSize.height / 540
      originalSize.height = 540
    }
    if (originalSize.width > 960) {
      originalSize.height /= originalSize.width / 960
      originalSize.width = 960
    }
    let result = BlankObjects[type]
    result.height = originalSize.height
    result.width = originalSize.width
    result.src = fileName
    result.id = generateString(12)
    return result
  }

  async generateImageProps() {
    let fileName = await dialogService.openChooseFileDialog('image')
    let imageSize = this.getImageSize(fileName)
    return this.generateMediaProps('ImageBlock', imageSize, fileName)
  }

  async generateVideoProps() {
    let fileName = await dialogService.openChooseFileDialog('video')
    let videoSize = await this.getVideoSize(fileName)
    return this.generateMediaProps('ImageBlock', videoSize, fileName)
  }

  private getImageSize(fileName: string) {
    let image = document.createElement('img')
    image.src = store.resourceFolder + '/' + fileName

    return {
      width: image.naturalWidth,
      height: image.naturalHeight
    }
  }

  private getVideoSize(fileName: string): Promise<{ width: number; height: number }> {
    let video = document.createElement('video')
    video.src = store.resourceFolder + '/' + fileName

    let container = document.createElement('x-internal')
    container.style.display = 'none'
    container.appendChild(video)
    document.body.appendChild(container)

    let onGotMetadata
    let result: Promise<{
      width: number
      height: number
    }> = new Promise((resolve, reject) => {
      onGotMetadata = resolve
    })

    video.addEventListener('loadedmetadata', () => {
      onGotMetadata({
        width: video.videoWidth,
        height: video.videoHeight
      })
    })

    return result
  }

  getTextGroup(): IElementGroup {
    let fontPresets = presentation.theme.fontPresets
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
          content: 'Type here'
        }
      }
      elementPresets.push(new ElementPreset(assets.text, entry.name, 'TextBlock', sampleTextBlock))
    }
    return {
      name: 'text',
      presets: elementPresets
    }
  }

  getGroupsFromInfo(info): IElementGroup[] {
    let result: IElementGroup[] = []

    for (const key in info) {
      let name = key
      let presets: ElementPreset[] = []
      for (const presetInfo of info[key]) {
        if (presetInfo.factoryFunction) {
          presets.push(
            new ElementPreset(
              presetInfo.image,
              presetInfo.name,
              presetInfo.elementType,
              presetInfo.factoryFunction
            )
          )
        } else {
          presets.push(
            new ElementPreset(
              presetInfo.image,
              presetInfo.name,
              presetInfo.elementType,
              BlankObjects[presetInfo.elementType]
            )
          )
        }
      }
      result.push({
        name,
        presets
      })
    }
    return result
  }

  writeGroupToMap(group: IElementGroup, map: Map<string, ElementPreset[]>) {
    map.set(group.name, group.presets)
  }

  getGroups() {
    let result = new Map<string, ElementPreset[]>()
    this.writeGroupToMap(this.getTextGroup(), result)
    for (const item of this.getGroupsFromInfo(groupsInfo)) {
      this.writeGroupToMap(item, result)
    }
    return result
  }
}
