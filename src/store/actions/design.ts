import { promises, existsSync } from 'fs'
import { remote } from 'electron'
import path from 'path'

import Color from '@/models/common/Color'
import Font from '@/models/common/Font'
import FontPreset from '@/models/presentation/theme/FontPreset'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import { requireResourceAsync } from '@/dataLoader'
import store from '@/store'
import io from '@/io'
import isElectron from '@/util/isElectron'
import randomString from '@/util/randomString'

import { saveCurrentPresentation } from './util'
import createImagePreview from '@/util/createImagePreview'
import getMedianColor from '@/util/getMedianColor'

const { app } = remote
const { copyFile, writeFile, mkdir } = promises

type DefaultsName = keyof typeof store.currentTab.openedPresentation.theme.defaults

const getCurrentTheme = function () {
  return store.currentTab.openedPresentation.theme
}

async function saveImageFile(file: string, type: 'pattern' | 'image') {
  if (isElectron()) {
    const folderName = type == 'image' ? 'images' : 'patterns'

    const dataFolder = path.join(app.getPath('userData'), folderName)
    const previewFolder = path.join(dataFolder, 'preview')

    try {
      file = file.replaceAll('\\', '/')

      if (!existsSync(dataFolder)) await mkdir(dataFolder)
      if (type == 'image' && !existsSync(previewFolder)) await mkdir(previewFolder)

      const extension = file.split('.').pop()
      const shortName = randomString(12) + '.' + extension
      const imagePath = path.join(dataFolder, shortName)
      const previewPath = path.join(previewFolder, shortName)
      await copyFile(file, imagePath)

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

      addUserBackground(bg)
    } catch (error) {
      console.error(error)
    }
  } else {
    throw new Error("Image adding doesn't implemented in web version")
  }
}

export async function addImages(files: string[]) {
  for (const file of files) {
    await saveImageFile(file, 'image')
  }
}

export async function addPatterns(files: string[]) {
  for (const file of files) {
    await saveImageFile(file, 'pattern')
  }
}

export function addUserBackground(bg: Background) {
  store.userBackgrounds[bg.type] = store.userBackgrounds[bg.type].filter((item) => item.value != bg.value)
  store.userBackgrounds[bg.type].push(bg)
  io.saveUserBackgrounds(store.userBackgrounds)
}

export async function deleteUserBackground(type: BackgroundType, index: number) {
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

export function changeDefaultColor(defaultName: DefaultsName, color: Color) {
  const theme = getCurrentTheme()
  theme.defaults[defaultName] = color
  saveCurrentPresentation()
}

export function changeBackground(bg: Background) {
  const theme = getCurrentTheme()
  theme.background = bg
  if (bg.type == 'image') requireResourceAsync(bg.value)
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
