<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled)
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMousedown"
  >
    <template v-if="iconPlacement === 'left'">
      <lil-icon>
        <LoadingComponent v-if="loading"></LoadingComponent>
        <template v-else-if="slots.icon">
          <Component :is="slots.icon"></Component>
        </template>
      </lil-icon>
    </template>
    <slot> </slot>
    <template v-if="iconPlacement === 'right'">
      <lil-icon>
        <LoadingComponent v-if="loading"></LoadingComponent>
        <template v-else-if="slots.icon">
          <Component :is="slots.icon"></Component>
        </template>
      </lil-icon>
    </template>
  </button>
</template>
<script lang="ts" setup>
import { useSlots } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import LoadingComponent from '@lil-ui/components/internal-icon/Loading'
import LilIcon from '@lil-ui/components/icon'
import { buttonProps, buttonEmits } from './button'

const bem = createNamespace('button')
defineOptions({
  name: 'lil-button',
  inheritAttrs: false // 关闭默认继承
})
const props = defineProps(buttonProps)
const emits = defineEmits(buttonEmits)
const slots = useSlots()
function emitClick(e: MouseEvent) {
  emits('click', e)
}
function emitMousedown(e: MouseEvent) {
  emits('mousedown', e)
}
</script>
