import './TextEditor.scss'
import assets from '@/assets'
import CompactRadio from '@/components/controls/CompactRadio'
import DropdownSelector from '@/components/controls/DropdownSelector'
import NumberInput from '@/components/controls/NumberInput'
import Select from '@/components/controls/Select'
import TextSlideObject from '@/models/presentation/slideObjects/TextSlideObject'
import { raw as store } from '@/store'
import useEventBus from '@/store/useEventBus'
import { h, Fragment } from 'preact'
import EditorBase from './EditorBase'

const TextEditor = () => {
  useEventBus(store, 'slideChange', store.getCurrentSlide())
  const hAlignVariants = [
    {
      displayName: 'left',
      icon: assets.horizontalAlignLeft,
    },
    {
      displayName: 'center',
      icon: assets.horizontalAlignCenter,
    },
    {
      displayName: 'right',
      icon: assets.horizontalAlignRight,
    },
  ]
  const vAlignVariants = [
    {
      displayName: 'top',
      icon: assets.verticalAlignTop,
    },
    {
      displayName: 'center',
      icon: assets.verticalAlignCenter,
    },
    {
      displayName: 'bottom',
      icon: assets.verticalAlignBottom,
    },
  ]

  const hVariants = ['left', 'center', 'right']
  const vVariants = ['top', 'center', 'bottom']

  const currentObject = store.currentTab.selection.items[0] as TextSlideObject
  const horizontalAlign = currentObject.horizontalAlign
  const verticalAlign = currentObject.verticalAlign
  const fontSize = currentObject.style.fontSize

  const changeAlign = function (type: 'horizontal' | 'vertical', index: number, variants: string[]) {
    store.changeSelectedObjectProperty<TextSlideObject>((type + 'Align') as any, variants[index])
  }

  const changeFontSize = function (newSize: number) {
    const style = currentObject.style
    style.fontSize = newSize
    store.changeSelectedObjectProperty<TextSlideObject>('style', style)
  }

  const font = store.getFontBySource(currentObject.style.fontSource)
  const weightOptions = font.weights.map((item) => {
    return {
      value: item,
      displayName: item.toString(),
    }
  })

  const onWeightSelected = function (weight: number) {
    store.changeFontWeight(weight)
  }

  return (
    <>
      <EditorBase title="Alignment">
        <CompactRadio
          className="text-editor__input"
          prepend="Horizontal:"
          colorName="blue-500"
          variants={hAlignVariants}
          selectedVariantIndex={hVariants.indexOf(horizontalAlign)}
          onSelected={(index) => changeAlign('horizontal', index, hVariants)}
        ></CompactRadio>
        <CompactRadio
          className="text-editor__input"
          prepend="Vertical:"
          colorName="blue-500"
          variants={vAlignVariants}
          selectedVariantIndex={vVariants.indexOf(verticalAlign)}
          onSelected={(index) => changeAlign('vertical', index, vVariants)}
        ></CompactRadio>
      </EditorBase>
      <EditorBase title="Text style">
        <NumberInput
          className="text-editor__input"
          prepend="Font size:"
          precision={0.1}
          step={1}
          value={fontSize}
          minValue={4}
          maxValue={200}
          onChange={changeFontSize}
        />
        <Select
          className="text-editor__input"
          colorName="blue-500"
          prepend="Font weight:"
          value={currentObject.style.fontWeight}
          options={weightOptions}
          onSelect={onWeightSelected}
        ></Select>
      </EditorBase>
    </>
  )
}
export default TextEditor
