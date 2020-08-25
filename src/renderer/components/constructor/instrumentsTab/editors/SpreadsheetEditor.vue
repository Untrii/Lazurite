<template>
  <div class="editor-root">
    <h5 class="header">Spreadsheet</h5>

    <b-form-group label="Highlight:">
      <b-form-checkbox
        v-for="option in highlightOptions"
        :key="option.propertyName"
        :checked="element[option.propertyName]"
        @change="onInput(option.propertyName, $event)"
        size="sm"
      >
        {{ option.displayName }}
      </b-form-checkbox>
    </b-form-group>

    <b-form-group>
      <b-form-checkbox
        v-for="checker in checkers"
        :key="checker.propertyName"
        :checked="element[checker.propertyName]"
        @change="onInput(checker.propertyName, $event)"
      >
        {{ checker.displayName }}
      </b-form-checkbox>
    </b-form-group>

    <b-input-group size="sm" prepend="Font size">
      <b-form-input :value="element.fontSize" @input="onInput('fontSize', $event)" type="number"></b-form-input>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'

let service = new EditorService()

@Component
export default class SizeEditor extends Vue {
  element: any = {}

  highlightOptions = [
    {
      displayName: 'Top',
      propertyName: 'highlightTop',
    },
    {
      displayName: 'Bottom',
      propertyName: 'highlightBottom',
    },
    {
      displayName: 'Left',
      propertyName: 'highlightLeft',
    },
    {
      displayName: 'Right',
      propertyName: 'highlightRight',
    },
  ]
  checkers = [
    {
      displayName: 'Strip horizontally',
      propertyName: 'stripHorizontally',
    },
    {
      displayName: 'Strip vertically',
      propertyName: 'stripVertically',
    },
    {
      displayName: 'Dark style',
      propertyName: 'darkStyle',
    },
    {
      displayName: 'Show borders',
      propertyName: 'showBorders',
    },
  ]

  getState() {
    this.element = service.selectedElement
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  onInput(propertyName, newVal) {
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped>
.editor-root {
  padding: 20px 3px 0 20px;
}

.editor-input {
  display: inline-block;
  width: calc(50% - 0px);
  padding: 0 5px 10px 5px;
}
</style>
