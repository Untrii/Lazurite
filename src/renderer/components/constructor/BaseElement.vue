<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import VisualisationService from '../../services/VisualisationService'
import SlideObject, { getBlankObject } from '../../entities/SlideObject'

import TextBlock from '../elements/TextBlock.vue'

let service = new VisualisationService()

@Component({
  components: {
    TextBlock,
  },
})
export default class BaseElement extends Vue {
  element: SlideObject = getBlankObject()

  @Prop(String) id = ''

  getState() {
    this.element = service.elementById(this.id)
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  render(createElement) {
    return createElement(this.element.type.split('/')[0], {
      props: this.element,
      on: this.$listeners,
    })
  }
}
</script>

<style></style>
