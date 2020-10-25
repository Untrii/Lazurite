import IFontPreset from '@/entities/IFontPreset'
import PresentationRepository from '@/repositories/PresentationRepository'

const presentation = PresentationRepository.Instance

export default class FontService {
  addFontPreset(preset: IFontPreset) {
    presentation.theme.fontPresets.push(preset)
  }

  removeFontPreset(presetId: string) {
    const filteredPresets = presentation.theme.fontPresets.filter(entry => entry.id != presetId)
    presentation.theme.fontPresets = filteredPresets
  }

  private changePresetProp(id, newVal, propName) {
    const presets = presentation.theme.fontPresets
    if (!presets) return
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].id == id) presets[i][propName] = newVal
    }
  }

  changePresetFontSize(id, newSize) {
    this.changePresetProp(id, newSize, 'size')
  }

  changePresetFontWeight(id, newWeight) {
    this.changePresetProp(id, newWeight, 'weight')
  }

  changePresetFontFamily(id, newFamily) {
    this.changePresetProp(id, newFamily, 'family')
  }

  changePresetName(id, newName) {
    this.changePresetProp(id, newName, 'name')
  }
}
