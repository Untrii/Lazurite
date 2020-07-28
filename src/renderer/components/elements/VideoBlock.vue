<template>
  <color-corrector v-bind="$props">
    <video :src="src" alt="" :style="style" style="position:absolute" />
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
  @Prop() width!: number
  @Prop() height!: number

  @Prop() id!: string
  @Prop() scale!: number

  get style() {
    return {
      alignSelf: 'center',
      margin: 'auto',
      height: this.height * this.scale + 'px',
      width: this.width * this.scale + 'px', //,
      //transform: `scale(${this.parentScale},${this.parentScale})`
    }
  }
}
</script>

<style lang="scss" scoped></style>
