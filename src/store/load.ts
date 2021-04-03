import store from '@/store'
import ioManager from '@/io'
import TabStateModel from '@/models/store/TabStateModel'
import { PresentationFile } from '@/models/store/AppStateModel'
import { openTab } from './actions/navigation'

export const startScreenPath = 'start://'

export async function loadRecent() {
  const recentPaths = await ioManager.loadRecentPresentationPaths()
  let presentations: PresentationFile[] = []
  for (const path of recentPaths) {
    presentations.push({ path, presentation: await ioManager.loadPresentation(path) })
  }
  presentations = presentations.sort(
    (b, a) => a.presentation.lastEditDate.getTime() - b.presentation.lastEditDate.getTime()
  )
  store.recentPresentations = presentations
}

export default async function load() {
  const openedPaths = await ioManager.loadOpenedPresentationPaths()

  for (const path of openedPaths) {
    if (path.startsWith(startScreenPath)) store.tabs.push(TabStateModel.startScreen)
    else store.tabs.push(new TabStateModel(await ioManager.loadPresentation(path), path))
  }
  if (openedPaths.length == 0) store.tabs.push(TabStateModel.startScreen)
  openTab(0)

  store.isLoaded = true

  await loadRecent()

  store.userBackgrounds = await ioManager.loadUserBackgrounds()
}
