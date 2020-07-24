<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import VisualisationService from '@/services/VisualisationService'
import SlideObject from '@/entities/SlideObject'

import TextBlock from '@/components/elements/TextBlock.vue'

let service = new VisualisationService()

@Component({
  components: {
    TextBlock,
  },
})
export default class BaseElement extends Vue {
  @Prop(String) id

  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get element(): SlideObject {
    return service.elementById(this.id)
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
