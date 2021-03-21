import io from '@/io'
import Slide from '@/models/presentation/Slide'
import store from '@/store'
import { saveCurrentPresentation } from './util'

export function createSlide() {
  store.currentTab.openedPresentation.slides.push([])
  saveCurrentPresentation()
}

export function deleteSlide(index: number) {
  const slides = store.currentTab.openedPresentation.slides
  if (index >= 0 && index < slides.length) slides.splice(index, 1)
  saveCurrentPresentation()
}
