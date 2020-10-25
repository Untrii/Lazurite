<template>
  <video-block v-bind="$attrs"></video-block>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import VideoBlock from '@/components/elements/VideoBlock.vue'

@Options({
  components: {
    VideoBlock,
  },
})
export default class RedactableVideoBlock extends Vue {
  @Prop() id!: string
  @Prop() scale!: number
}
</script>

<style lang="scss" scoped></style>
