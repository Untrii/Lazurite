<template>
  <color-corrector v-bind="$props">
    <img
      :src="'local-img://' + src"
      alt=""
      style="width:100%; height:100%; user-drag: none; position:absolute"
      @click.prevent
    />
  </color-corrector>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import ColorCorrector from '@/components/elements/hocs/ColorCorrector.vue'

@Options({
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
