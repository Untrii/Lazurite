<template>
  <color-corrector v-bind="$attrs">
    <img
      :src="src"
      alt=""
      style="width:100%; height:100%; user-drag: none; position:absolute"
      @click.prevent
    />
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
export default class ImageBlock extends Vue {
  @Prop() src!: string
  @Prop() width!: number
  @Prop() height!: number
}
</script>

<style lang="scss" scoped></style>
