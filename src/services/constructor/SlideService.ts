import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import ISlideObject from '@/entities/ISlideObject'
import SlideObjectService from './SlideObjectService'

const presentation = PresentationRepository.Instance
const runtimeData = RuntimeRepository.Instance.data

export default class SlideService {
  selectSlide(index: number) {
    runtimeData.selectedSlideIndex = index
    const service = new SlideObjectService()
    service.deselectAllObjects()
  }
  createSlide() {
    presentation.slides.push(new Map())
  }
  deleteSlide(index: number): Map<string, ISlideObject> | undefined {
    let slides = presentation.slides
    const deletedSlide = slides[index]
    slides = slides.splice(index, 1)
    return deletedSlide
  }
}
