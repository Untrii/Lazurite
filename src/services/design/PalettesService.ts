import Color from '@/entities/Color'
import IColor from '@/entities/IColor'
import PalettesRepository from '@/repositories/PalettesRepository'
import PresentationRepository from '@/repositories/PresentationRepository'

const presentation = PresentationRepository.Instance
const parsedPalettes = PalettesRepository.Instance.parsedData
const colorPalettes: IColor[][] = []

export default class PalettesService {
  selectPalette(palette: IColor[]) {
    presentation.theme.palette = palette
  }

  getRecommendedPalettes(col: IColor): IColor[][] {
    const start = new Date()
    if (colorPalettes.length == 0) {
      const pals = parsedPalettes
      for (const palette of pals) {
        const colors: IColor[] = []
        for (const color of palette) {
          colors.push(color)
        }
        colorPalettes.push(colors)
      }
      console.log(`Loaded palettes in ${new Date().getTime() - start.getTime()}ms`)
    }

    const sortfn = function(a: { diff: number; val: IColor[] }, b: { diff: number; val: IColor[] }) {
      return a.diff - b.diff
    }
    const palettes: { diff: number; val: IColor[] }[] = [
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
        const pcol = colorPalettes[i][j]
        const diff = Math.abs(col.r - pcol.r) + Math.abs(col.g - pcol.g) + Math.abs(col.b - pcol.b)

        const val = [...colorPalettes[i]]
        val[j] = new Color().fromRgb(col.r, col.g, col.b)
        palettes.push({ diff, val })
        palettes.sort(sortfn)
        palettes.pop()
      }
    }

    const result: IColor[][] = []
    for (const palette of palettes) {
      result.push(palette.val)
    }

    return result
  }
}
