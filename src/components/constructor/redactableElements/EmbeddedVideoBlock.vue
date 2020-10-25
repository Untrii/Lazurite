<template>
  <embedded-video-block v-bind="$attrs"></embedded-video-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Options, Vue } from 'vue-class-component'
import EmbeddedVideoBlock from '@/components/elements/EmbeddedVideoBlock.vue'

@Options({
  components: { EmbeddedVideoBlock },
})
export default class RedactableEmbeddedVideoBlock extends Vue {}
</script>

<style lang="scss" scoped></style>
