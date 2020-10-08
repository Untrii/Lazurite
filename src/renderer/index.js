import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'
import ReactiveFileHandle from '@/repositories/fileSystems/ReactiveFileHandle'

import BackgroundRepository from '@/repositories/BackgroundsRepository'
import HistoryRepository from '@/repositories/HistoryRepository'
import PalettesRepository from '@/repositories/PalettesRepository'
import PresentationRepository from '@/repositories/PresentationRepository'
import RuntimeRepository from '@/repositories/RuntimeRepository'

import LzDesignSystem from '@/components/designSystem'
import App from './App.vue'

async function loadFiles(presentationPath) {
  let a = RuntimeRepository.Instance
  await Promise.all([
    BackgroundRepository.init('data/bg.json'),
    HistoryRepository.init(presentationPath + '.history'),
    PalettesRepository.init('data/palettes.json'),
    PresentationRepository.init(presentationPath)
  ])
}

async function main() {
  console.log('entry')
  let presentationPath = await fs.readFile('testProjectPath.txt', {
    encoding: 'utf-8'
  })
  await loadFiles(presentationPath)

  let test = PalettesRepository.Instance.data

  Vue.use(BootstrapVue)
  for (const element in LzDesignSystem) {
    Vue.component(element, LzDesignSystem[element])
  }

  if (!existsSync(presentationPath)) {
    await new MainMenuService().createPresentation(presentationPath)
  }

  window.benchmarks = {
    windowDataUpdate() {
      let startTime = new Date()
      for (let i = 0; i < 1000; i++) __repoInstance.onChange()
      console.log('1000 updates has completed in ' + (new Date() - startTime) + 'ms')
    },
    proxyReactivity() {
      let startTime = new Date()
      let a
      for (let i = 0; i < 1000000; i++) a = reactTest.syncronizedObject.a.a.a
      console.log('1 000 000 get operation completed in ' + (new Date() - startTime) + 'ms')
      startTime = new Date()
      for (let i = 0; i < 1000000; i++) a = reactTest.syncronizedObject.a.a.a.first = i
      console.log('1 000 000 set operation completed in ' + (new Date() - startTime) + 'ms')
    }
  }

  //import  from '@/components/designSystem'
  new Vue({
    el: '#app',
    render(h) {
      return h(App)
    }
  })
}
main()
