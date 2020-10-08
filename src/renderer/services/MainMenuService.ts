import CommonRepository from '@/repositories/CommonRepository'
import { getBlankPresentation } from '@/entities/IPresentation'

export default class MainMenuService {
  async createPresentation(fileName: string) {
    await CommonRepository.openPresentation(fileName)
    CommonRepository.openedPresentation = getBlankPresentation()
  }
  async openPresentation(fileName: string) {
    await CommonRepository.openPresentation(fileName)
    if (!CommonRepository.openedPresentation) {
      CommonRepository.openedPresentation = getBlankPresentation()
    }
  }
}
