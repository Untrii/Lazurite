import { Instance } from '@/repositories/CommonRepository'
import ReactiveService from './ReactiveService'
import SlideObject, { getBlankObject } from '@/entities/SlideObject'
import Theme, { getBlankTheme } from '@/entities/Theme'

export default class VisualisationService extends ReactiveService {
  constructor() {
    super()
  }

  slideByIndex(index: number): Map<string, SlideObject> {
    if (Instance.openedPresentation && index >= 0) {
      if (Instance.openedPresentation.slides.length <= index) return new Map()
      let res: any = Instance.openedPresentation.slides
      return new Map(res[index])
    }

    return new Map()
  }

  elementById(id: string): SlideObject {
    console.log('Rendering element with ID: ' + id)
    if (!Instance.openedPresentation) return getBlankObject()
    for (let slide of Instance.openedPresentation.slides) {
      if (slide.has(id)) {
        let res = slide.get(id)
        if (res) return res
      }
    }
    return getBlankObject()
  }

  get theme(): Theme {
    if (!Instance.openedPresentation) return getBlankTheme()
    return Instance.openedPresentation.theme
  }
}
