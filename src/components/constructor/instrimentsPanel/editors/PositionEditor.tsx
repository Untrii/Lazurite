import './PositionEditor.scss'
import { h, Fragment } from 'preact'
import { raw as store } from '@/store'
import NumberInput from '@/components/controls/NumberInput'
import { useEffect } from 'preact/hooks'
import useForceUpdate from '@/util/hooks/useForceUpdate'

const PositionEditor = () => {
  const forceUpdate = useForceUpdate()
  const selection = store.currentTab.selection
  const item = selection.size == 1 ? selection.items[0] : null

  useEffect(() => {
    const listener = () => forceUpdate()
    const slide = store.getCurrentSlide()
    store.addSlideChangeListener(slide, listener)
    return () => store.removeSlideChangeListener(slide, listener)
  })

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
        store.moveSelection(0, 0, newValue, top)
        break
      case 'top':
        store.moveSelection(0, 0, left, newValue)
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
    <div class="position-editor">
      <h3>Position and size</h3>
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
    </div>
  ) : (
    <></>
  )
}
export default PositionEditor
