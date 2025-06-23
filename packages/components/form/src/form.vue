<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>
<script lang="ts" setup>
import { provide } from 'vue'
import { Values } from 'async-validator'
import { createNamespace } from '@lil-ui/utils/createClassName'
import { FormItemContext } from './form-item'
import { FormContextKey, FormContext, formProps } from './form'

defineOptions({
  name: 'lil-form'
})
const props = defineProps(formProps)
// 收集form-item的上下文, 统一校验
const fields: FormItemContext[] = []
const addField: FormContext['addField'] = (field: FormItemContext) => {
  fields.push(field)
}
const formContext = {
  ...props,
  addField
}
// 把addField方法共享出去
provide(FormContextKey, formContext)
const bem = createNamespace('form')
async function validate(callback?: (valid: boolean, fields?: Values) => void) {
  let errors: Values = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields
      }
    }
  }
  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  } else {
    if (typeof callback === 'function') {
      callback(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}

defineExpose({
  validate
})
</script>
