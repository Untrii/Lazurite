import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import { Instance } from '@/repositories/CommonRepository'
import MainMenuService from '@/services/MainMenuService'

let presentationPath =
  'D:\\Программирование 2020\\present.js\\testproj_v3\\project.json'

async function main() {
  Vue.use(BootstrapVue)
  await Instance.load()
  //await new MainMenuService().createPresentation(presentationPath)
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
