import { EditorWindowName } from '@/models/store/TabStateModel'
import store from '@/store'

export function openWindow(name: EditorWindowName) {
  store.currentTab.openedEditorWindow = name
}
