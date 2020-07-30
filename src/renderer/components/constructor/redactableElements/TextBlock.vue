<template>
  <div>
    <div class="control-buttons" :style="controlDockStyle" v-show="isSelected">
      <div class="control-buttons__item">
        hui
      </div>
      <div class="control-buttons__item">
        hui
      </div>
      <div class="control-buttons__item">
        hui
      </div>
    </div>
    <text-block v-bind="$attrs" class="content"></text-block>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import TextBlock from '@/components/elements/TextBlock.vue'
import assets from '@/assets'
import VisualisationService from '@/services/VisualisationService'

let service = new ConstructorService()
let visualisationService = new VisualisationService()

@Component({
  components: { TextBlock },
})
export default class RedactableTextBlock extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  blockSize = 0
  isSelected = false
  isRedacting = false
  x = 0

  getState() {
    let element = visualisationService.elementById(this.id)
    this.isSelected = service.selectedObjectId == this.id
    this.blockSize = element.height
    this.x = element.top
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get assets() {
    return assets
  }

  get controlDockStyle() {
    if (this.x < 48 / this.scale)
      return {
        marginTop: this.blockSize * this.scale + 8 + 'px',
      }
    else return {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';

.control-buttons {
  position: absolute;
  margin-top: -40px;
  margin-left: 10px;
  display: inline-flex;
  transition: 0.3s;

  &__item {
    background: $gray-extradark;
    width: 32px;
    height: 32px;
    display: inline-block;

    &:hover {
      background: $gray-dark;
      cursor: pointer;
    }

    &:not(:last-child) {
      border-right: 1px solid $gray-dark;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
.content {
  width: 100%;
  height: 100%;
}
</style>
