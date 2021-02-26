import Color from '@/models/common/Color'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import AppStateModel from '@/models/store/AppStateModel'
import randomString from '@/util/randomString'
import { reactive } from '@/util/reactivity'

export const raw = new AppStateModel()

raw.currentTab.openedPresentation.slides.push([])
let text = new TextSlideObject()
text.content = 'Text block\nLine2'
text.top = 270
text.left = 480
text.height = 540
text.width = 960
text.style.fontSize = 40
text.verticalAlign = 'bottom'
text.horizontalAlign = 'middle'
raw.currentTab.currentSlide.push(text)
raw.currentTab.openedPresentation.theme.background = {
  medianColor: new Color(),
  value: '#C7E8FF',
  type: 'color',
}

const reactiveStore = reactive(raw)

export default reactiveStore
window['store'] = reactiveStore
