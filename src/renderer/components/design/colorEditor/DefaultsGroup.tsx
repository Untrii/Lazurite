import './DefaultsGroup.scss'

import { h } from 'preact'

import Color from 'common/models/common/Color'
import Background from 'common/models/presentation/theme/Background'

import PaletteTile from './PaletteTile'

interface ITile {
  title: string
  value: Background | Color
  onChange?: (color: Color) => void
}

interface IDefaultsGroupProps {
  title: string
  tiles: ITile[]
  tileSize: number
}

const DefaultsGroup = ({ title, tiles, tileSize }: IDefaultsGroupProps) => {
  return (
    <div class="defaults-group">
      <h3 class="defaults-group__title">{title}</h3>
      <div class="defaults-group__tiles">
        {tiles.map((tile) => (
          <div class="defaults-group__tile">
            <PaletteTile value={tile.value} height={tileSize} width={tileSize} />
            <div class="defaults-group__tile-caption">{tile.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default DefaultsGroup
