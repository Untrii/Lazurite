import { EditorWindowName } from '@/models/store/TabStateModel'
import store from '@/store'

export function openWindow(name: EditorWindowName) {
  store.currentTab.openedEditorWindow = name
}

export function openTab(index: number) {
  store.selectedTabIndex = index
}

export function replaceTab(prevIndex: number, newIndex: number) {
  let currentIndexValue = store.tabs.splice(prevIndex, 1)
  store.tabs.splice(newIndex, 0, currentIndexValue[0])
  store.selectedTabIndex = newIndex
}
