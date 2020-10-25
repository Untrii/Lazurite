<template>
  <star v-bind="$attrs"></star>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Options, Vue } from 'vue-class-component'
import Star from '@/components/elements/Star.vue'

@Options({
  components: { Star },
})
export default class RedactableStar extends Vue {}
</script>

<style lang="scss" scoped></style>
