<template>
  <star v-bind="$attrs"></star>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Star from '@/components/elements/Star.vue'

@Component({
  components: { Star },
})
export default class RedactableStar extends Vue {}
</script>

<style lang="scss" scoped></style>
