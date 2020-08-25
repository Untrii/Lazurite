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

let presentationPath = 'D:\\Программирование 2020\\present.js\\testproj_v3\\project.json'

async function main() {
  Vue.use(BootstrapVue)
  Vue.component('LzButton', LzButton)
  Vue.component('LzGroupCaption', LzGroupCaption)
  Vue.component('LzNumberInput', LzNumberInput)
  Vue.component('LzRangeInput', LzRangeInput)
  Vue.component('LzColorInput', LzColorInput)
  Vue.component('LzPrepend', LzPrepend)

  await CommonRepository.load()
  //await new MainMenuService().createPresentation(presentationPath)
  window.__bench = function() {
    let startTime = new Date()
    for (let i = 0; i < 1000; i++) __repoInstance.onChange()
    console.log('1000 updates has completed in ' + (new Date() - startTime) + 'ms')
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
