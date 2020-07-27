import ReactiveService from './ReactiveService'
import ElementPreset from '@/entities/ElementPreset'
import DesignService from './DesignService'
import { Instance } from '@/repositories/CommonRepository'
import assets from '@/assets'

export default class ElementService extends ReactiveService {
  private _groups: Map<string, ElementPreset[]> = new Map()

  constructor() {
    super()
    let designService = new DesignService()
    designService.addOnChangeListener(() => this.reloadFontPresets())
  }

  private async openFileSelectionDialog(
    type: 'iamge' | 'video'
  ): Promise<string> {
    return 'null'
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
