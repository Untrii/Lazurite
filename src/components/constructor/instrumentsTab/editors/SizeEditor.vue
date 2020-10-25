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
import { Vue } from 'vue-class-component'
import SlideObjectService from '@/services/constructor/SlideObjectService'
import ConstructorStore from '@/services/store/ConstructorStore'

const store = new ConstructorStore()
const service = new SlideObjectService()

export default class SizeEditor extends Vue {
  get element() {
    return store.selectedElement
  }
  forms = [
    {
      displayName: 'X',
      propertyName: 'left',
    },
    {
      displayName: 'Y',
      propertyName: 'top',
    },
    {
      displayName: 'W',
      propertyName: 'width',
    },
    {
      displayName: 'H',
      propertyName: 'height',
    },
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
