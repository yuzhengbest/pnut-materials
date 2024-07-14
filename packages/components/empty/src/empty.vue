<template>
  <div class="pnut-empty">
    <div
      :class="{
        'has-title': hasTitle || title,
        [`pnut-empty--${size}`]: !!size
      }"
    >
      <template v-if="hasDefault">
        <slot />
      </template>
      <template v-else>
        <div class="pnut-empty__wrapper">
          <slot
            v-if="hasImg"
            name="img"
            class="pnut-empty__content"
          />
          <img
            v-else-if="name"
            :src="imgSrc"
            alt="空状态"
            class="pnut-empty__content"
          >
        </div>
        <div class="pnut-empty__text">
          <p
            v-if="hasTitle"
            class="pnut-empty__info pnut-empty__title"
            :class="{ 'align-center': placement === 'bottom' }"
          >
            <slot name="title" />
          </p>
          <p
            v-else-if="title"
            class="pnut-empty__info pnut-empty__title"
            :class="{ 'align-center': placement === 'bottom' }"
            v-text="title"
          />
          <p
            v-if="hasDescription"
            class="pnut-empty__info pnut-empty__description"
            :class="{ 'align-center': placement === 'bottom' }"
          >
            <slot name="description" />
          </p>
          <p
            v-else-if="description"
            class="pnut-empty__info pnut-empty__description"
            :class="{ 'align-center': placement === 'bottom' }"
            v-text="description"
          />
          <p
            v-if="hasButtons"
            class="pnut-empty__info pnut-empty__buttons"
            :class="{ 'align-center': placement === 'bottom' }"
          >
            <slot name="buttons" />
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, useSlots, defineOptions } from 'vue'

defineOptions({
  name: 'PtEmpty'
})

const props = defineProps({
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  theme: {
    type: String as PropType<'dark' | 'light'>,
    default: 'light'
  },
  name: {
    type: String as PropType<'not-found' | 'load-fail' | 'no-permission' | 'no-edit' | 'empty' | 'upload-file' | 'upgrading' | 'no-result' | 'submit-success' | 'loading-img' | 'network-anomaly'>,
    default: 'not-found'
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
// const imageMap = [
//   { id: 'not-found', name: '404' },
//   { id: 'load-fail', name: '加载失败' },
//   { id: 'no-permission', name: '角色无权限' },
//   { id: 'no-edit', name: '禁止编辑' },
//   { id: 'empty', name: '空状态' },
//   { id: 'upload-file', name: '上传文件' },
//   { id: 'upgrading', name: '升级中' },
//   { id: 'no-result', name: '搜索无结果' },
//   { id: 'submit-success', name: '提交成功' },
//   { id: 'loading-img', name: '图片加载中' },
//   { id: 'network-anomaly', name: '网络异常' }
// ]

const imgSrc = computed(() => {
  return require(`./theme/${props.theme}/${props.name}.svg`)
})

const hasDefault = computed(() => slots.default)

const hasImg = computed(() => slots.img)

const hasTitle = computed(() => slots.title)

const hasDescription = computed(() => slots.description)

const hasButtons = computed(() => slots.buttons)

</script>
