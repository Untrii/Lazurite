<template>
  <div>
    <lz-group-caption>
      Text editor
    </lz-group-caption>
    <div class="text-editor">
      <lz-number-input
        prepend="Font size"
        @input="onFontSizeChange"
        :value="fontSize"
        size="small"
        class="text-editor__input"
      ></lz-number-input>
      <lz-color-input prepend="Text color" @input="onColorChange" class="text-editor__input"></lz-color-input>
      <div class="switch-group text-editor__input">
        <lz-prepend :minWidth="140" size="small">
          Vertical align
        </lz-prepend>
        <lz-press-switch
          v-for="variant in verticalAlignVariants"
          :key="'v' + variant"
          :checked="selectedVerticalAlign == variant"
          @change="onVerticalAlignChange(variant)"
          size="small"
          :image="'verticalAlign' + capitalizeFirst(variant)"
        ></lz-press-switch>
      </div>
      <div class="switch-group text-editor__input">
        <lz-prepend :minWidth="140" size="small">
          Horizontal align
        </lz-prepend>
        <lz-press-switch
          v-for="variant in horizontalAlignVariants"
          :key="'v' + variant"
          :checked="selectedHorizontalAlign == variant"
          @change="onHorizontalAlignChange(variant)"
          size="small"
          :image="'horizontalAlign' + capitalizeFirst(variant)"
        ></lz-press-switch>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'
import TextBlock from '@/entities/slideObjects/TextBlock'
import Color from '@/entities/Color'

let service = new EditorService()

@Component
export default class TextEditor extends Vue {
  selectedVerticalAlign = 'top'
  selectedHorizontalAlign = 'left'
  fontSize = 0

  verticalAlignVariants = ['top', 'middle', 'bottom']
  horizontalAlignVariants = ['left', 'middle', 'right']

  getState() {
    console.log('here')
    let element: TextBlock = service.selectedElement

    this.selectedVerticalAlign = element.verticalAlign
    this.selectedHorizontalAlign = element.horizontalAlign
    this.fontSize = element.fontSize
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }

  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  onFontSizeChange(newVal) {
    service.changeSelectedObjectProperty('fontSize', newVal)
  }

  onColorChange(newVal) {
    let color = new Color()
    color.fromOther(newVal)
    service.changeSelectedObjectProperty('color', color)
  }

  onHorizontalAlignChange(newVal) {
    service.changeSelectedObjectProperty('horizontalAlign', newVal)
  }

  onVerticalAlignChange(newVal) {
    service.changeSelectedObjectProperty('verticalAlign', newVal)
  }

  capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
</script>

<style lang="scss" scoped>
.switch-group {
  display: inline-grid;
  grid-template-columns: max-content 1fr 1fr 1fr;
  width: 100%;
}

.text-editor {
  margin-left: 20px;
  margin-right: 8px;

  &__input {
    margin-bottom: 10px;
  }
}
</style>
