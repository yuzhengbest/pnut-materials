<template>
  <ul
    class="pnut-card-list"
    :style="cardListStyle"
  >
    <slot name="prepend" />
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  minWidth: {
    type: Number,
    default: 256
  }
})

const cardListStyle = computed(() => {
  return {
    'grid-template-columns': `repeat(auto-fill, minmax(${parseInt(props.minWidth)}px, 1fr))`
  }
})

</script>

<style lang="scss" scoped>
.pnut-card-list {
  display: grid;
  grid-auto-rows: min-content;
  grid-auto-flow: row dense;
  gap: 16px;
}
</style>
