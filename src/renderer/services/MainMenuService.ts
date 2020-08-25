import CommonRepository from '@/repositories/CommonRepository'
import { getBlankPresentation } from '@/entities/Presentation'
import ReactiveService from '@/services/ReactiveService'

export default class MainMenuService extends ReactiveService {
  constructor() {
    let currentObj: any = super('MainMenuService', [CommonRepository])
    return currentObj
  }
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
