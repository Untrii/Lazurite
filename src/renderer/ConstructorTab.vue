<template>
  <div class="root" :style="tabStyle">
    <preview></preview>
    <workspace></workspace>
    <instruments></instruments>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Preview from './components/constructor/Preview.vue'
import Workspace from './components/constructor/Workspace.vue'
import Instruments from './components/constructor/Instruments.vue'
import ConstructorService from './services/ConstructorService'
import Hotkeys from '@/utils/Hotkeys'

let service = new ConstructorService()

@Component({
  components: {
    Preview,
    Workspace,
    Instruments,
  },
})
export default class ConstructorTab extends Vue {
  previewSize = 0
  instrumentsSize = 0
  timelineSize = 0

  getState() {
    this.previewSize = service.previewModuleSize ?? 0
    this.instrumentsSize = service.instrumentsModuleSize ?? 0
    this.timelineSize = service.timelineModuleSize ?? 0
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
    Hotkeys.bind('ctrl+v', () => service.pasteObjects())
    Hotkeys.bind('ctrl+c', () => {
      service.copyObjects(new Set(service.selectedObjectIds))
    })
    Hotkeys.bind('ctrl+x', () => {
      service.copyObjects(new Set(service.selectedObjectIds))
      service.deleteObjects(service.selectedObjectIds)
    })
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
    Hotkeys.unbind('ctrl+v')
    Hotkeys.unbind('ctrl+c')
    Hotkeys.unbind('ctrl+x')
  }

  get tabStyle() {
    return {
      gridTemplateColumns:
        this.previewSize + 'px 1fr ' + this.instrumentsSize + 'px',
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
