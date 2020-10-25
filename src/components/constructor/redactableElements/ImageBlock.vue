<template>
  <image-block v-bind="$props"></image-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import ImageBlock from '@/components/elements/ImageBlock.vue'
import { Options, Vue } from 'vue-class-component'

@Options({
  components: { ImageBlock },
})
export default class RedactableImageBlock extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  @Prop() src!: string
  @Prop() width!: number
  @Prop() height!: number
}
</script>

<style lang="scss" scoped></style>
