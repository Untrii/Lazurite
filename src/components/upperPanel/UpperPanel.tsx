import './UpperPanel.scss'
import { h } from 'preact'
import LzButton from '../controls/LzButton'
import assets from '@/assets/index'

const UpperPanel = () => {
  return (
    <div class="upper-panel">
      <div class="upper-panel__workspace-selector workspace-selector">
        <div class="workspace-selector__sub">Workspace:</div>
        <div class="workspace-selector__option workspace-selector__option_selected">Constructor</div>
        <div class="workspace-selector__option">Design</div>
      </div>
      <div class="upper-panel__buttons">
        <LzButton
          className="upper-panel__button"
          icon={assets.play}
          text="Launch from this slide"
          colorName="blue-500"
        />
        <LzButton className="upper-panel__button" icon={assets.menu} colorName="blue-500" />
      </div>
    </div>
  )
}
export default UpperPanel
