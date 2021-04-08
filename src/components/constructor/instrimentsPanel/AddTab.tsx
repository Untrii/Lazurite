import './AddTab.scss'

import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'

import assets from '@/assets'
import store from '@/store'
import { AnyTool, AreaDrawerTool, PointerTool } from '@/models/editor/Tool'
import FontPreset from '@/models/presentation/theme/FontPreset'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import Button from '@/components/controls/Button'
import { getCurrentPresentation, isAnySlideExists, nextZIndex } from '@/store/getters/reactive/constructor'
import { moveSelection, onAreaSelect, onPointerClick, select } from '@/store/actions/raw/workspace'
import { setTool, addObjectOnSlide } from '@/store/actions/constructor'

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

function createPointer() {
  const result = new PointerTool()
  result.addListener('click', ({ x, y, ctrl }) => {
    onPointerClick(x, y, ctrl)
  })
  result.addListener('areaSelect', ({ top, left, right, bottom, ctrl }) => {
    onAreaSelect(top, left, right, bottom, ctrl)
  })
  result.addListener('selectionMove', ({ left, top, startOffsetLeft, startOffsetTop }) => {
    moveSelection(startOffsetLeft, startOffsetTop, left, top)
  })
  return result
}

function createTextTool(preset: FontPreset) {
  const presentation = getCurrentPresentation()
  const result = new AreaDrawerTool()

  result.addListener('areaSelect', ({ top, left, right, bottom }) => {
    const textBlock = new TextSlideObject()
    textBlock.top = top
    textBlock.left = left
    textBlock.width = right - left
    textBlock.height = bottom - top
    textBlock.content = 'Test content'
    textBlock.style.fontFamily = preset.fontFamily
    textBlock.style.fontSize = preset.size
    textBlock.style.fontWeight = preset.weight
    textBlock.style.color = presentation.theme.defaults.mainText

    textBlock.zIndex = nextZIndex()
    addObjectOnSlide(textBlock)
    select(textBlock)
  })
  return result
}

function getButtonGroups(): IButtonGroup[] {
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
        tool: createPointer(),
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

  for (const preset of fontPresets) {
    const iconScale = (preset.size / maxFontSize) * 1.6

    const previewURL = preset.fontSource.replace('local://', 'font-preview://') + '::Aa'
    text.push({
      displayName: preset.name,
      icon: previewURL,
      iconScale,
      tool: createTextTool(preset),
    })
  }
  result.push({
    name: 'text',
    displayName: 'Text',
    items: text,
  })

  return result
}

const AddTab = () => {
  const buttonGroups: IButtonGroup[] = getButtonGroups()
  const [selectedGroupIndex, selectedItemIndex] = store.currentTab.addTabToolIndex

  const changeTabTool = function (groupIndex: number, itemIndex: number) {
    setTool([groupIndex, itemIndex], buttonGroups[groupIndex].items[itemIndex].tool)
  }

  useState(() => {
    changeTabTool(0, 0)
  })

  return (
    <div class="add-tab">
      {isAnySlideExists() ? (
        buttonGroups.map((group, groupIndex) => (
          <div class="add-tab__group">
            {group.displayName ? <h3 class="add-tab__group-title">{group.displayName}</h3> : null}
            {group.items.map((item, itemIndex) => (
              <div class="add-tab__group-button">
                <Button
                  text={item.displayName}
                  icon={item.icon}
                  iconScale={item.iconScale}
                  size="large"
                  blockLevel
                  pressed={selectedGroupIndex == groupIndex && selectedItemIndex == itemIndex}
                  onClick={() => changeTabTool(groupIndex, itemIndex)}
                />
              </div>
            ))}
          </div>
        ))
      ) : (
        <div class="add-tab__empty">Please, create slide</div>
      )}
    </div>
  )
}
export default AddTab
