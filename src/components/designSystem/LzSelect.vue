<template>
  <div class="select" :class="rootClasses">
    <lz-prepend :size="size" v-if="prepend.length > 0">
      {{ prepend }}
    </lz-prepend>
    <div v-else></div>
    <select @change.stop="onOptionChange" class="select__user-input">
      <option
        :value="option"
        :key="option"
        v-for="option in options"
        :selected="isOptionSelected(option)"
        >{{ option }}</option
      >
    </select>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class LzSelect extends Vue {
  @Prop() value = ''
  @Prop() prepend = ''
  @Prop() size = 'medium'
  @Prop() options: string[] = []

  isOptionSelected(option) {
    return option == this.value
  }

  onOptionChange(event: Event) {
    const target: any = event.target
    console.log(target.value)
    this.$emit('change', target?.value)
  }

  get rootClasses() {
    const result: string[] = []
    result.push('number-input_' + this.size)
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.select {
  height: 32px;
  width: 100%;
  display: inline-grid;
  grid-template-columns: max-content 1fr max-content;

  &:hover &__buttons {
    display: grid;
  }

  &__prepend {
    background-color: #e6e6eb;

    &_small {
      padding: 0 12px;
    }
    &_medium {
      padding: 0 16px;
    }
    &_large {
      padding: 0 20px;
    }
    &_no-prepend {
      padding: 0;
    }
  }

  &__user-input {
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: white;
    &_small {
      padding: 0 12px;
    }
    &_medium {
      padding: 0 16px;
    }
    &_large {
      padding: 0 20px;
    }

    border: none;
    outline: 2px solid $gray-extralight;

    &:focus {
      outline: 2px solid $blue-lighter;
      z-index: 1000;
    }
  }

  &_small {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  &_medium {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  &_large {
    height: 48px;
    line-height: 48px;
    font-size: 20px;
  }
}
</style>
