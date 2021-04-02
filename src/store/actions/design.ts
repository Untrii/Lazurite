import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import store from '@/store'
import io from '@/io'
import Color from '@/models/common/Color'
import { saveCurrentPresentation } from './util'
import { requireResourceAsync } from '@/dataLoader'
import FontPreset from '@/models/presentation/theme/FontPreset'
import Theme from '@/models/presentation/theme/Theme'
import Font from '@/models/common/Font'

type DefaultsName = keyof typeof store.currentTab.openedPresentation.theme.defaults

const getCurrentTheme = function () {
  return store.currentTab.openedPresentation.theme
}

export function addUserBackground(bg: Background) {
  store.userBackgrounds[bg.type] = store.userBackgrounds[bg.type].filter((item) => item.value != bg.value)
  store.userBackgrounds[bg.type].push(bg)
  io.saveUserBackgrounds(store.userBackgrounds)
}

export function deleteUserBackground(type: BackgroundType, index: number) {
  if (index >= 0 && index < store.userBackgrounds[type].length) {
    store.userBackgrounds[type].splice(index, 1)
    io.saveUserBackgrounds(store.userBackgrounds)
  }
}

export function changeDefaultColor(defaultName: DefaultsName, color: Color) {
  const theme = getCurrentTheme()
  theme.defaults[defaultName] = color
  saveCurrentPresentation()
}

export function changeBackground(bg: Background) {
  const theme = getCurrentTheme()
  theme.background = bg
  if (bg.type == 'image') requireResourceAsync(bg.value, store.currentTab.presentationPath)
  saveCurrentPresentation()
}

export async function addFontPreset() {
  const theme = getCurrentTheme()
  const fonts = await io.getFonts()
  const firstFont = fonts[0]
  const presets = theme.fontPresets
  const preset = new FontPreset()

  const generateName = function () {
    let i = 1
    while (presets.map((preset) => preset.name).includes('Preset ' + i)) i++
    return 'Preset ' + i
  }

  preset.name = generateName()
  if (firstFont) {
    preset.fontName = firstFont.name
    const regularIndex = firstFont.variants.findIndex((value) => value.weight == 400 && value.type == 'normal')
    if (regularIndex != -1) {
      preset.fontSource = firstFont.variants[regularIndex].source
    } else if (firstFont.variants.length > 0) {
      preset.fontSource = firstFont.variants[0].source
      preset.weight = firstFont.variants[0].weight
      preset.fontType = firstFont.variants[0].type
    }
  }

  theme.fontPresets.push(preset)
  saveCurrentPresentation()
}

function changePreset(index: number, changer: (preset: FontPreset) => void) {
  const theme = getCurrentTheme()

  if (index >= 0 && index < theme.fontPresets.length) {
    changer(theme.fontPresets[index])
    saveCurrentPresentation()
  }
}

export function changePresetName(index: number, newName: string) {
  changePreset(index, (preset) => {
    preset.name = newName
  })
}

export function changePresetFontSize(index: number, newSize: number) {
  changePreset(index, (preset) => {
    preset.size = newSize
  })
}

export function changePresetFontSource(index: number, newFontSource: string) {
  changePreset(index, (preset) => {
    preset.fontSource = newFontSource
  })
}

export function selectPresetFont(font: Font, presetIndex = -1) {
  if (presetIndex == -1) {
    const theme = getCurrentTheme()
    for (let i = 0; i < theme.fontPresets.length; i++) {
      selectPresetFont(font, i)
    }
    return
  }

  changePreset(presetIndex, (preset) => {
    const defaultVariant = font.defaultVariant
    if (!font.weights.includes(preset.weight) || !font.types.includes(preset.fontType)) {
      preset.weight = defaultVariant.weight
      preset.fontType = defaultVariant.type
      preset.fontSource = defaultVariant.source
    } else {
      preset.fontSource = font.variants.find(
        (variant) => variant.type == preset.fontType && variant.weight == preset.weight
      ).source
    }
    preset.fontName = font.name
  })
}

export function deleteFontPreset(index: number) {
  const theme = getCurrentTheme()

  if (index >= 0 && index < theme.fontPresets.length) {
    theme.fontPresets.splice(index, 1)
    saveCurrentPresentation()
  }
}

window['addUserBackground'] = addUserBackground
