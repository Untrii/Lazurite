import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import CommonRepository from '@/repositories/CommonRepository'
import MainMenuService from '@/services/MainMenuService'
import LzDesignSystem from '@/components/designSystem'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'
import ReactiveFileHandle from '@/repositories/fileSystems/ReactiveFileHandle'

async function main() {
  let reactTest = await ReactiveFileHandle.create('C:/present.js/hui.json')
  window.reactTest = reactTest

  let presentationPath = await fs.readFile('testProjectPath.txt', {
    encoding: 'utf-8'
  })
  Vue.use(BootstrapVue)
  for (const element in LzDesignSystem) {
    Vue.component(element, LzDesignSystem[element])
  }

  await CommonRepository.load()
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

  new MainMenuService().openPresentation(presentationPath)
  console.log('instance loaded')

  new Vue({
    el: '#app',
    render(h) {
      return h(App)
    }
  })
}
main()
