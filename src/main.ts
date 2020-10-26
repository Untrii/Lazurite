import { createApp } from 'vue'
//import BootstrapVue from 'bootstrap-vue'
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
import DesignStore from './services/store/DesignStore'

function loadFiles(presentationPath: string) {
  const a = RuntimeRepository.Instance
  BackgroundRepository.init('data/bg.json')
  HistoryRepository.init(presentationPath + '.history')
  PalettesRepository.init('data/palettes.json')
  PresentationRepository.init(presentationPath)
}

async function main() {
  console.log('entry')
  try {
    const presentationPath = await fs.readFile('testProjectPath.txt')
    loadFiles(presentationPath.toString())
    const store = new DesignStore()
    await store.getFontList()
  } catch {}

  const app = createApp(App)

  for (const element in LzDesignSystem) {
    app.component(element, LzDesignSystem[element])
  }
  app.mount('#mount')
}
main()
