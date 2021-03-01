import './InstrumentsPanel.scss'
import { h } from 'preact'
import VerticalNav from '@/components/controls/VerticalNav'

const InstrumentsPanel = () => {
  return (
    <div class="instruments-panel">
      <div class="instruments-panel__content"></div>
      <VerticalNav items={[]} />
    </div>
  )
}
export default InstrumentsPanel
