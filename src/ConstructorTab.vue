<template>
  <div>
    <div class="root" :style="tabStyle">
      <preview></preview>
      <workspace></workspace>
      <instruments @demonstration-started="demonstrationOpened = true"></instruments>
    </div>
    <demonstration v-if="demonstrationOpened" @closed="demonstrationOpened = false"></demonstration>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Preview from './components/constructor/Preview.vue'
import Workspace from './components/constructor/Workspace.vue'
import Instruments from './components/constructor/Instruments.vue'
import Demonstration from './components/constructor/Demonstration.vue'
import ConstructorStore from '@/services/store/ConstructorStore'
import HotkeysService from '@/services/constructor/HotkeysService'

const store = new ConstructorStore()
const hotkeyService = new HotkeysService()

@Options({
  components: {
    Preview,
    Workspace,
    Instruments,
    Demonstration,
  },
})
export default class ConstructorTab extends Vue {
  previewSize = store.previewModuleSize
  instrumentsSize = store.instrumentsModuleSize
  timelineSize = store.timelineModuleSize
  demonstrationOpened = false

  beforeMount() {
    hotkeyService.bindDefaultConstructorHotkeys()
  }
  beforeDestroy() {
    hotkeyService.unbindDefaultConstructorHotkeys()
  }

  get tabStyle() {
    return {
      gridTemplateColumns: this.previewSize + 'px 1fr ' + this.instrumentsSize + 'px',
    }
  }
}
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: inline-grid;
}
</style>
