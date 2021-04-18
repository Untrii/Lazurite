import './ColorEditor.scss'

import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import backgrounds from '@/presets/backgrounds'
import store from '@/store'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import Color from '@/models/common/Color'
import useDelayedUnmount from '@/util/hooks/useDelayedUnmount'

import HorizontalNav from '@/components/controls/HorizontalNav'
import ColorPicker from '@/components/dialogs/ColorPicker'
import Slide from '@/components/constructor/Slide'
import PaletteGroup from './PaletteGroup'
import DefaultsGroup from './DefaultsGroup'
import getMedianColorSync from '@/util/getMedianColorSync'
import FilePicker from '@/components/dialogs/FilePicker'

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

const ColorEditor = () => {
  const presentation = store.currentTab.openedPresentation
  const theme = presentation.theme
  const { background, defaults } = theme

  const [currentTabIndex, changeTabIndex] = useState(tabs.findIndex((item) => item.name == background.type))
  const [isPopperShown, setIsPopperShown] = useState(false)
  const [lastChangeTime, setLastChangeTime] = useState(new Date(0))
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const listener = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  })

  const togglePopper = function (val: boolean) {
    if (isPopperShown != val)
      if (new Date().getTime() - lastChangeTime.getTime() > 500) {
        setIsPopperShown(val)
        setLastChangeTime(new Date())
      }
  }

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
  const previewSlide = []

  const renderNav = function () {
    const onTabChange = function (index: number) {
      changeTabIndex(index)
      togglePopper(false)
    }

    return (
      <nav class="color-editor__nav">
        <HorizontalNav
          prepend="Background:"
          items={tabs.map((item) => item.displayName)}
          onChange={onTabChange}
          selectedItemIndex={currentTabIndex}
        />
      </nav>
    )
  }

  const renderPalettes = function () {
    const tabName = tabs[currentTabIndex].name

    const onAddButtonClick = function (event: MouseEvent) {
      togglePopper(!isPopperShown)
    }

    const onAddButtonDragEnter = function () {
      togglePopper(true)
    }

    const onColorPicked = function (color: Color) {
      togglePopper(false)
      const bg = new Background()
      bg.value = color.toHex()
      bg.displayValue = color.toHex()
      bg.medianColor = color
      bg.type = 'color'
      store.addUserBackground(bg)
    }

    const onGradientPicked = function (gradient: string) {
      togglePopper(false)
      const bg = new Background()
      bg.value = gradient
      bg.displayValue = gradient
      bg.medianColor = getMedianColorSync('gradient', gradient)
      bg.type = 'gradient'
      store.addUserBackground(bg)
    }

    const onFilesPicked = function (files: ArrayBuffer[]) {
      togglePopper(false)
      if (tabName == 'image') store.addImages(files)
      if (tabName == 'pattern') store.addPatterns(files)
    }

    let popperContent = null
    switch (tabName) {
      case 'color':
      case 'gradient':
        popperContent = (
          <ColorPicker
            onCancel={() => togglePopper(false)}
            onColorPicked={onColorPicked}
            onGradientPicked={onGradientPicked}
            isHiding={!isPopperShown}
            mode={tabs[currentTabIndex].name as any}
          />
        )
        break
      case 'image':
      case 'pattern':
        popperContent = (
          <FilePicker isHiding={!isPopperShown} onSelected={onFilesPicked} accept={['image/png', 'image/jpeg']} />
        )
        break
    }

    const addButtonPopper = useDelayedUnmount(popperContent, isPopperShown, 500)

    const onUserBackgroundSelected = function (index: number) {
      store.changeBackground(store.userBackgrounds[tabs[currentTabIndex].name][index])
    }

    const onBackgroundDelete = function (tileIndex: number) {
      store.deleteUserBackground(tabs[currentTabIndex].name, tileIndex)
    }

    const onStandartBackgroundSelected = function (index: number) {
      store.changeBackground(backgrounds[tabs[currentTabIndex].name][index])
    }

    return (
      <div class="color-editor__palettes">
        <PaletteGroup
          addButton
          onAddButtonClick={onAddButtonClick}
          onAddButtonDragEnter={onAddButtonDragEnter}
          addButtonPopper={addButtonPopper}
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
    )
  }

  const renderPicked = function () {
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
            onChange: (color: Color) => store.changeDefaultColor('tableRowBG', color),
          },
          {
            title: 'Stripped table row',
            value: defaults.tableRowStrippedBG,
            onChange: (color: Color) => store.changeDefaultColor('tableRowStrippedBG', color),
          },
          {
            title: 'Table header',
            value: defaults.tableHeaderBG,
            onChange: (color: Color) => store.changeDefaultColor('tableHeaderBG', color),
          },
        ],
      },
      {
        title: 'Text',
        tiles: [
          {
            title: 'Main',
            value: defaults.mainText,
            onChange: (color: Color) => store.changeDefaultColor('mainText', color),
          },
          {
            title: 'Accent 1',
            value: defaults.accentText0,
            onChange: (color: Color) => store.changeDefaultColor('accentText0', color),
          },
          {
            title: 'Accent 2',
            value: defaults.accentText1,
            onChange: (color: Color) => store.changeDefaultColor('accentText1', color),
          },
        ],
      },
    ]

    return (
      <div class="color-editor__picked">
        <h2 class="color-editor__picked-title">Defaults</h2>
        {presetTiles.map((presetGroup) => (
          <DefaultsGroup title={presetGroup.title} tiles={presetGroup.tiles} tileSize={defaultsTileSize} />
        ))}
        <div class="color-editor__preview">
          <Slide width={previewWidth} height={previewHeight} presentation={presentation} slide={previewSlide} />
        </div>
      </div>
    )
  }

  return (
    <div class="color-editor">
      <div class="color-editor__palette" style={{ width: paletteGroupWidth }}>
        {renderNav()}
        {renderPalettes()}
      </div>
      <div class="color-editor__separator"></div>
      {renderPicked()}
    </div>
  )
}
export default ColorEditor
