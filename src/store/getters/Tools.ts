import assets from '@/assets'
import { AnyTool, AreaDrawerTool, PointerTool } from '@/models/editor/Tool'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import FontPreset from '@/models/presentation/theme/FontPreset'
import { StoreType } from '@/store'

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
    const [deltaX, deltaY, linesX, linesY] = store.stickSelection(left - startOffsetLeft, top - startOffsetTop)
    const actualX = left - startOffsetLeft + deltaX
    const actualY = top - startOffsetTop + deltaY
    const selection = store.currentTab.selection

    if (deltaX != 0 || deltaY != 0) result.triggerEvent('stick', { x: linesX, y: linesY })
    else result.triggerEvent('unstick', {})
    store.moveSelection(actualX, actualY)
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
    textBlock.presetId = preset.id
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
    const fontPresets = this.currentTab.openedPresentation.theme.fontPresets
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
