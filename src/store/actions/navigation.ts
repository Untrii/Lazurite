import { DesignTab, EditorWindowName } from '@/models/store/TabStateModel'
import store, { StoreType } from '@/store'
import io from '@/io'
import TabStateModel from '@/models/store/TabStateModel'
import { PresentationFile } from '@/models/store/AppStateModel'
import { startScreenPath, loadRecent } from '../StoreLoader'
import { setContext } from '@/dataLoader'

async function addNewRecentPresentaion(path: string) {
  const presentations = await io.loadRecentPresentationPaths()
  if (!presentations.includes(path)) {
    presentations.push(path)
    await io.saveRecentPresentationPaths(presentations)
  }
}

async function updateOpenedPresentaitons(tabs: TabStateModel[]) {
  const paths = tabs.map(({ presentationPath }) => (presentationPath ? presentationPath : startScreenPath))
  await io.saveOpenedPresentationPaths(paths)
}

export default class NavigationActions {
  async createPresentation(this: StoreType, name: string, author: string) {
    const [presentation, path] = await io.createNewPresentaiton(name, author)

    await this.openPresentation({ presentation, path })
  }

  openWindow(this: StoreType, name: EditorWindowName) {
    this.currentTab.openedEditorWindow = name
  }

  openTab(this: StoreType, index: number) {
    this.selectedTabIndex = index
    setContext('proj', this.tabs[index].presentationPath.replace('local://', '').replaceAll('\\', '/'))
  }

  replaceTab(this: StoreType, prevIndex: number, newIndex: number) {
    const currentIndexValue = this.tabs.splice(prevIndex, 1)
    this.tabs.splice(newIndex, 0, currentIndexValue[0])
    this.selectedTabIndex = newIndex
    updateOpenedPresentaitons(this.tabs)
  }

  async openPresentation(this: StoreType, file: PresentationFile) {
    const currentTab = this.currentTab
    currentTab.isStartScreen = false
    currentTab.openedEditorWindow = 'constructor'
    currentTab.openedPresentation = file.presentation
    currentTab.presentationPath = file.path

    await addNewRecentPresentaion(file.path)
    await loadRecent()
    await updateOpenedPresentaitons(this.tabs)
  }

  async openStartPage(this: StoreType) {
    this.tabs.push(TabStateModel.startScreen)
    this.selectedTabIndex = this.tabs.length - 1
    await updateOpenedPresentaitons(this.tabs)
  }

  async closeTab(this: StoreType, index: number) {
    if (index < 0 || index >= this.tabs.length) return
    if (this.selectedTabIndex >= index && this.selectedTabIndex > 0) this.selectedTabIndex--
    this.tabs.splice(index, 1)
    if (this.tabs.length == 0) this.tabs.push(TabStateModel.startScreen)
    await updateOpenedPresentaitons(this.tabs)
  }

  changeDesignTab(this: StoreType, tab: DesignTab) {
    this.currentTab.openededDesignTab = tab
  }
}
