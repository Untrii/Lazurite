<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import VisualisationService from '@/services/VisualisationService'
import SlideObject from '@/entities/SlideObject'

import elements from './index'

let service = new VisualisationService()

@Component({
  components: elements,
})
export default class BaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  onChangeListener: Function = () => this.$forceUpdate()
  beforeMount() {
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  get element(): SlideObject {
    return service.elementById(this.id)
  }

  render(createElement) {
    let obj: any = service.elementById(this.id)
    return createElement(this.element.type.split('/')[0], {
      props: { ...this.element, scale: this.scale },
      attrs: { ...this.element, scale: this.scale },
      style: {
        position: 'absolute',
        height: obj.height * this.scale + 'px',
        width: obj.width * this.scale + 'px',
        top: obj.top * this.scale + 'px',
        left: obj.left * this.scale + 'px',
      },
      on: this.$listeners,
    })
  }
}
</script>

<style></style>
