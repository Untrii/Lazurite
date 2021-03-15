import './PaletteGroup.scss'
import { BackgroundType } from '@/models/presentation/theme/Background'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import PaletteTile from './PaletteTile'

interface IPaletteGroupProps {
  title: string
  tiles: { type: BackgroundType; displayValue: string }[]
  onSelected?: () => void
}

const PaletteGroup = ({ title, tiles }: IPaletteGroupProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const listener = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  })

  const navSize = 40
  const gapSize = 16
  const tileSize = 72
  const currentBlockSize = ((windowWidth - navSize) / 3) * 2 - gapSize
  const columnCount = Math.floor(currentBlockSize / (tileSize + gapSize))
  const rowCount = Math.ceil(tiles.length / columnCount)

  const gridStyle = {
    gridTemplateRows: `${tileSize}px repeat(${rowCount - 1},${gapSize}px ${tileSize}px)`,
    gridTemplateColumns: `${tileSize}px repeat(${columnCount - 1}, ${gapSize}px ${tileSize}px)`,
  }

  return (
    <div class="palette-group">
      <h2 class="palette-group__title">{title}</h2>
      <div class="palette-group__grid" style={gridStyle}>
        {tiles.map((item, index) => (
          <div
            class="palette-group__tile"
            style={{ gridColumn: (index % columnCount) * 2 + 1, gridRow: Math.floor(index / columnCount) * 2 + 1 }}
          >
            <PaletteTile value={item} height={tileSize} width={tileSize} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default PaletteGroup
