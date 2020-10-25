<template>
  <div class="workspace" v-if="selectedSlideIndex >= 0" :style="rootStyle">
    <slide :index="selectedSlideIndex" :width="workspaceWidth" :height="workspaceHeight" :isRedactable="true"></slide>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Slide from './Slide.vue'
import ConstrctorStore from '@/services/store/ConstructorStore'

const store = new ConstrctorStore()

@Options({
  components: {
    Slide,
  },
})
export default class Workspace extends Vue {
  get selectedSlideIndex() {
    return store.selectedSlideIndex
  }
  workspaceWidth = 1

  get workspaceHeight() {
    return (this.workspaceWidth / 16) * 9
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.recalcWidth)
  }

  mounted() {
    window.addEventListener('resize', this.recalcWidth)
    this.recalcWidth()
  }

  recalcWidth() {
    let result = 1
    if (!(store.timelineModuleSize && store.previewModuleSize && store.instrumentsModuleSize)) return

    result = window.innerWidth - store.previewModuleSize - store.instrumentsModuleSize - 40
    if (window.innerHeight < (result / 16) * 9 + 75 + store.timelineModuleSize)
      result = ((window.innerHeight - store.timelineModuleSize - 75) / 9) * 16
    this.workspaceWidth = result
  }

  get rootStyle() {
    return {
      width: this.workspaceWidth + 'px',
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace {
  margin: 20px auto 0;
}
</style>
