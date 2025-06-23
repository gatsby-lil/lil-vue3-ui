<template>
  <div :class="bem.b()">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>
      <div :class="bem.e('wrapper')">
        <span v-if="slots.prefixIcon" :class="bem.e('prefix')">
          <slot name="prefixIcon"></slot>
        </span>
        <input
          ref="inputRef"
          v-bind="attrs"
          :class="bem.e('inner')"
          :type="showPassword ? (passwordVisible ? 'password' : 'text') : type"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <lil-icon
          v-if="showPwdVisible"
          @click="handlePasswordVisible"
          style="line-height: 16px; font-weight: bold"
        >
          e
        </lil-icon>
        <lil-icon
          v-if="showClear"
          @click="clear"
          style="line-height: 16px; font-weight: bold"
        >
          x
        </lil-icon>
        <span v-if="slots.suffixIcon" :class="bem.e('suffix')">
          <slot name="suffixIcon"></slot>
        </span>
      </div>
      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch
} from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import LilIcon from '@lil-ui/components/icon'
import { inputEmits, inputProps } from './input'
import { FormItemContextKey } from '@lil-ui/components/form'

const bem = createNamespace('input')
defineOptions({
  name: 'lil-input',
  inheritAttrs: false // 关闭默认继承
})
const formItemContext = inject(FormItemContextKey)
const props = defineProps(inputProps)
const emits = defineEmits(inputEmits)
const attrs = useAttrs()
const slots = useSlots()

const passwordVisible = ref(false)
const inputRef = ref<HTMLInputElement>()

const showPwdVisible = computed(() => {
  return (
    props.showPassword && props.modelValue && !props.disabled && !props.readonly
  )
})

const showClear = computed(() => {
  return (
    props.clearable && props.modelValue && !props.disabled && !props.readonly
  )
})

function clear() {
  emits('clear')
  emits('update:modelValue', '')
  emits('input', '')
}

async function focusInput() {
  await nextTick()
  inputRef.value?.focus()
}
function handlePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
  focusInput()
}

function setNativeInputValue() {
  const inputEl = inputRef.value
  if (inputEl) {
    inputEl.value = String(props.modelValue)
  }
}

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emits('input', value)
  emits('update:modelValue', value) // 触发事件可以实现双向绑定
}
function handleChange(e: Event) {
  emits('change', (e.target as HTMLInputElement).value)
}

function handleFocus(e: FocusEvent) {
  emits('focus', e)
}
function handleBlur(e: FocusEvent) {
  formItemContext?.validate('blur')
  emits('blur', e)
}
watch(
  () => props.modelValue,
  () => {
    setNativeInputValue()
  }
)
onMounted(() => {
  formItemContext?.validate('change')
  setNativeInputValue()
})
</script>
