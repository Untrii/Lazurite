import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import CommonRepository from '@/repositories/CommonRepository'
import MainMenuService from '@/services/MainMenuService'

let presentationPath = 'D:\\Программирование 2020\\present.js\\testproj_v3\\project.json'

async function main() {
  Vue.use(BootstrapVue)
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
