<template>
  <rectangle v-bind="$props"></rectangle>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import Rectangle from '@/components/elements/Rectangle.vue'
import { Options, Vue } from 'vue-class-component'

@Options({
  components: { Rectangle },
})
export default class RedactableRectangle extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  @Prop() color!: string
  @Prop() width!: number
  @Prop() height!: number
  @Prop() cornerRadius!: number
}
</script>

<style lang="scss" scoped></style>
