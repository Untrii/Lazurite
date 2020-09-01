<template>
  <ellipse-block v-bind="$attrs"></ellipse-block>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import EllipseBlock from '@/components/elements/EllipseBlock.vue'

@Component({
  components: { EllipseBlock },
})
export default class RedactableEllipseBlock extends Vue {}
</script>

<style lang="scss" scoped></style>
