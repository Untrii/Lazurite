import io from '@/io'
import store from '@/store'

export default class UtilActions {
  async saveCurrentPresentation() {
    await io.savePresentation(store.currentTab.presentationPath, store.currentTab.openedPresentation)
  }
}
