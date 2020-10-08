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
      <lz-color-input
        prepend="Text color"
        @input="onColorChange"
        class="text-editor__input"
      ></lz-color-input>
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
import Color from '@/entities/Color'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import ConstructorStore from '@/services/store/ConstructorStore'
import ElementPresetFactory from '@/services/constructor/ElementPresetFactory'

let store = new ConstructorStore()
let service = new SlideObjectService()
let elementPresetFactory = new ElementPresetFactory()

@Component
export default class TextEditor extends Vue {
  get element() {
    return store.selectedElement
  }
  get selectedVerticalAlign() {
    return this.element.verticalAlign
  }
  get selectedHorizontalAlign() {
    return this.element.horizontalAlign
  }
  get fontSize() {
    return this.element.fontSize
  }

  verticalAlignVariants = ['top', 'center', 'bottom']
  horizontalAlignVariants = ['left', 'center', 'right']

  get presetNames() {
    let result: string[] = []
    let groups = elementPresetFactory.getGroups()
    let textGroup = groups.get('text')
    if (textGroup) {
      for (const item of textGroup) {
        result.push(item.name)
      }
    }
    return result
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
