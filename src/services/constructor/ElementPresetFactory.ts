import assets from '@/assets'
import generateString from '@/utils/StringGenerator'
import BlankObjects from '@/entities/slideObjects/BlankObjects'
import DialogService from '../DialogService'
import PresentationRepository from '@/repositories/PresentationRepository'
import ConstructorStore from '@/services/store/ConstructorStore'
import ElementPreset from '@/entities/ElementPreset'
import IElementGroup from '@/entities/IElementGroup'

const presentation = PresentationRepository.Instance
const store = new ConstructorStore()

const groupsInfo = {
  media: [
    {
      name: 'image',
      elementType: 'ImageBlock',
      image: assets.logo,
      factoryFunction: 'generateImageProps',
    },
    {
      name: 'video',
      elementType: 'VideoBlock',
      image: assets.logo,
      factoryFunction: 'generateVideoProps',
    },
    {
      name: 'youtubeVideo',
      elementType: 'EmbeddedVideoBlock',
      image: assets.logo,
    },
  ],
  figures: [
    {
      name: 'rectangle',
      elementType: 'Rectangle',
      image: assets.logo,
    },
    {
      name: 'ellipse',
      elementType: 'EllipseBlock',
      image: assets.logo,
    },
    {
      name: 'star',
      elementType: 'Star',
      image: assets.logo,
    },
  ],
  datavis: [
    {
      name: 'table',
      elementType: 'Spreadsheet',
      image: assets.logo,
    },
  ],
}

const dialogService = new DialogService()

export default class ElementPresetFactory {
  generateMediaProps(type: string, originalSize: { height: number; width: number }, fileName: string) {
    if (originalSize.height > 540) {
      originalSize.width /= originalSize.height / 540
      originalSize.height = 540
    }
    if (originalSize.width > 960) {
      originalSize.height /= originalSize.width / 960
      originalSize.width = 960
    }
    const result = BlankObjects[type]
    result.height = originalSize.height
    result.width = originalSize.width
    result.src = fileName
    result.id = generateString(12)
    return result
  }

  getImageSize(fileName: string) {
    const image = document.createElement('img')
    image.src = 'local-img://' + store.resourceFolder + '/' + fileName

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  }

  getVideoSize(fileName: string): Promise<{ width: number; height: number }> {
    const video = document.createElement('video')
    video.src = 'local-img://' + store.resourceFolder + '/' + fileName

    const container = document.createElement('x-internal')
    container.style.display = 'none'
    container.appendChild(video)
    document.body.appendChild(container)

    let onGotMetadata
    const result: Promise<{
      width: number
      height: number
    }> = new Promise((resolve, reject) => {
      onGotMetadata = resolve
    })

    video.addEventListener('loadedmetadata', () => {
      onGotMetadata({
        width: video.videoWidth,
        height: video.videoHeight,
      })
    })

    return result
  }

  async generateImageProps() {
    const fileName = await dialogService.openChooseFileDialog('image')
    const imageSize = this.getImageSize(fileName)
    return this.generateMediaProps('ImageBlock', imageSize, fileName)
  }

  async generateVideoProps() {
    const fileName = await dialogService.openChooseFileDialog('video')
    const videoSize = await this.getVideoSize(fileName)
    return this.generateMediaProps('VideoBlock', videoSize, fileName)
  }

  getTextGroup(): IElementGroup {
    const fontPresets = presentation.theme.fontPresets
    const elementPresets: ElementPreset[] = []

    for (const entry of fontPresets) {
      const sampleTextBlock = {
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
    return {
      name: 'text',
      presets: elementPresets,
    }
  }

  getGroupsFromInfo(info): IElementGroup[] {
    const result: IElementGroup[] = []

    for (const key in info) {
      const name = key
      const presets: ElementPreset[] = []
      for (const presetInfo of info[key]) {
        if (presetInfo.factoryFunction) {
          presets.push(
            new ElementPreset(presetInfo.image, presetInfo.name, presetInfo.elementType, () =>
              this[presetInfo.factoryFunction]()
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
        presets,
      })
    }
    return result
  }

  writeGroupToMap(group: IElementGroup, map: Map<string, ElementPreset[]>) {
    map.set(group.name, group.presets)
  }

  getGroups() {
    const result = new Map<string, ElementPreset[]>()
    this.writeGroupToMap(this.getTextGroup(), result)
    for (const item of this.getGroupsFromInfo(groupsInfo)) {
      this.writeGroupToMap(item, result)
    }
    return result
  }
}
