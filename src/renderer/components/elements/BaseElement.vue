<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import ISlideObject from '@/entities/ISlideObject'

import elements from './index'
import ConstrctorStore from '@/services/store/ConstructorStore'

let store = new ConstrctorStore()

@Component({
  components: elements
})
export default class BaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  get element(): ISlideObject {
    return store.elementById(this.id)
  }

  render(createElement) {
    let obj: any = store.elementById(this.id)
    return createElement(this.element.type.split('/')[0], {
      props: { ...this.element, scale: this.scale },
      attrs: { ...this.element, scale: this.scale },
      style: {
        position: 'absolute',
        height: obj.height * this.scale + 'px',
        width: obj.width * this.scale + 'px',
        top: obj.top * this.scale + 'px',
        left: obj.left * this.scale + 'px'
      },
      on: this.$listeners
    })
  }
}
</script>

<style></style>
