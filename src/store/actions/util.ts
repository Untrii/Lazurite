import io from '@/io'
import store from '@/store'

export function saveCurrentPresentation() {
  io.savePresentation(store.currentTab.presentationPath, store.currentTab.openedPresentation)
}
