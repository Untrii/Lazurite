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
    <lz-group-caption>
      Apply preset
    </lz-group-caption>
    <div class="text-editor">
      <lz-button
        v-for="(name, index) in presetNames"
        :key="'preset' + index"
        variant="light-gray"
        size="small"
        class="text-editor__input"
        >{{ name }}</lz-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'
import ITextBlock from '@/entities/slideObjects/ITextBlock'
import Color from '@/entities/Color'
import ElementService from '@/services/ElementService'

let service = new EditorService()
let elementService = new ElementService()

@Component
export default class TextEditor extends Vue {
  selectedVerticalAlign = 'top'
  selectedHorizontalAlign = 'left'
  fontSize = 0
  presetNames: string[] = []

  verticalAlignVariants = ['top', 'center', 'bottom']
  horizontalAlignVariants = ['left', 'center', 'right']

  getState() {
    let element: ITextBlock = service.selectedElement

    this.selectedVerticalAlign = element.verticalAlign
    this.selectedHorizontalAlign = element.horizontalAlign
    this.fontSize = element.fontSize
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)

    console.log('here')
    let groups = elementService.getGroups()
    let textGroup = groups.get('text')
    if (textGroup) {
      for (const item of textGroup) {
        this.presetNames.push(item.name)
      }
    }
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
