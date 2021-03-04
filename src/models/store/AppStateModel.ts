import Presentation from '../presentation/Presentation'
import Background from '../presentation/theme/Background'
import TabStateModel from './TabStateModel'

export default class AppStateModel {
  isLoaded = false

  tabs: TabStateModel[] = []
  recentPresentations: Presentation[] = []
  userBackgrounds: Background[] = []

  selectedTabIndex = 0

  panelSizes = {
    preview: 200,
    instruments: 240,
  }

  get currentTab() {
    return this.tabs[this.selectedTabIndex]
  }
}
