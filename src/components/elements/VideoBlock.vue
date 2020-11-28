<template>
  <color-corrector v-bind="$attrs">
    <video
      :src="'local-img://' + resourceFolder + '/' + src"
      alt=""
      class="video-block"
    />
  </color-corrector>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import ColorCorrector from '@/components/elements/hocs/ColorCorrector.vue'
import ConstrctorStore from '@/services/store/ConstructorStore'

const store = new ConstrctorStore()

@Options({
  components: {
    ColorCorrector,
  },
})
export default class VideoBlock extends Vue {
  @Prop() src!: string

  get resourceFolder() {
    return store.resourceFolder
  }
}
</script>

<style lang="scss" scoped>
.video-block {
  position: absolute;
  margin: auto;
  align-self: 'center';
  height: 100%;
  width: 100%;
}
</style>
