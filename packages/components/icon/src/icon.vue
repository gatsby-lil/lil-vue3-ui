<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { iconProps } from './icon'
import { createNamespace } from '@lil-ui/utils/createClassName'
defineOptions({
  name: 'LilIcon'
})
const props = defineProps(iconProps)
const bem = createNamespace('icon')
const style = computed(() => {
  if (!props.size && !props.color) return {}
  return {
    ...(props.size ? { 'font-size': props.size + 'px' } : {}),
    ...(props.color ? { color: props.color } : {})
  }
})
</script>
