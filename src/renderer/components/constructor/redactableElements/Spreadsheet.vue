<template>
  <spreadsheet v-bind="$attrs"></spreadsheet>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Spreadsheet from '@/components/elements/Spreadsheet.vue'

@Component({
  components: { Spreadsheet },
})
export default class RedactableSpreadsheet extends Vue {
  @Prop() id!: number
  @Prop() scale!: number
}
</script>

<style lang="scss" scoped></style>
