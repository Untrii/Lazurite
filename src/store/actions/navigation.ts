import { EditorWindowName } from '@/models/store/TabStateModel'
import store from '@/store'
import Presentation from '@/models/presentation/Presentation'
import io from '@/io'
import TabStateModel from '@/models/store/TabStateModel'

async function addNewRecentPresentaion(path: string) {
  const presentations = await io.loadRecentPresentationPaths()
  if (!presentations.includes(path)) {
    presentations.push(path)
    await io.saveRecentPresentationPaths(presentations)
  }
}

async function updateOpenedPresentaitons(tabs: TabStateModel[]) {
  const paths = tabs.map((item) => item.presentationPath).filter((item) => item)
  await io.saveOpenedPresentationPaths(paths)
}

export async function createPresentation(name: string, author: string) {
  const [presentation, path] = await io.createNewPresentaiton(name, author)

  store.currentTab.isStartScreen = false
  store.currentTab.openedEditorWindow = 'constructor'
  store.currentTab.openedPresentation = presentation
  store.currentTab.presentationPath = path

  await addNewRecentPresentaion(path)
  await updateOpenedPresentaitons(store.tabs)
}

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
  updateOpenedPresentaitons(store.tabs)
}
