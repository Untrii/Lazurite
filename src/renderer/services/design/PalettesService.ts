import IColor from '@/entities/IColor'
import PresentationRepository from '@/repositories/PresentationRepository'

let presentation = PresentationRepository.Instance

export default class PalettesService {
  selectPalette(palette: IColor[]) {
    presentation.theme.palette = palette
  }
}
