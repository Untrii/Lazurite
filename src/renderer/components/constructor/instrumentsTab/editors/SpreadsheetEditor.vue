<template>
  <div class="editor-root">
    <lz-group-caption>Spreadsheet</lz-group-caption>
    <div class="settings-block">
      <div class="multi-input" v-for="(group, name) in optionGroups" :key="name">
        <div class="multi-input__caption">{{ name }}</div>
        <div class="multi-input__wrapper" v-for="option in group" :key="option.propertyName">
          <lz-checkbox
            :checked="element[option.propertyName]"
            @change="onInput(option.propertyName, $event)"
            size="small"
          >
            {{ option.displayName }}
          </lz-checkbox>
        </div>
      </div>

      <lz-checkbox
        v-for="checker in checkers"
        :key="checker.propertyName"
        :checked="element[checker.propertyName]"
        @change="onInput(checker.propertyName, $event)"
      >
        {{ checker.displayName }}
      </lz-checkbox>

      <lz-number-input
        style="margin-top:12px"
        size="small"
        prepend="Font size"
        :value="element.fontSize"
        @input="onInput('fontSize', $event)"
      ></lz-number-input>

      <lz-number-input
        style="margin-top:10px"
        size="small"
        prepend="Border radius"
        :value="element.borderRadius"
        @input="onInput('borderRadius', $event)"
      ></lz-number-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import ConstructorStore from '@/services/store/ConstructorStore'

let store = new ConstructorStore()
let service = new SlideObjectService()

@Component
export default class SizeEditor extends Vue {
  get element() {
    return store.selectedElement
  }
  optionGroups = {
    highlight: [
      {
        displayName: 'Top',
        propertyName: 'highlightTop'
      },
      {
        displayName: 'Bottom',
        propertyName: 'highlightBottom'
      },
      {
        displayName: 'Left',
        propertyName: 'highlightLeft'
      },
      {
        displayName: 'Right',
        propertyName: 'highlightRight'
      }
    ],
    strip: [
      {
        displayName: 'Horizontally',
        propertyName: 'stripHorizontally'
      },
      {
        displayName: 'Vertically',
        propertyName: 'stripVertically'
      }
    ]
  }

  checkers = [
    {
      displayName: 'Dark style',
      propertyName: 'darkStyle'
    },
    {
      displayName: 'Show borders',
      propertyName: 'showBorders'
    }
  ]

  onInput(propertyName, newVal) {
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped>
.editor-root {
  // padding: 20px 3px 0 20px;
}
.settings-block {
  margin-left: 20px;
  margin-right: 8px;
}

.multi-input {
  width: 100%;
  padding-bottom: 12px;

  &__wrapper {
    min-width: 50%;
    width: fit-content;
    display: inline-block;
  }

  &__caption {
    padding-bottom: 6px;
    text-align: center;
    width: 100%;
  }
}

.editor-input {
  display: inline-block;
  width: calc(50% - 0px);
  padding: 0 5px 10px 5px;
}
</style>
