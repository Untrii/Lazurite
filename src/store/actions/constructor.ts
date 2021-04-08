import { AnyTool } from '@/models/editor/Tool'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import store from '@/store'
import { getCurrentSlide } from '../getters/reactive/constructor'
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

export function setTool(index: [number, number], tool: AnyTool) {
  store.currentTab.addTabToolIndex = index
  store.currentTab.tool = tool
}

export function addObjectOnSlide(object: SlideObject) {
  const slide = getCurrentSlide()
  if (slide) {
    slide.push(object)
  }
  saveCurrentPresentation()
}
