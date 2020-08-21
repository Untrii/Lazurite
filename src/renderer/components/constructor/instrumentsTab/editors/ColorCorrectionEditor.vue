<template>
  <div class="editor-root">
    <h5 class="header">Color correction</h5>
    <div v-for="form in forms" :key="form.propertyName" class="editor-input">
      {{ form.displayName }}
      <small class="reset-button" @click="onInput(form.propertyName, form.default)">
        reset
      </small>
      <b-form-input
        :value="element[form.propertyName]"
        @input="onInput(form.propertyName, $event)"
        type="range"
        :min="form.min"
        :max="form.max"
        :step="0.01"
        @change="registerHistory(form.propertyName, $event)"
      ></b-form-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'
import HistoryService from '@/services/HistoryService'

let service = new EditorService()
let historyService = new HistoryService()
let startVal: null | string = null

@Component
export default class ColorCorrectionEditor extends Vue {
  element: any = {}

  forms = [
    {
      displayName: 'Blur',
      propertyName: 'blur',
      min: 0,
      max: 30,
      default: 0,
    },
    {
      displayName: 'Brightness',
      propertyName: 'brightness',
      min: 0,
      max: 2,
      default: 1,
    },
    {
      displayName: 'Contrast',
      propertyName: 'contrast',
      min: 0,
      max: 2,
      default: 1,
    },
    {
      displayName: 'Grayscale',
      propertyName: 'grayscale',
      min: 0,
      max: 1,
      default: 0,
    },
    {
      displayName: 'Hue rotate',
      propertyName: 'hueRotate',
      min: 0,
      max: 360,
      default: 0,
    },
    {
      displayName: 'Opacity',
      propertyName: 'opacity',
      min: 0,
      max: 1,
      default: 1,
    },
    {
      displayName: 'Saturate',
      propertyName: 'saturate',
      min: 0,
      max: 5,
      default: 1,
    },
    {
      displayName: 'Sepia',
      propertyName: 'sepia',
      min: 0,
      max: 1,
      default: 0,
    },
    {
      displayName: 'Drop shadow',
      propertyName: 'dropShadow',
      min: 0,
      max: 40,
      default: 0,
    },
  ]

  getState() {
    this.element = service.selectedElement
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

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
.editor-root {
  padding: 20px 3px 0 15px;
}

.editor-input {
  // display: inline-block;
  // width: calc(50% - 0px);
  // padding: 0 5px 10px 5px;
}

.header {
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
