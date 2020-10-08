<template>
  <div>
    <lz-group-caption>Size and position</lz-group-caption>
    <div class="input-wrap">
      <div v-for="form in forms" :key="form.propertyName" class="editor-input">
        <!-- <b-input-group size="sm" :prepend="form.displayName">
        <b-form-input
          :value="element[form.propertyName]"
          @input="onInput(form.propertyName, $event)"
          type="number"
        ></b-form-input>
      </b-input-group> -->
        <lz-number-input
          size="small"
          :prepend="form.displayName"
          :value="element[form.propertyName]"
          @input="onInput(form.propertyName, $event)"
        >
        </lz-number-input>
      </div>
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
  element: any = store.selectedElement

  forms = [
    {
      displayName: 'X',
      propertyName: 'left'
    },
    {
      displayName: 'Y',
      propertyName: 'top'
    },
    {
      displayName: 'W',
      propertyName: 'width'
    },
    {
      displayName: 'H',
      propertyName: 'height'
    }
  ]

  onInput(propertyName, newVal) {
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped>
.input-wrap {
  padding: 0 3px 0 15px;
}

.editor-input {
  display: inline-block;
  width: calc(50% - 0px);
  padding: 0 5px 10px 5px;
}

.header {
  padding-left: 5px;
}
</style>
