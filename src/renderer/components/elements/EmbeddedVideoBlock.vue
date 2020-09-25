<template>
  <color-corrector v-bind="$attrs">
    <iframe
      v-if="url != ''"
      :width="width * scale"
      :height="height * scale"
      :src="url"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
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
export default class EmbeddedVideoBlock extends Vue {
  @Prop() scale!: number
  @Prop() url!: string
  @Prop() width!: string
  @Prop() height!: string
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
