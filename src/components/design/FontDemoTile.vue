<template>
  <div class="font-tile" :class="tileClasses">
    <div class="font-tile__name" :style="'font-family: ' + name">
      {{ name }}
    </div>
    <div class="font-tile__weights">
      <div
        class="font-tile__weight"
        v-for="variant in variants"
        :key="name + variant"
      >
        {{ variant }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class FontDemoTile extends Vue {
  @Prop() name!: string
  @Prop() variants: number[] = []
  @Prop() isSelected: boolean = false

  get tileClasses() {
    if (this.isSelected) return ['text-white', 'bg-blue']
    else return []
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.font-tile {
  background: white;
  text-align: center;
  width: 100%;
  padding: 20px;

  &__name {
    font-size: 36px;
    margin-bottom: 10px;
  }
  &__weights {
    display: inline-flex;
    justify-content: space-around;
    font-size: 16px;
  }
  &__weight {
    margin: 0 5px;
  }
}

.text-white {
  color: white;
}

.bg-blue {
  background-color: $blue-light !important;
  transition: 0.3s;
}

@media (min-width: 1640px) and (max-width: 1900px) {
  .font-tile__name {
    font-size: 30px;
  }
}
</style>
