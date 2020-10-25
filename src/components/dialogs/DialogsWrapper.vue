<template>
  <div>
    <choose-file-dialog></choose-file-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import ChooseFileDialog from './ChooseFileDialog.vue'

@Options({
  components: {
    ChooseFileDialog,
  },
})
export default class DialogsWrapper extends Vue {}
</script>

<style lang="scss">
.modal-backdrop {
  opacity: 0.5;
  top: 31px !important;
}
.modal {
  top: 31px !important;
  height: calc(100% - 62px);
}
</style>
