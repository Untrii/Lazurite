<template>
  <div>
    <lz-group-caption>Figure</lz-group-caption>
    <div class="figure-editor">
      <lz-color-input
        prepend="Color"
        @input="onColorChange($event, 'color')"
        class="figure-editor__input"
      ></lz-color-input>
      <lz-color-input
        prepend="Stroke color"
        @input="onColorChange($event, 'strokeColor')"
        class="figure-editor__input"
      ></lz-color-input>
      <lz-number-input
        prepend="Stroke size"
        :value="element.strokeSize"
        @input="onInput('strokeSize', $event)"
        class="figure-editor__input"
        size="small"
      ></lz-number-input>
      <lz-number-input
        prepend="Corner radius"
        v-if="element.type == 'Rectangle'"
        :value="element.cornerRadius"
        @input="onInput('cornerRadius', $event)"
        class="figure-editor__input"
        size="small"
      ></lz-number-input>
    </div>
  </div>
</template>

<script lang="ts">
import Color from '@/entities/Color'
import IColor from '@/entities/IColor'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import { Vue, Component } from 'vue-property-decorator'
import ConstructorStore from '@/services/store/ConstructorStore'

let store = new ConstructorStore()
let service = new SlideObjectService()

@Component
export default class FigureEditor extends Vue {
  get element() {
    return store.selectedElement
  }
  onColorChange(newVal: IColor, propertyName: string) {
    let color = new Color()
    color.fromOther(newVal)
    service.changeSelectedObjectProperty(propertyName, color)
  }
  onInput(propertyName, newVal) {
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped>
.figure-editor {
  margin-left: 20px;
  margin-right: 8px;

  &__input {
    margin-bottom: 10px;
  }
}
</style>
