import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import AppStateModel from '@/models/store/AppStateModel'
import randomString from '@/util/randomString'
import { reactive } from '@/util/reactivity'

export const raw = new AppStateModel()

raw.currentTab.openedPresentation.slides.push([])
raw.currentTab.currentSlide.push(new TextSlideObject())

const reactiveStore = reactive(raw)

export default reactiveStore
window['store'] = reactiveStore
