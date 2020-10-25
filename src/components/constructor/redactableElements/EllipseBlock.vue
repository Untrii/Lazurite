<template>
  <ellipse-block v-bind="$attrs"></ellipse-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Options, Vue } from 'vue-class-component'
import EllipseBlock from '@/components/elements/EllipseBlock.vue'

@Options({
  components: { EllipseBlock },
})
export default class RedactableEllipseBlock extends Vue {}
</script>

<style lang="scss" scoped></style>
