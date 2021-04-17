import assets from '@/assets'
import { AnyTool, AreaDrawerTool, PointerTool } from '@/models/editor/Tool'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import FontPreset from '@/models/presentation/theme/FontPreset'
import store, { StoreType } from '@/store'

interface IToolButton {
  displayName: string
  icon: string
  iconScale: number
  tool: AnyTool
}

interface IButtonGroup {
  name: string
  displayName: string | null
  items: IToolButton[]
}

function createPointer(store: StoreType) {
  const result = new PointerTool()
  result.addListener('click', ({ x, y, ctrl }) => {
    store.onPointerClick(x, y, ctrl)
  })
  result.addListener('areaSelect', ({ top, left, right, bottom, ctrl }) => {
    store.onAreaSelect(top, left, right, bottom, ctrl)
  })
  result.addListener('selectionMove', ({ left, top, startOffsetLeft, startOffsetTop }) => {
    store.moveSelection(startOffsetLeft, startOffsetTop, left, top)
  })
  return result
}

function createTextTool(store: StoreType, preset: FontPreset) {
  const presentation = store.getCurrentPresentation()
  const result = new AreaDrawerTool()

  result.addListener('areaSelect', ({ top, left, right, bottom }) => {
    const textBlock = new TextSlideObject()
    textBlock.top = top
    textBlock.left = left
    textBlock.width = right - left
    textBlock.height = bottom - top
    textBlock.content = 'Test content'
    textBlock.style.fontFamily = preset.fontFamily
    textBlock.style.fontSource = preset.fontSource
    textBlock.style.fontSize = preset.size
    textBlock.style.fontWeight = preset.weight
    textBlock.style.color = presentation.theme.defaults.mainText

    textBlock.zIndex = store.nextZIndex()
    store.addObjectOnSlide(textBlock)
    store.select(textBlock)
  })
  return result
}

export default class ToolGetters {
  getToolGroups(this: StoreType): IButtonGroup[] {
    const fontPresets = store.currentTab.openedPresentation.theme.fontPresets
    const result: IButtonGroup[] = []
    result.push({
      name: 'pointer',
      displayName: null,
      items: [
        {
          displayName: 'Pointer',
          icon: assets.pointer,
          iconScale: 1,
          tool: createPointer(this),
        },
      ],
    })

    const text: IToolButton[] = []

    let minFontSize = 200
    let maxFontSize = 5

    for (const preset of fontPresets) {
      maxFontSize = Math.max(maxFontSize, preset.size)
      minFontSize = Math.min(minFontSize, preset.size)
    }

    for (let i = 0; i < fontPresets.length; i++) {
      const preset = fontPresets[i]
      const iconScale = (preset.size / maxFontSize) * 1.6

      const previewURL = preset.fontSource.replace('local://', 'font-preview://') + '::Aa'
      text.push({
        displayName: preset.name,
        icon: previewURL,
        iconScale,
        tool: createTextTool(this, preset),
      })
    }
    result.push({
      name: 'text',
      displayName: 'Text',
      items: text,
    })

    return result
  }
}
