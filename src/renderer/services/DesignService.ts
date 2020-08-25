import CommonRepository from '@/repositories/CommonRepository'
import Font from '@/entities/FontPreset'
import ReactiveService from './ReactiveService'
import BackgroundCollection, { getBlankCollection } from '@/entities/BackgroundCollection'
import Theme, { BackgroundType, typeFromString, stringFromType, getBlankTheme } from '@/entities/Theme'
import { remote } from 'electron'
import Color from '@/entities/Color'
const { ImageProcessing } = remote.require('./main')

let colorPalettes: Color[][] = []

export default class DesignService extends ReactiveService {
  openedTab!: string

  constructor() {
    let currentObj: any = super('DesignService', [CommonRepository])
    currentObj.openedTab = currentObj.openedTab ?? 'background'
    return currentObj
  }

  getBackgroundCollection(): BackgroundCollection {
    if (CommonRepository.backgroundCollection) return { ...CommonRepository.backgroundCollection }
    return getBlankCollection()
  }
  addBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)
    if (!CommonRepository.backgroundCollection) return
    if (CommonRepository.backgroundCollection.custom.has(type)) {
      let arr = CommonRepository.backgroundCollection.custom.get(type)
      if (!arr) return
      if (arr.indexOf(value) != -1) return
      else {
        CommonRepository.backgroundCollection.custom.get(type)?.push(value)
        CommonRepository.backgroundCollection = CommonRepository.backgroundCollection
      }
    }
  }

  addFontPreset(preset: Font) {
    CommonRepository.openedPresentation?.theme.fontPresets.push(preset)
    CommonRepository.commitPresentationChanges()
  }

  removeFontPreset(presetName: string) {
    if (!CommonRepository.openedPresentation) return

    let filteredPresets = CommonRepository.openedPresentation.theme.fontPresets.filter(
      (entry) => entry.name != presetName
    )
    CommonRepository.openedPresentation.theme.fontPresets = filteredPresets
    CommonRepository.commitPresentationChanges()
  }

  deleteBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)

    if (!CommonRepository.backgroundCollection) return
    let customCollection = CommonRepository.backgroundCollection.custom.get(type)
    if (customCollection) {
      CommonRepository.backgroundCollection.custom.set(
        type,
        customCollection.filter((entry) => entry != value)
      )
      CommonRepository.backgroundCollection = CommonRepository.backgroundCollection
    }
  }

  async selectBackground(type: BackgroundType | string, value: string) {
    if (typeof type == 'string') type = typeFromString(type)
    if (!CommonRepository.openedPresentation) return
    if (CommonRepository.openedPresentation) {
      CommonRepository.openedPresentation.theme.backgroundType = type
      CommonRepository.openedPresentation.theme.backgroundValue = value
    }

    let start = new Date()
    let v = await ImageProcessing.getMedianColor(stringFromType(type), value)

    CommonRepository.openedPresentation.theme.backgroundColor = new Color().fromRgb(v.r, v.g, v.b)
    console.log(`Got median color ${v} in ${new Date().getTime() - start.getTime()}ms`)
    CommonRepository.commitPresentationChanges()
  }
  selectPalette(palette: Color[]) {
    if (!CommonRepository.openedPresentation) return
    CommonRepository.openedPresentation.theme.palette = palette
    CommonRepository.commitPresentationChanges()
  }

  getRecommendedPalettes(col: Color): Color[][] {
    let start = new Date()
    if (colorPalettes.length == 0) {
      let pals = CommonRepository.paletteCollection ?? [[]]
      for (let palette of pals) {
        let colors: Color[] = []
        for (let color of palette) {
          colors.push(new Color().fromHex(color))
        }
        colorPalettes.push(colors)
      }
      console.log(`Loaded palettes in ${new Date().getTime() - start.getTime()}ms`)
    }

    let sortfn = function(a: { diff: number; val: Color[] }, b: { diff: number; val: Color[] }) {
      return a.diff - b.diff
    }
    let palettes: { diff: number; val: Color[] }[] = [
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
    ]

    for (let i = 0; i < colorPalettes.length; i++) {
      for (let j = 0; j < colorPalettes[i].length; j++) {
        let pcol = colorPalettes[i][j]
        let diff = Math.abs(col.r - pcol.r) + Math.abs(col.g - pcol.g) + Math.abs(col.b - pcol.b)

        let val = [...colorPalettes[i]]
        val[j] = new Color().fromRgb(col.r, col.g, col.b)
        palettes.push({ diff, val })
        palettes.sort(sortfn)
        palettes.pop()
      }
    }

    let result: Color[][] = []
    for (let palette of palettes) {
      result.push(palette.val)
    }

    return result
  }

  get theme(): Theme {
    if (!CommonRepository.openedPresentation) return getBlankTheme()
    return { ...CommonRepository.openedPresentation.theme }
  }

  async getFontList() {
    return await CommonRepository.getFontList()
  }

  changePresetFontSize(name, newSize) {
    let presets = CommonRepository.openedPresentation?.theme.fontPresets
    if (!presets) return
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].name == name) presets[i].size = newSize
    }
    CommonRepository.commitPresentationChanges()
  }

  changePresetFontWeight(name, newWeight) {
    let presets = CommonRepository.openedPresentation?.theme.fontPresets
    if (!presets) return
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].name == name) presets[i].weight = newWeight
    }
    CommonRepository.commitPresentationChanges()
  }

  changePresetFontFamily(name, newFamily) {
    let presets = CommonRepository.openedPresentation?.theme.fontPresets
    if (!presets) return
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].name == name) presets[i].family = newFamily
    }
    CommonRepository.commitPresentationChanges()
  }
}
