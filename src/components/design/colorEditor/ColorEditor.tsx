import './ColorEditor.scss'
import { h } from 'preact'
import HorizontalNav from '@/components/controls/HorizontalNav'
import { useEffect, useRef, useState } from 'preact/hooks'
import PaletteGroup from './PaletteGroup'
import store from '@/store'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import backgrounds from '@/presets/backgrounds'
import ColorPicker from '@/components/dialogs/ColorPicker'
import Color from '@/models/common/Color'
import { addUserBackground, changeBackground, changeDefaultColor, deleteUserBackground } from '@/store/actions/design'
import DefaultsGroup from './DefaultsGroup'
import Slide from '@/components/constructor/Slide'

const ColorEditor = () => {
  const [currentTabIndex, changeTabIndex] = useState(0)
  const tabs: { displayName: string; name: BackgroundType }[] = [
    {
      displayName: 'Color',
      name: 'color',
    },
    {
      displayName: 'Gradient',
      name: 'gradient',
    },
    {
      displayName: 'Gradicolor',
      name: 'gradicolor',
    },
    {
      displayName: 'Pattern',
      name: 'pattern',
    },
    {
      displayName: 'Image',
      name: 'image',
    },
  ]

  const [isPopperShown, togglePopper] = useState(false)

  const onColorPicked = function (color: Color) {
    togglePopper(false)
    const bg = new Background()
    bg.value = color.toHex()
    bg.displayValue = color.toHex()
    bg.medianColor = color
    bg.type = 'color'
    addUserBackground(bg)
  }

  const addButtonPopper = <ColorPicker onCancel={() => togglePopper(false)} onColorPicked={onColorPicked} />

  const onAddButtonClick = function (event: MouseEvent) {
    if (tabs[currentTabIndex].name == 'color') togglePopper(!isPopperShown)
  }

  const onTabChange = function (index: number) {
    changeTabIndex(index)
    togglePopper(false)
  }

  const theme = store.currentTab.openedPresentation.theme
  const { background, defaults } = theme

  const presetTiles = [
    {
      title: 'Background',
      tiles: [
        {
          title: 'Main',
          value: background,
        },
        {
          title: 'Table row',
          value: defaults.tableRowBG,
          onChange: (color: Color) => changeDefaultColor('tableRowBG', color),
        },
        {
          title: 'Stripped table row',
          value: defaults.tableRowStrippedBG,
          onChange: (color: Color) => changeDefaultColor('tableRowStrippedBG', color),
        },
        {
          title: 'Table header',
          value: defaults.tableHeaderBG,
          onChange: (color: Color) => changeDefaultColor('tableHeaderBG', color),
        },
      ],
    },
    {
      title: 'Text',
      tiles: [
        {
          title: 'Main',
          value: defaults.mainText,
          onChange: (color: Color) => changeDefaultColor('mainText', color),
        },
        {
          title: 'Accent 1',
          value: defaults.accentText0,
          onChange: (color: Color) => changeDefaultColor('accentText0', color),
        },
        {
          title: 'Accent 2',
          value: defaults.accentText1,
          onChange: (color: Color) => changeDefaultColor('accentText1', color),
        },
      ],
    },
  ]

  const onUserBackgroundSelected = function (index: number) {
    changeBackground(store.userBackgrounds[tabs[currentTabIndex].name][index])
  }

  const onStandartBackgroundSelected = function (index: number) {
    changeBackground(backgrounds[tabs[currentTabIndex].name][index])
  }

  const onBackgroundDelete = function (tileIndex: number) {
    deleteUserBackground(tabs[currentTabIndex].name, tileIndex)
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const listener = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  })
  const navSize = 40
  const gapSize = 16
  const paletteGroupTileSize = 76
  const maxPaletteGroupWidth = windowWidth - (paletteGroupTileSize * 4 + gapSize * 5 + navSize + 1)
  const paletteGroupColumnCount = Math.floor(
    (Math.min((windowWidth - navSize) * 0.66, maxPaletteGroupWidth) - gapSize) / (gapSize + paletteGroupTileSize)
  )
  const paletteGroupWidth = gapSize + paletteGroupColumnCount * (paletteGroupTileSize + gapSize)
  const defaultsWidth = windowWidth - navSize - paletteGroupWidth - 1
  const defaultsTileSize = (defaultsWidth - gapSize * 5) / 4
  const previewWidth = defaultsWidth - 34
  const previewHeight = (previewWidth / 16) * 9
  const presentation = store.currentTab.openedPresentation
  const previewSlide = []

  return (
    <div class="color-editor">
      <div class="color-editor__palette" style={{ width: paletteGroupWidth }}>
        <nav class="color-editor__nav">
          <HorizontalNav
            prepend="Background:"
            items={tabs.map((item) => item.displayName)}
            onChange={onTabChange}
            selectedItemIndex={currentTabIndex}
          />
        </nav>
        <div class="color-editor__palettes">
          <PaletteGroup
            addButton
            onAddButtonClick={onAddButtonClick}
            addButtonPopper={isPopperShown ? addButtonPopper : null}
            title="User colors"
            tiles={store.userBackgrounds[tabs[currentTabIndex].name]}
            onSelected={onUserBackgroundSelected}
            deleteable={true}
            onDelete={onBackgroundDelete}
            width={paletteGroupWidth}
          />
          <div class="color-editor__palette-gap"></div>
          <PaletteGroup
            title="Standart colors"
            tiles={backgrounds[tabs[currentTabIndex].name]}
            onSelected={onStandartBackgroundSelected}
            width={paletteGroupWidth}
          />
          <div class="color-editor__palette-gap"></div>
        </div>
      </div>
      <div class="color-editor__separator"></div>
      <div class="color-editor__picked">
        <h2 class="color-editor__picked-title">Defaults</h2>
        {presetTiles.map((presetGroup) => (
          <DefaultsGroup title={presetGroup.title} tiles={presetGroup.tiles} tileSize={defaultsTileSize} />
        ))}
        <div class="color-editor__preview">
          <Slide width={previewWidth} height={previewHeight} presentation={presentation} slide={previewSlide} />
        </div>
      </div>
    </div>
  )
}
export default ColorEditor
