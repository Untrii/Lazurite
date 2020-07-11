<template>
  <div class="root">
    <preview></preview>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Preview from './components/constructor/Preview.vue'

@Component({
  components: {
    Preview,
  },
})
export default class ConstructorTab extends Vue {}
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
}
</style>
