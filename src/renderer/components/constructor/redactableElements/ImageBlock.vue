<template>
  <image-block v-bind="$attrs"></image-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import ImageBlock from '@/components/elements/ImageBlock.vue'

@Component({
  components: { ImageBlock },
})
export default class RedactableImageBlock extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  @Prop() src!: string
  @Prop() width!: number
  @Prop() height!: number

  getState() {}

  beforeMount() {
    this.getState()
    //service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>
