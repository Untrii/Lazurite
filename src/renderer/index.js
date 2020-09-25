import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import CommonRepository from '@/repositories/CommonRepository'
import MainMenuService from '@/services/MainMenuService'
import LzDesignSystem from '@/components/designSystem'

let presentationPath =
  'D:\\Программирование 2020\\present.js\\testproj_v3\\project.json'

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
