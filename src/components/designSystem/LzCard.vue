<template>
  <div class="lz-card">
    <div class="lz-card__body"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class LzCard extends Vue {}
</script>

<style lang="scss" scoped>
.lz-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  &__body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
  }
}
</style>
