<template>
  <div>
    <choose-file-dialog></choose-file-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ChooseFileDialog from './ChooseFileDialog.vue'

@Component({
  components: {
    ChooseFileDialog,
  },
})
export default class DialogsWrapper extends Vue {}
</script>

<style lang="scss" scoped></style>
