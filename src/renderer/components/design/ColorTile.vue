<template>
  <div class="color-tile" :style="tileStyle" @click="$emit('select')">
    <div v-if="isSelected">
      <h5>selected</h5>
    </div>
    <div class="tile-plus" v-if="type == 'add'" @click.stop="$emit('add')">
      <img :src="assets.plus" data-toggle="color-palette" />
    </div>
    <div v-if="isDeletable" @click.stop="$emit('delete', value)" class="tile-delete-wrap">
      <div class="tile-delete">
        <img :src="assets.delete_black" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import assets from '@/assets/index'

@Component
export default class ColorTile extends Vue {
  @Prop(String) type
  @Prop(String) value
  @Prop(Boolean) isDeletable
  @Prop(Boolean) isSelected

  beforeMount() {}

  get assets() {
    return assets
  }

  get tileStyle() {
    switch (this.type) {
      case 'add':
        return 'background: #ddd'
      case 'color':
        return 'background:' + this.value
      case 'gradient':
      case 'gradicolor':
        return 'background-image: linear-gradient( ' + this.value + ');'
      case 'pattern':
      case 'image':
        return `background-image: url("${process
          .cwd()
          .split('\\')
          .join('/')}/data${this.value}");background-size:cover`
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
.color-tile {
  vertical-align: bottom;
  cursor: pointer;
  width: 200px;
  height: 140px;
  background: white;
  display: inline-block;
  border-radius: 8px;
  margin: 20px;
  border: 1px solid #596b7d;
}
.color-tile h5 {
  width: fit-content;
  padding: 4px;
  background: white;
  border-top-left-radius: 7.5px;
  border-bottom-right-radius: 8px;
  float: left;
}
.tile-plus img {
  height: 64px;
  width: 64px;
  margin: 38px 67px 37px 68px;
}
.tile-delete {
  width: 30px;
  height: 30px;
  float: right;
  padding: 8px;
  background-color: white;
  border-top-right-radius: 7.5px;
  border-bottom-left-radius: 8px;
}
.tile-delete-wrap {
  opacity: 0;
}
.color-tile:hover div.tile-delete-wrap {
  opacity: 1;
}
.tile-delete img {
  width: 14px;
  height: 14px;
  vertical-align: top;
}
</style>
