import Color from '@/entities/Color'
import IColor from '@/entities/IColor'
import PalettesRepository from '@/repositories/PalettesRepository'
import PresentationRepository from '@/repositories/PresentationRepository'

let presentation = PresentationRepository.Instance
let parsedPalettes = PalettesRepository.Instance.parsedData
let colorPalettes: IColor[][] = []

export default class PalettesService {
  selectPalette(palette: IColor[]) {
    presentation.theme.palette = palette
  }

  getRecommendedPalettes(col: IColor): IColor[][] {
    let start = new Date()
    if (colorPalettes.length == 0) {
      let pals = parsedPalettes
      for (let palette of pals) {
        let colors: IColor[] = []
        for (let color of palette) {
          colors.push(color)
        }
        colorPalettes.push(colors)
      }
      console.log(`Loaded palettes in ${new Date().getTime() - start.getTime()}ms`)
    }

    let sortfn = function(a: { diff: number; val: IColor[] }, b: { diff: number; val: IColor[] }) {
      return a.diff - b.diff
    }
    let palettes: { diff: number; val: IColor[] }[] = [
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] },
      { diff: 765, val: [] }
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

    let result: IColor[][] = []
    for (let palette of palettes) {
      result.push(palette.val)
    }

    return result
  }
}
