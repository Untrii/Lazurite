import Presentation from '../presentation/Presentation'
import TabStateModel from './TabStateModel'

export default class AppStateModel {
  tabs = [new TabStateModel()]

  selectedTabIndex = 0

  panelSizes = {
    preview: 200,
    instruments: 240,
  }

  get currentTab() {
    return this.tabs[this.selectedTabIndex]
  }
}
