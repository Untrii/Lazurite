<template>
  <embedded-video-block v-bind="$attrs"></embedded-video-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import EmbeddedVideoBlock from '@/components/elements/EmbeddedVideoBlock.vue'

@Component({
  components: { EmbeddedVideoBlock },
})
export default class RedactableEmbeddedVideoBlock extends Vue {}
</script>

<style lang="scss" scoped></style>
