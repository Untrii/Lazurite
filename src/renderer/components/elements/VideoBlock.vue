<template>
  <color-corrector v-bind="$props">
    <video :src="src" alt="" :style="style" class="video-block" />
  </color-corrector>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import ColorCorrector from '@/components/elements/hocs/ColorCorrector.vue'

@Component({
  components: {
    ColorCorrector,
  },
})
export default class VideoBlock extends Vue {
  @Prop() src!: string
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
