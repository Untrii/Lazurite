import './PaletteGroup.scss'
import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import { h, JSX } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import PaletteTile from './PaletteTile'
import assets from '@/assets'
import * as design from '@/store/actions/design'

interface IPaletteGroupProps {
  title: string
  tiles: { type: BackgroundType; displayValue: string }[]
  addButton?: boolean
  onSelected?: (index: number) => void
  onAddButtonClick?: (event: MouseEvent) => void
  addButtonPopper?: JSX.Element
}

const PaletteGroup = ({
  title,
  tiles,
  addButton,
  onSelected,
  onAddButtonClick,
  addButtonPopper,
}: IPaletteGroupProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const listener = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  })

  const navSize = 40
  const gapSize = 16
  const tileSize = 76
  const currentBlockSize = ((windowWidth - navSize) / 3) * 2 - gapSize
  const columnCount = Math.floor(currentBlockSize / (tileSize + gapSize))
  const rowCount = Math.ceil((tiles.length + (addButton ? 1 : 0)) / columnCount)

  const gridStyle = {
    gridTemplateRows: rowCount > 1 ? `${tileSize}px repeat(${rowCount - 1},${gapSize}px ${tileSize}px)` : '',
    gridTemplateColumns: `${tileSize}px repeat(${columnCount - 1}, ${gapSize}px ${tileSize}px)`,
  }

  const calculateStyle = function (tileIndex: number) {
    return { gridColumn: (tileIndex % columnCount) * 2 + 1, gridRow: Math.floor(tileIndex / columnCount) * 2 + 1 }
  }

  let popperStyles = {}
  if (rowCount > 4) popperStyles['bottom'] = '0px'
  else popperStyles['top'] = '-76px'

  if (columnCount - (tiles.length % columnCount) <= 2) popperStyles['right'] = '16px'
  else popperStyles['left'] = '92px'

  return (
    <div class="palette-group">
      <h2 class="palette-group__title">{title}</h2>
      <div class="palette-group__grid" style={gridStyle}>
        {tiles.map((item, index) => (
          <div class="palette-group__tile" style={calculateStyle(index)}>
            <PaletteTile
              value={item}
              height={tileSize}
              width={tileSize}
              onClick={() => {
                onSelected?.(index)
              }}
            />
          </div>
        ))}
        {addButton ? (
          <div class="palette-group__tile" style={{ ...calculateStyle(tiles.length) }}>
            <div
              class="palette-group__add-button"
              style={{ height: tileSize + 'px', width: tileSize + 'px' }}
              onClick={(event) => {
                onAddButtonClick?.(event)
              }}
            >
              <img src={assets.add} alt="" />
            </div>
            <div class="palette-group__popper">
              <div class="palette-group__popper-content" style={popperStyles}>
                {addButtonPopper}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default PaletteGroup
