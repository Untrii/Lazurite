<template>
  <spreadsheet v-bind="$attrs"></spreadsheet>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import Spreadsheet from '@/components/elements/Spreadsheet.vue'

@Options({
  components: { Spreadsheet },
})
export default class RedactableSpreadsheet extends Vue {
  @Prop() id!: number
  @Prop() scale!: number
}
</script>

<style lang="scss" scoped></style>
