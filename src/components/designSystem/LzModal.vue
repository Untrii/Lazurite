<template>
  <div class="cover-screen lz-modal__backdrop" :class="Array.from(backdropClasses)" v-if="localIsVisible"></div>
  <div class="cover-screen lz-modal" :class="Array.from(modalClasses)" v-if="localIsVisible" @click="$emit('hide')">
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
import { Prop, Watch } from 'vue-property-decorator'

export default class LzModal extends Vue {
  @Prop() isVisible = false

  localIsVisible = false

  backdropClasses: Set<string> = new Set()
  modalClasses: Set<string> = new Set()

  @Watch('isVisible')
  onVisibilityChanged(newVal: boolean) {
    if (newVal) {
      this.localIsVisible = this.isVisible

      setTimeout(() => {
        this.backdropClasses.delete('lz-modal__backdrop_disappear')
        this.modalClasses.delete('lz-modal_disappear')

        this.backdropClasses.add('lz-modal__backdrop_appear')
        this.modalClasses.add('lz-modal_appear')
      }, 0)
      setTimeout(() => {
        this.backdropClasses.delete('lz-modal__backdrop_appear')
        this.modalClasses.delete('lz-modal_appear')
      }, 600)
    } else {
      setTimeout(() => {
        this.localIsVisible = this.isVisible
      }, 500)
      this.backdropClasses.add('lz-modal__backdrop_disappear')
      this.modalClasses.add('lz-modal_disappear')
    }
  }
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

  &_appear {
    transform: translateY(0);
    transition: 0.5s;
  }

  &_disappear {
    transform: translateY(-100vh);
    background: rgba($color: black, $alpha: 0);
    transition: 0.5s;
  }

  &__backdrop {
    z-index: 9990;
    background: rgba($color: black, $alpha: 0.5);

    &_appear {
      background: rgba($color: black, $alpha: 0.5);
      transition: 0.5s;
    }

    &_disappear {
      background: rgba($color: black, $alpha: 0);
      transition: 0.5s;
    }
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
