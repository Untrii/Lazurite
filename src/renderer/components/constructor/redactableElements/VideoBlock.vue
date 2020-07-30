<template>
  <video-block v-bind="$attrs"></video-block>
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
