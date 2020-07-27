import ReactiveService from './ReactiveService'
import ElementPreset from '@/entities/ElementPreset'
import DesignService from './DesignService'
import { Instance } from '@/repositories/CommonRepository'
import assets from '@/assets'
import DialogService from './DialogService'

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
  }

  private async generateImageProps() {
    let dialogService = new DialogService()
    let fileName = await dialogService.openChooseFileDialog('image')
    return {
      src: Instance.workspaceDataFolder + '/' + fileName,
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
