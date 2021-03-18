import Background, { BackgroundType } from '@/models/presentation/theme/Background'
import store from '@/store'
import io from '@/io'
import Color from '@/models/common/Color'
import { saveCurrentPresentation } from './util'

type DefaultsName = keyof typeof store.currentTab.openedPresentation.theme.defaults

const getCurrentTheme = function () {
  return store.currentTab.openedPresentation.theme
}

export function addUserBackground(bg: Background) {
  store.userBackgrounds[bg.type] = store.userBackgrounds[bg.type].filter((item) => item.value != bg.value)
  store.userBackgrounds[bg.type].push(bg)
  io.saveUserBackgrounds(store.userBackgrounds)
}

export function deleteUserBackground(type: BackgroundType, index: number) {
  if (index >= 0 && index < store.userBackgrounds[type].length) {
    store.userBackgrounds[type].splice(index, 1)
    io.saveUserBackgrounds(store.userBackgrounds)
  }
}

export function changeDefaultColor(defaultName: DefaultsName, color: Color) {
  const theme = getCurrentTheme()
  theme.defaults[defaultName] = color
  saveCurrentPresentation()
}

export function changeBackground(bg: Background) {
  const theme = getCurrentTheme()
  theme.background = bg
  saveCurrentPresentation()
}

window['addUserBackground'] = addUserBackground
