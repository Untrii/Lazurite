<template>
  <div class="caption">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class LzGroupCaption extends Vue {}
</script>

<style lang="scss" scoped>
.caption {
  font-size: 16px;
  font-weight: 600;
  padding: 16px 20px 6px;
  user-select: none;
  text-transform: capitalize;
}
</style>
