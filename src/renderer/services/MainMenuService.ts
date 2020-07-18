import { Instance } from '@/repositories/CommonRepository'
import { getBlankPresentation } from '@/entities/Presentation'
import ReactiveService from '@/services/ReactiveService'

export default class MainMenuService extends ReactiveService {
  async createPresentation(fileName: string) {
    await Instance.openPresentation(fileName)
    Instance.openedPresentation = getBlankPresentation()
  }
  async openPresentation(fileName: string) {
    await Instance.openPresentation(fileName)
    if (!Instance.openedPresentation) {
      Instance.openedPresentation = getBlankPresentation()
    }
  }
}
