import './PaletteTile.scss'
import { h } from 'preact'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import Color from '@/models/common/Color'
import assets from '@/assets'
import { useEffect, useState } from 'preact/hooks'

interface IPaletteTileProps {
  height: number
  width: number
  value: { type: BackgroundType; displayValue: string } | Color
  onClick?: () => void
  deleteable?: boolean
  onDelete?: () => void
}

const PaletteTile = (props: IPaletteTileProps) => {
  const getBackgroundCss = function (bg: { type: BackgroundType; displayValue: string } | Color) {
    if (bg instanceof Color) {
      return { backgroundColor: bg.toCssColor() }
    }
    const { displayValue } = bg

    switch (bg.type) {
      case 'color':
        return { backgroundColor: displayValue }
      case 'image':
      case 'pattern':
        return { backgroundImage: `url(${displayValue})`, backgroundSize: 'cover' }
      case 'gradient':
        return { background: `linear-gradient(${displayValue})` }
      default:
        throw new Error('gradient not implemented')
    }
  }

  const [animationActive, activateAnimation] = useState(false)
  useEffect(() => {
    if (!animationActive)
      setTimeout(() => {
        activateAnimation(true)
      }, 200)
  })

  return (
    <div
      class="palette-tile"
      onClick={() => props?.onClick?.()}
      style={{
        height: props.height + 'px',
        width: props.width + 'px',
        ...getBackgroundCss(props.value),
      }}
    >
      {props.deleteable ? (
        <div
          class={'palette-tile__delete' + (animationActive ? '' : ' palette-tile__delete_hidden')}
          onClick={(event) => {
            event.stopPropagation()
            props.onDelete?.()
          }}
        >
          <img src={assets.delete} alt="" />
        </div>
      ) : null}
    </div>
  )
}
export default PaletteTile
