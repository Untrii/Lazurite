import io from '@/io'
import Slide from '@/models/presentation/Slide'
import store from '@/store'
import { saveCurrentPresentation } from './util'

export function createSlide() {
  store.currentTab.openedPresentation.slides.push([])
  saveCurrentPresentation()
}
