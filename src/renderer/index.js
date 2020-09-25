import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import CommonRepository from '@/repositories/CommonRepository'
import MainMenuService from '@/services/MainMenuService'
import LzButton from '@/components/designSystem/LzButton'
import LzGroupCaption from '@/components/designSystem/LzGroupCaption'
import LzPrepend from '@/components/designSystem/LzPrepend'
import LzNumberInput from '@/components/designSystem/LzNumberInput'
import LzRangeInput from '@/components/designSystem/LzRangeInput'
import LzColorInput from '@/components/designSystem/LzColorInput'
import LzPressSwitch from '@/components/designSystem/LzPressSwitch'
import LzSwitch from '@/components/designSystem/LzSwitch'
import LzDesignSystem from '@/components/designSystem'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'

async function main() {
  let presentationPath = await fs.readFile('testProjectPath.txt', {
    encoding: 'utf-8',
  })
  Vue.use(BootstrapVue)
  for (const element in LzDesignSystem) {
    Vue.component(element, LzDesignSystem[element])
  }

  await CommonRepository.load()
  if (!existsSync(presentationPath)) {
    await new MainMenuService().createPresentation(presentationPath)
  }
  window.__bench = function() {
    let startTime = new Date()
    for (let i = 0; i < 1000; i++) __repoInstance.onChange()
    console.log(
      '1000 updates has completed in ' + (new Date() - startTime) + 'ms'
    )
  }
  new MainMenuService().openPresentation(presentationPath)
  console.log('instance loaded')

  new Vue({
    el: '#app',
    render(h) {
      return h(App)
    },
  })
}
main()
