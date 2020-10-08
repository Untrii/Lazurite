<template>
  <div class="editor-root">
    <lz-group-caption>Color correction</lz-group-caption>
    <div class="editors">
      <lz-range-input
        v-for="form in forms"
        :key="form.propertyName"
        :value="element[form.propertyName]"
        @input="onInput(form.propertyName, $event)"
        :min="form.min"
        :max="form.max"
        :step="0.01"
        @change="registerHistory(form.propertyName, $event)"
        @reset="onInput(form.propertyName, form.default)"
        size="small"
        :prepend="form.displayName"
        :minPrependWidth="120"
        class="range"
      >
      </lz-range-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import HistoryService from '@/services/constructor/HistoryService'
import ConstructorStore from '@/services/store/ConstructorStore'

let store = new ConstructorStore()
let service = new SlideObjectService()
let historyService = new HistoryService()
let startVal: null | string = null

@Component
export default class ColorCorrectionEditor extends Vue {
  element: any = store.selectedElement

  forms = [
    {
      displayName: 'Blur',
      propertyName: 'blur',
      min: 0,
      max: 30,
      default: 0
    },
    {
      displayName: 'Brightness',
      propertyName: 'brightness',
      min: 0,
      max: 2,
      default: 1
    },
    {
      displayName: 'Contrast',
      propertyName: 'contrast',
      min: 0,
      max: 2,
      default: 1
    },
    {
      displayName: 'Grayscale',
      propertyName: 'grayscale',
      min: 0,
      max: 1,
      default: 0
    },
    {
      displayName: 'Hue rotate',
      propertyName: 'hueRotate',
      min: 0,
      max: 360,
      default: 0
    },
    {
      displayName: 'Opacity',
      propertyName: 'opacity',
      min: 0,
      max: 1,
      default: 1
    },
    {
      displayName: 'Saturate',
      propertyName: 'saturate',
      min: 0,
      max: 5,
      default: 1
    },
    {
      displayName: 'Sepia',
      propertyName: 'sepia',
      min: 0,
      max: 1,
      default: 0
    },
    {
      displayName: 'Drop shadow',
      propertyName: 'dropShadow',
      min: 0,
      max: 40,
      default: 0
    }
  ]

  onInput(propertyName, newVal) {
    if (typeof newVal != 'number') newVal = parseFloat(newVal)
    if (startVal == null) startVal = this.element[propertyName]
    service.changeSelectedObjectProperty(propertyName, newVal)
  }

  registerHistory(propertyName, newVal) {
    if (startVal != null) {
      historyService.registerColorCorrection(this.element.id, propertyName, startVal, newVal)
      startVal = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.editors {
  margin-left: 20px;
  margin-right: 8px;
  margin-top: -2px;
}
.range:not(:last-child) {
  margin-bottom: 8px;
}
.range {
  margin-top: 2px;
}

.reset-button {
  background: $blue-normal;
  color: white;
  padding: 2px 6px 4px 6px;
  border-radius: 4px;
  float: right;
  cursor: pointer;
}
</style>
