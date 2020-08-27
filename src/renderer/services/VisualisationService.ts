import CommonRepository from '@/repositories/CommonRepository'
import ReactiveService from './ReactiveService'
import SlideObject, { getBlankObject } from '@/entities/ISlideObject'
import Theme, { getBlankTheme } from '@/entities/ITheme'

export default class VisualisationService extends ReactiveService {
  constructor() {
    let currentObj: any = super('VisualisationService', [CommonRepository])
    return currentObj
  }

  slideByIndex(index: number): Map<string, SlideObject> {
    if (CommonRepository.openedPresentation && index >= 0) {
      if (CommonRepository.openedPresentation.slides.length <= index) return new Map()
      let res: any = CommonRepository.openedPresentation.slides
      return new Map(res[index])
    }

    return new Map()
  }

  elementById(id: string): SlideObject {
    //console.log('Rendering element with ID: ' + id)
    if (!CommonRepository.openedPresentation) return getBlankObject()
    for (let slide of CommonRepository.openedPresentation.slides) {
      if (slide.has(id)) {
        let res = slide.get(id)
        if (res) return res
      }
    }
    return getBlankObject()
  }

  get theme(): Theme {
    if (!CommonRepository.openedPresentation) return getBlankTheme()
    return CommonRepository.openedPresentation.theme
  }
}
