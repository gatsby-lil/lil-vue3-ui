<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState == 'success'),
      bem.is('error', validateState === 'error')
    ]"
  >
    <label :class="bem.e('label')">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, onMounted, provide, ref } from 'vue'
import AsyncValidator, { Values } from 'async-validator'
import { createNamespace } from '@lil-ui/utils/createClassName'
import { FormContextKey } from './form'
import {
  Arrayable,
  FormItemContext,
  FormItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState
} from './form-item'

defineOptions({
  name: 'lil-form-item'
})
const bem = createNamespace('form-item')
const props = defineProps(formItemProps)
const formContext = inject(FormContextKey)
const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('')
const validate: FormItemContext['validate'] = (trigger, callback?) => {
  const rules = getRuleFiltered(trigger)
  // 根据数据源查找需要校验的字段
  const modelName = props.prop!
  // 生成校验器
  const validator = new AsyncValidator({
    [modelName]: rules
  })
  const model = formContext?.model!
  return validator
    .validate({
      [modelName]: model[modelName]
    })
    .then(() => {
      onValidationSuccesseded()
    })
    .catch((err: Values) => {
      onValidationFailed(err)
      return Promise.reject(err)
    })
}
const context: FormItemContext = {
  ...props,
  validate
}

provide(FormItemContextKey, context)

const _rules = computed(() => {
  // 表单项的规则
  const formItemRules = converArray(props.rules)
  // 父级的form规则
  const formRules = formContext?.rules
  if (formRules && props.prop) {
    const _temp = formRules[props.prop]
    if (_temp) {
      formItemRules.push(...converArray(_temp))
    }
  }
  return formItemRules
})

function converArray(
  rules: Arrayable<FormItemRule> | undefined
): FormItemRule[] {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

function getRuleFiltered(trigger: string) {
  const rules = _rules.value
  return rules.filter((rule: FormItemRule) => {
    if (!rule.trigger || !trigger) {
      return true
    }
    return Array.isArray(rule.trigger)
      ? rule.trigger.includes(trigger)
      : rule.trigger === trigger
  })
}

function onValidationSuccesseded() {
  validateState.value = 'success'
  validateMessage.value = ''
}

function onValidationFailed(err: Values) {
  validateState.value = 'error'
  const { errors } = err
  validateMessage.value = errors ? errors[0].message : ''
}

onMounted(() => {
  formContext?.addField(context)
})
</script>
