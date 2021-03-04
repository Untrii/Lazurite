import store from '@/store'
import ioManager from '@/io'
import TabStateModel from '@/models/store/TabStateModel'
import Presentation from '@/models/presentation/Presentation'

export default async function load() {
  const openedPaths = await ioManager.loadOpenedPresentationPaths()

  for (const path of openedPaths) {
    if (path.startsWith('start-screen://')) store.tabs.push(TabStateModel.startScreen)
    else store.tabs.push(new TabStateModel(await ioManager.loadPresentation(path)))
  }
  if (openedPaths.length == 0) store.tabs.push(TabStateModel.startScreen)

  store.isLoaded = true

  const recentPaths = await ioManager.loadRecentPresentationPaths()
  const presentations: Presentation[] = []
  for (const path of recentPaths) {
    presentations.push(await ioManager.loadPresentation(path))
  }
  presentations.sort((a, b) => a.lastEditDate.getTime() - b.lastEditDate.getTime())
  store.recentPresentations = presentations

  store.userBackgrounds = await ioManager.loadUserBackgrounds()
}
