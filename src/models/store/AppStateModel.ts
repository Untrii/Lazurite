import Presentation from '../presentation/Presentation'
import Background from '../presentation/theme/Background'
import TabStateModel from './TabStateModel'

export type PresentationFile = { path: string; presentation: Presentation }

export default class AppStateModel {
  isLoaded = false

  tabs: TabStateModel[] = []
  recentPresentations: PresentationFile[] = []
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
