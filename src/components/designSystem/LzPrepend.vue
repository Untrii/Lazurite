<template>
  <div class="prepend" :class="prependClasses" :style="prependStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'

export default class LzPrepend extends Vue {
  @Prop({ default: 'medium' }) size!: string
  @Prop({ default: 0 }) minWidth!: number

  get prependClasses() {
    const result: string[] = []
    result.push('prepend_' + this.size)
    return result
  }

  get prependStyle() {
    if (this.minWidth > 0) {
      return {
        minWidth: this.minWidth + 'px',
        textAlign: 'center',
      }
    }
    return {}
  }
}
</script>

<style lang="scss" scoped>
.prepend {
  background-color: #e6e6eb;
  user-select: none;
  &_small {
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  &_medium {
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  &_large {
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    font-size: 20px;
  }
  &_no-prepend {
    padding: 0;
  }
}
</style>
