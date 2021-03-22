import './FontCard.scss'
import { h } from 'preact'
import Button from '@/components/controls/Button'

interface IFontCardProps {
  preview: string
  variants: string[]
  weights: number[]
  onSelectForCurrent: () => void
  onSelectForAll: () => void
}

const FontCard = ({ preview, variants, weights, onSelectForCurrent, onSelectForAll }: IFontCardProps) => {
  return (
    <div class="font-card control-bg_blue-400">
      <img src={preview} alt="" />
      <div class="font-card__bottom">
        <div class="font-card__description">
          <ul class="font-card__list">
            <li class="font-card__list-caption">Variants:</li>
            {variants.map((item) => (
              <li class="font-card__list-item">{item}</li>
            ))}
          </ul>
          <ul class="font-card__list">
            <li class="font-card__list-caption">Weights:</li>
            {weights.map((item) => (
              <li class="font-card__list-item">{item}</li>
            ))}
          </ul>
        </div>
        <div class="font-card__buttons">
          <Button text="Select for current preset" className="font-card__button" colorName="blue-600" />
          <Button text="Select for all presets" className="font-card__button" colorName="blue-600" />
        </div>
      </div>
    </div>
  )
}
export default FontCard
