<template>
  <video-block v-bind="$props"></video-block>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VideoBlock from '@/components/elements/VideoBlock.vue'

@Component({
  components: {
    VideoBlock,
  },
})
export default class RedactableVideoBlock extends Vue {
  @Prop() src!: string
  @Prop() width!: number
  @Prop() height!: number

  @Prop() id!: string
  @Prop() scale!: number

  getState() {}

  beforeMount() {
    this.getState()
    //service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>
