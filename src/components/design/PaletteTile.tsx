import './PaletteTile.scss'
import { h } from 'preact'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'

interface IPaletteTileProps {
  height: number
  width: number
  value: { type: BackgroundType; displayValue: string }
}

const PaletteTile = (props: IPaletteTileProps) => {
  const getBackgroundCss = function (bg: { type: BackgroundType; displayValue: string }) {
    const { displayValue } = bg

    switch (bg.type) {
      case 'color':
        return { backgroundColor: displayValue }
      case 'image':
      case 'pattern':
        return { backgroundImage: `url(${displayValue})`, backgroundSize: 'cover' }
      default:
        throw new Error('gradient not implemented')
    }
  }

  return (
    <div
      class="palette-tile"
      style={{
        height: props.height + 'px',
        width: props.width + 'px',
        ...getBackgroundCss(props.value),
      }}
    ></div>
  )
}
export default PaletteTile
