import { promises, existsSync } from 'fs'
import { remote } from 'electron'
import path from 'path'

import Color from '@/models/common/Color'
import Font from '@/models/common/Font'
import FontPreset from '@/models/presentation/theme/FontPreset'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import { requireResourceAsync } from '@/dataLoader'
import store, { StoreType } from '@/store'
import io from '@/io'
import isElectron from '@/util/isElectron'
import randomString from '@/util/randomString'

import createImagePreview from '@/util/createImagePreview'
import getMedianColor from '@/util/color/getMedianColor'

const { app } = remote
const { copyFile, writeFile, mkdir } = promises

type DefaultsName = keyof typeof store.currentTab.openedPresentation.theme.defaults

const getCurrentTheme = function () {
  return store.currentTab.openedPresentation.theme
}

async function saveImageFile(store: StoreType, file: string | ArrayBuffer, type: 'pattern' | 'image') {
  if (isElectron()) {
    const folderName = type == 'image' ? 'images' : 'patterns'

    const dataFolder = path.join(app.getPath('userData'), folderName)
    const previewFolder = path.join(dataFolder, 'preview')

    try {
      if (!existsSync(dataFolder)) await mkdir(dataFolder)
      if (type == 'image' && !existsSync(previewFolder)) await mkdir(previewFolder)

      let extension = 'jpg'
      if (typeof file == 'string') {
        file = file.replaceAll('\\', '/')
        extension = file.split('.').pop()
      }

      const shortName = randomString(12) + '.' + extension
      const imagePath = path.join(dataFolder, shortName)
      const previewPath = path.join(previewFolder, shortName)

      if (typeof file == 'string') {
        await copyFile(file, imagePath)
      } else {
        await writeFile(imagePath, new Uint8Array(file))
      }

      const imageURL = `local://#user/${folderName}/` + shortName
      const bg = new Background()
      bg.type = type
      bg.medianColor = await getMedianColor('image', imageURL)
      bg.value = bg.displayValue = imageURL

      if (type == 'image') {
        const previewURL = `local://#user/${folderName}/preview/` + shortName
        const preview = await createImagePreview(imageURL)
        await writeFile(previewPath, new Uint8Array(preview))
        bg.displayValue = previewURL
      }

      store.addUserBackground(bg)
    } catch (error) {
      console.error(error)
    }
  } else {
    throw new Error("Image adding doesn't implemented in web version")
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
  async addImages(this: StoreType, files: ArrayBuffer[]) {
    for (const file of files) {
      await saveImageFile(this, file, 'image')
    }
  }

  async addPatterns(this: StoreType, files: ArrayBuffer[]) {
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

  changePresetName(this: StoreType, index: number, newName: string) {
    changePreset(this, index, (preset) => {
      preset.name = newName
    })
  }

  changePresetFontSize(this: StoreType, index: number, newSize: number) {
    changePreset(this, index, (preset) => {
      preset.size = newSize
    })
  }

  changePresetFontSource(this: StoreType, index: number, newFontSource: string) {
    changePreset(this, index, (preset) => {
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
