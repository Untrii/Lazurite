import { EditorWindowName } from '@/models/store/TabStateModel'
import store from '@/store'
import Presentation from '@/models/presentation/Presentation'
import io from '@/io'
import TabStateModel from '@/models/store/TabStateModel'
import { PresentationFile } from '@/models/store/AppStateModel'
import { startScreenPath, loadRecent } from '../load'

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

export async function createPresentation(name: string, author: string) {
  const [presentation, path] = await io.createNewPresentaiton(name, author)

  await openPresentation({ presentation, path })
}

export function openWindow(name: EditorWindowName) {
  store.currentTab.openedEditorWindow = name
}

export function openTab(index: number) {
  store.selectedTabIndex = index
}

export function replaceTab(prevIndex: number, newIndex: number) {
  const currentIndexValue = store.tabs.splice(prevIndex, 1)
  store.tabs.splice(newIndex, 0, currentIndexValue[0])
  store.selectedTabIndex = newIndex
  updateOpenedPresentaitons(store.tabs)
}

export async function openPresentation(file: PresentationFile) {
  store.currentTab.isStartScreen = false
  store.currentTab.openedEditorWindow = 'constructor'
  store.currentTab.openedPresentation = file.presentation
  store.currentTab.presentationPath = file.path

  await addNewRecentPresentaion(file.path)
  await loadRecent()
  await updateOpenedPresentaitons(store.tabs)
}

export async function openStartPage() {
  store.tabs.push(TabStateModel.startScreen)
  store.selectedTabIndex = store.tabs.length - 1
  await updateOpenedPresentaitons(store.tabs)
}

export async function closeTab(index: number) {
  if (index < 0 || index >= store.tabs.length) return
  if (store.selectedTabIndex >= index && store.selectedTabIndex > 0) store.selectedTabIndex--
  store.tabs.splice(index, 1)
  if (store.tabs.length == 0) store.tabs.push(TabStateModel.startScreen)
  await updateOpenedPresentaitons(store.tabs)
}
