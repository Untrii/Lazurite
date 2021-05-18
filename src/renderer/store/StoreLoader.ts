import store, { StoreType } from '@/store'
import io from '@/io'
import TabStateModel from 'common/models/store/TabStateModel'
import { PresentationFile } from 'common/models/store/AppStateModel'

export const startScreenPath = 'start://'

export async function loadRecent() {
  const recentPaths = await io.loadRecentPresentationPaths()
  let presentations: PresentationFile[] = []
  for (const path of recentPaths) {
    presentations.push({ path, presentation: await io.loadPresentation(path) })
  }
  presentations = presentations.sort(
    (b, a) => a.presentation.lastEditDate.getTime() - b.presentation.lastEditDate.getTime()
  )
  store.recentPresentations = presentations
}

export default class StoreLoader {
  async load(this: StoreType) {
    const openedPaths = await io.loadOpenedPresentationPaths()

    for (const path of openedPaths) {
      if (path.startsWith(startScreenPath)) this.tabs.push(TabStateModel.startScreen)
      else this.tabs.push(new TabStateModel(await io.loadPresentation(path), path))
    }
    if (openedPaths.length == 0) store.tabs.push(TabStateModel.startScreen)
    this.openTab(0)

    store.isLoaded = true

    await loadRecent()

    store.userBackgrounds = await io.loadUserBackgrounds()
    store.addFonts(...(await io.getFonts()))
  }
}
