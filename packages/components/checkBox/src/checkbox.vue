<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        type="checkbox"
        ref="inputRef"
        v-model="model"
        :disabled="disabled"
        @change="handleChange"
      />
    </span>
    <span v-if="$slots.default || label" :class="bem.e('label')">
      <slot></slot>
      <template v-if="!$slots.default">
        {{ label }}
      </template>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import { checkEmits, checkProps } from './checkbox'

defineOptions({
  name: 'lil-checkbox'
})
const bem = createNamespace('checkbox')
const props = defineProps(checkProps)
const emits = defineEmits(checkEmits)
const model = computed({
  get() {
    return props.modelValue
  },
  set(value: string | number | boolean) {
    emits('update:modelValue', value)
  }
})
const inputRef = ref<HTMLInputElement>()
// 实现半选逻辑和change事件
function handleChange(e: Event) {
  const checked = !!(e.target as HTMLInputElement).checked
  emits('change', checked)
}

function indeterminate(val: boolean) {
  inputRef.value!.indeterminate = val
}

watch(() => props.indeterminate, indeterminate)
onMounted(() => {
  indeterminate(props.indeterminate)
})
</script>
