import { Instance } from '../repository/CommonRepository'
import ReactiveService from './ReactiveService'
import BackgroundCollection, {
  getBlankCollection,
} from '../entities/BackgroundCollection'
import SlideObject from '../entities/SlideObject'
import Presentation from '../entities/Presentation'
import Theme, {
  BackgroundType,
  typeFromString,
  stringFromType,
  getBlankTheme,
} from '../entities/Theme'
import { remote } from 'electron'
import Color from '../entities/Color'
const { ImageProcessing } = remote.require('./main')

let colorPalettes: Color[][] = []

export default class DesignService extends ReactiveService {
  openedTab: string = 'background'

  constructor() {
    super()

    Instance.addOnChangeListener(() => {
      this.onChange()
    })
  }

  getBackgroundCollection(): BackgroundCollection {
    if (Instance.backgroundCollection)
      return { ...Instance.backgroundCollection }
    return getBlankCollection()
  }
  addBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)
    if (!Instance.backgroundCollection) return
    if (Instance.backgroundCollection.custom.has(type)) {
      let arr = Instance.backgroundCollection.custom.get(type)
      if (!arr) return
      if (arr.indexOf(value) != -1) return
      else {
        Instance.backgroundCollection.custom.get(type)?.push(value)
        Instance.backgroundCollection = Instance.backgroundCollection
      }
    }
  }

  deleteBackground(type: BackgroundType | string, value: string) {
    if (typeof type != 'string') type = stringFromType(type)

    if (!Instance.backgroundCollection) return
    if (Instance.backgroundCollection.custom.has(type)) {
      Instance.backgroundCollection.custom.set(
        type,
        Instance.backgroundCollection.custom
          .get(type)
          .filter((entry) => entry != value)
      )
      Instance.backgroundCollection = Instance.backgroundCollection
    }
  }

  async selectBackground(type: BackgroundType | string, value: string) {
    if (typeof type == 'string') type = typeFromString(type)
    if (!Instance.openedPresentation) return
    if (Instance.openedPresentation) {
      Instance.openedPresentation.theme.backgroundType = type
      Instance.openedPresentation.theme.backgroundValue = value
    }

    let start = new Date()
    let v = await ImageProcessing.getMedianColor(stringFromType(type), value)

    Instance.openedPresentation.theme.backgroundColor = new Color().fromRgb(
      v.r,
      v.g,
      v.b
    )
    console.log(
      `Got median color ${v} in ${new Date().getTime() - start.getTime()}ms`
    )
    Instance.openedPresentation = Instance.openedPresentation
  }
  selectPalette(palette: Color[]) {
    if (!Instance.openedPresentation) return
    Instance.openedPresentation.theme.palette = palette
    Instance.openedPresentation = Instance.openedPresentation
  }

  getRecommendedPalettes(col: Color): Color[][] {
    let start = new Date()
    if (colorPalettes.length == 0) {
      let pals = Instance.paletteCollection
      for (let palette of pals) {
        let colors: Color[] = []
        for (let color of palette) {
          colors.push(new Color().fromHex(color))
        }
        colorPalettes.push(colors)
      }
      console.log(
        `Loaded palettes in ${new Date().getTime() - start.getTime()}ms`
      )
    }

    let sortfn = function(
      a: { diff: number; val: Color[] },
      b: { diff: number; val: Color[] }
    ) {
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
        let diff =
          Math.abs(col.r - pcol.r) +
          Math.abs(col.g - pcol.g) +
          Math.abs(col.b - pcol.b)

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
    if (!Instance.openedPresentation) return getBlankTheme()
    return Instance.openedPresentation.theme
  }

  async getFontList() {
    return await Instance.getFontList()
  }
}
