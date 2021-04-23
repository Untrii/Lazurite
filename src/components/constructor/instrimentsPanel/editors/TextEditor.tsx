//import './TextEditor.scss'
import assets from '@/assets'
import CompactRadio from '@/components/controls/CompactRadio'
import DropdownSelector from '@/components/controls/DropdownSelector'
import NumberInput from '@/components/controls/NumberInput'
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

  return (
    <>
      <EditorBase title="Alignment">
        <div style="margin-bottom: 8px">
          <CompactRadio
            prepend="Horizontal:"
            colorName="blue-500"
            variants={hAlignVariants}
            selectedVariantIndex={hVariants.indexOf(horizontalAlign)}
            onSelected={(index) => changeAlign('horizontal', index, hVariants)}
          ></CompactRadio>
        </div>
        <CompactRadio
          prepend="Vertical:"
          colorName="blue-500"
          variants={vAlignVariants}
          selectedVariantIndex={vVariants.indexOf(verticalAlign)}
          onSelected={(index) => changeAlign('vertical', index, vVariants)}
        ></CompactRadio>
      </EditorBase>
      <EditorBase title="Text style">
        <NumberInput
          prepend="Font size:"
          precision={0.1}
          step={1}
          value={fontSize}
          minValue={4}
          maxValue={200}
          onChange={changeFontSize}
        />
      </EditorBase>
    </>
  )
}
export default TextEditor
