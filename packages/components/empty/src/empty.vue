<template>
  <div class="pnut-empty">
    <div :class="{
      'has-title': hasTitle || title,
      [`h-breakpoint--${size}`]: !!size
    }">
      <template v-if="hasDefault">
        <slot></slot>
      </template>
      <template v-else>
        
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, useSlots } from 'vue'

const props = defineProps({
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  theme: {
    type: String as PropType<'dark' | 'light'>,
    default: 'light'
  },
  img: {
    type: String,
    default: '404'
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  placement: {
    type: String,
    default: 'bottom'
  }
})

const slots = useSlots()

const hasDefault = computed(() => slots.default)

const hasImg = computed(() => slots.img)

const hasTitle = computed(() => slots.title)

const hasDescription = computed(() => slots.description)

const hasButtons = computed(() => slots.buttons)


</script>
