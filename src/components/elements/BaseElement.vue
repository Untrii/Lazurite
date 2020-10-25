<script lang="ts">
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import { h } from 'vue'
import ISlideObject from '@/entities/ISlideObject'

import elements from './index'
import ConstrctorStore from '@/services/store/ConstructorStore'

const store = new ConstrctorStore()

@Options({
  components: elements,
})
export default class BaseElement extends Vue {
  @Prop(String) id
  @Prop(Number) scale

  get element(): ISlideObject {
    return store.elementById(this.id)
  }

  render() {
    const obj: any = store.elementById(this.id)
    return h(elements[this.element.type.split('/')[0]], {
      ...this.element,
      scale: this.scale,
      style: {
        position: 'absolute',
        height: obj.height * this.scale + 'px',
        width: obj.width * this.scale + 'px',
        top: obj.top * this.scale + 'px',
        left: obj.left * this.scale + 'px',
        zIndex: obj.zIndex,
      },
    })
  }
}
</script>

<style></style>
