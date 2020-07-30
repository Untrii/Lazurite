<template>
  <div class="editor-root">
    <h5 class="header">Size and position</h5>
    <div v-for="form in forms" :key="form.propertyName" class="editor-input">
      <b-input-group size="sm" :prepend="form.displayName">
        <b-form-input
          :value="element[form.propertyName]"
          @input="onInput(form.propertyName, $event)"
          type="number"
        ></b-form-input>
      </b-input-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'

let service = new EditorService()

@Component
export default class ColorCorrectionEditor extends Vue {
  element: any = {}

  forms = [
    {
      displayName: 'Blur',
      propertyName: 'blur',
    },
    {
      displayName: 'Brightness',
      propertyName: 'brightness',
    },
    {
      displayName: 'Contrast',
      propertyName: 'contrast',
    },
    {
      displayName: 'Grayscale',
      propertyName: 'grayscale',
    },
    {
      displayName: 'Hue rotate',
      propertyName: 'hueRotate',
    },
    {
      displayName: 'opacity',
      propertyName: 'opacity',
    },
    {
      displayName: 'Saturate',
      propertyName: 'saturate',
    },
    {
      displayName: 'Sepia',
      propertyName: 'sepia',
    },
    {
      displayName: 'Drop shadow',
      propertyName: 'dropShadow',
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
    if (newVal == '') return
    if (typeof newVal != 'number') newVal = parseInt(newVal)
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped>
.editor-root {
  padding: 20px 3px 0 15px;
}

.editor-input {
  display: inline-block;
  width: calc(50% - 0px);
  padding: 0 5px 10px 5px;
}

.header {
}
</style>
