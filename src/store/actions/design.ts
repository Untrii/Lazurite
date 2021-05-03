import Color from '@/models/common/Color'
import Font from '@/models/common/Font'
import FontPreset from '@/models/presentation/theme/FontPreset'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import { requireResourceAsync } from '@/dataLoader'
import store, { StoreType } from '@/store'
import io from '@/io'
import randomString from '@/util/randomString'

import createImagePreview from '@/util/createImagePreview'
import getMedianColor from '@/util/color/getMedianColor'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import TextStyle from '@/models/presentation/slideObjects/base/TextStyle'

type DefaultsName = keyof typeof store.currentTab.openedPresentation.theme.defaults

const getCurrentTheme = function () {
  return store.currentTab.openedPresentation.theme
}

async function saveImageFile(store: StoreType, file: Blob, type: 'pattern' | 'image') {
  const dataFolder = type == 'image' ? '/images' : '/patterns'
  const previewFolder = '/images/preview'

  try {
    const extension = file.type.split('/').pop()

    const shortName = randomString(12) + '.' + extension
    const imagePath = `${dataFolder}/${shortName}`
    const previewPath = `${previewFolder}/${shortName}`

    const imageURL = await io.addFile(file, 'user', imagePath)

    const bg = new Background()
    bg.type = type
    bg.medianColor = await getMedianColor('image', imageURL)
    bg.value = bg.displayValue = imageURL

    if (type == 'image') {
      const preview = await createImagePreview(imageURL)
      const previewURL = await io.addFile(preview, 'user', previewPath)
      bg.displayValue = previewURL
    }

    store.addUserBackground(bg)
  } catch (error) {
    console.error(error)
  }
}

function changePreset(store: StoreType, index: number, changer: (preset: FontPreset) => void) {
  const theme = getCurrentTheme()

  if (index >= 0 && index < theme.fontPresets.length) {
    changer(theme.fontPresets[index])
    store.saveCurrentPresentation()
  }
}

export default class DesignActions {
  async addImages(this: StoreType, files: Blob[]) {
    for (const file of files) {
      await saveImageFile(this, file, 'image')
    }
  }

  async addPatterns(this: StoreType, files: Blob[]) {
    for (const file of files) {
      await saveImageFile(this, file, 'pattern')
    }
  }

  addUserBackground(this: StoreType, bg: Background) {
    store.userBackgrounds[bg.type] = store.userBackgrounds[bg.type].filter((item) => item.value != bg.value)
    store.userBackgrounds[bg.type].push(bg)
    io.saveUserBackgrounds(store.userBackgrounds)
  }

  async deleteUserBackground(this: StoreType, type: BackgroundType, index: number) {
    if (index >= 0 && index < store.userBackgrounds[type].length) {
      const deletingBackgound = store.userBackgrounds[type][index]
      store.userBackgrounds[type].splice(index, 1)
      await io.saveUserBackgrounds(store.userBackgrounds)

      if (deletingBackgound.type == 'image' || deletingBackgound.type == 'pattern') {
        await io.delete(deletingBackgound.value)
        await io.delete(deletingBackgound.displayValue)
      }
    }
  }

  changeDefaultColor(this: StoreType, defaultName: DefaultsName, color: Color) {
    const theme = getCurrentTheme()
    theme.defaults[defaultName] = color
    this.saveCurrentPresentation()
  }

  changeBackground(this: StoreType, bg: Background) {
    const theme = getCurrentTheme()
    theme.background = bg
    if (bg.type == 'image') requireResourceAsync(bg.value)
    this.saveCurrentPresentation()
  }

  async addFontPreset(this: StoreType) {
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
    this.saveCurrentPresentation()
  }

  changeNotOverridedTextStyle<T extends keyof TextStyle>(
    this: StoreType,
    name: T,
    oldValue: TextStyle[T],
    newValue: TextStyle[T]
  ) {
    for (const slide of this.getCurrentPresentation().slides) {
      for (const slideObject of slide) {
        if (slideObject instanceof TextSlideObject) {
          if (slideObject.style[name] == oldValue) slideObject.style[name] = newValue
        }
      }
    }
  }

  changePresetName(this: StoreType, index: number, newName: string) {
    changePreset(this, index, (preset) => {
      preset.name = newName
    })
  }

  changePresetFontSize(this: StoreType, index: number, newSize: number) {
    changePreset(this, index, (preset) => {
      this.changeNotOverridedTextStyle('fontSize', preset.size, newSize)
      preset.size = newSize
    })
  }

  changePresetFontSource(this: StoreType, index: number, newFontSource: string) {
    changePreset(this, index, (preset) => {
      this.changeNotOverridedTextStyle('fontSource', preset.fontSource, newFontSource)
      preset.fontSource = newFontSource
    })
  }

  selectPresetFont(this: StoreType, font: Font, presetIndex = -1) {
    if (presetIndex == -1) {
      const theme = getCurrentTheme()
      for (let i = 0; i < theme.fontPresets.length; i++) {
        this.selectPresetFont(font, i)
      }
      return
    }

    changePreset(this, presetIndex, (preset) => {
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

  deleteFontPreset(this: StoreType, index: number) {
    const theme = getCurrentTheme()

    if (index >= 0 && index < theme.fontPresets.length) {
      theme.fontPresets.splice(index, 1)
      this.saveCurrentPresentation()
    }
  }
}
