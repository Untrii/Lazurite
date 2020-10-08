import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/NewRuntimeRepository'
import ISlideObject from '@/entities/ISlideObject'

let presentation = PresentationRepository.Instance
let runtimeData = RuntimeRepository.Instance.data

export default class SlideService {
  selectSlide(index: number) {
    runtimeData.selectedSlideIndex = index
    throw new Error('Not fully implemented')
    //this.deselectAllObjects()
  }
  createSlide() {
    presentation.slides.push(new Map())
  }
  deleteSlide(index: number): Map<string, ISlideObject> | undefined {
    let slides = presentation.slides
    let deletedSlide = slides[index]
    slides = slides.splice(index, 1)
    return deletedSlide
  }
}
