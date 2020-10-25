<template>
  <div class="cover-screen lz-modal__backdrop" v-if="isVisible"></div>
  <div class="cover-screen lz-modal" v-if="isVisible" @click="$emit('hide')">
    <div class="lz-modal__content" @click.stop>
      <slot></slot>
    </div>
    <div class="lz-modal__buttons" @click.stop>
      <lz-button variant="secondary" style="grid-column:2" @click="$emit('close')">Cancel</lz-button>
      <lz-button variant="primary" style="grid-column:4" @click="$emit('ok')">OK</lz-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class LzModal extends Vue {
  @Prop() isVisible = false
}
</script>

<style lang="scss" scoped>
.cover-screen {
  position: fixed;
  width: 100vw;
  height: calc(100vh - 31px);
  top: 31px;
  left: 0;
}
.lz-modal {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  grid-template-rows: 1fr max-content max-content 1fr;
  z-index: 9999;
  &__backdrop {
    z-index: 9990;
    background: rgba($color: black, $alpha: 0.5);
  }
  &__content {
    grid-row: 2;
    grid-column: 2;
    background: white;
    padding: 40px 40px 0 40px;
  }
  &__buttons {
    background: white;
    grid-row: 3;
    grid-column: 2;
    padding: 20px 40px 40px 20px;
    display: inline-grid;
    grid-template-columns: 1fr 80px 20px 80px;
  }
}
</style>
