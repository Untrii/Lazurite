import './PositionEditor.scss'
import { h, Fragment } from 'preact'
import { raw as store } from '@/store'
import NumberInput from '@/components/controls/NumberInput'
import useEventBus from '@/store/useEventBus'
import EditorBase from './EditorBase'
import Button from '@/components/controls/Button'
import ImageSlideObject from '@/models/presentation/slideObjects/ImageSlideObject'

const PositionEditor = () => {
  const selection = store.currentTab.selection
  const item = selection.size == 1 ? selection.items[0] : null

  useEventBus(store, 'slideChange', store.getCurrentSlide())

  const inputs = [
    {
      name: 'Left:',
      prop: 'left',
    },
    {
      name: 'Top:',
      prop: 'top',
    },
    {
      name: 'Width:',
      prop: 'width',
      min: 1,
    },
    {
      name: 'Height:',
      prop: 'height',
      min: 1,
    },
  ]

  const onChange = function (prop: string, newValue: number) {
    const { left, top, right, bottom } = selection

    switch (prop) {
      case 'left':
        store.moveSelection(newValue, top)
        break
      case 'top':
        store.moveSelection(left, newValue)
        break
      case 'width':
        store.resizeSelection(top, left, bottom, left + newValue)
        break
      case 'height':
        store.resizeSelection(top, left, top + newValue, right)
        break
    }
  }

  return !selection.isEmpty ? (
    <EditorBase title="Size and position">
      <div class="position-editor__controls">
        {inputs.map((item) => (
          <NumberInput
            minValue={item.min}
            precision={1}
            value={selection[item.prop]}
            onChange={(value) => onChange(item.prop, value)}
            prepend={item.name}
            className="position-editor__control"
          />
        ))}
      </div>
      {item instanceof ImageSlideObject ? (
        <>
          <Button
            className="position-editor__button"
            blockLevel
            text="Restore proportions"
            centred
            colorName="blue-500"
            onClick={() => store.restoreImageProportions()}
          />
          <Button
            className="position-editor__button"
            blockLevel
            text="Restore size"
            centred
            colorName="blue-500"
            onClick={() => store.restoreImageSize()}
          />
        </>
      ) : null}
    </EditorBase>
  ) : (
    <></>
  )
}
export default PositionEditor
