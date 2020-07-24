<template>
  <div>
    <div v-for="name in groupNames" :key="name" class="element-group">
      <h6 class="element-group__header">
        {{ name }}
      </h6>
      <div
        class="element-group__item"
        v-for="preset in elementGroups.get(name)"
        :key="preset.name"
        @click="createElement(preset)"
      >
        <img :src="preset.image" alt height="40" width="40" />
        {{ preset.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ElementService from '@/services/ElementService'
import ElementPreset from '@/entities/ElementPreset'
import ConstructorService from '@/services/ConstructorService'

let elementService = new ElementService()
let constructorService = new ConstructorService()
@Component
export default class AddTab extends Vue {
  elementGroups: Map<string, ElementPreset[]> = new Map()
  groupNames: string[] = []

  getState() {
    this.elementGroups = elementService.getGroups()
    this.groupNames = Array.from(elementService.getGroups().keys())
  }

  beforeMount() {
    this.getState()
    elementService.addOnChangeListener(() => this.getState())
    constructorService.addOnChangeListener(() => this.getState())
  }

  createElement(preset) {
    constructorService.createObject(preset)
  }
}
</script>

<style lang="scss" scoped>
.element-group {
  &__header {
    padding: 10px 20px;
    margin-bottom: 0 !important;
  }

  &__item {
    margin: 5px 10px;
    cursor: pointer;
    font-weight: 400;

    img {
      border: 1px solid #e6e6eb;
    }
  }
}
</style>
