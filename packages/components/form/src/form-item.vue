<template>
  <div :class="[bem.b()]"></div>
</template>
<script lang="ts" setup>
import { createNamespace } from '@lil-ui/utils/createClassName'
import { formItemProps } from './form-item'
defineOptions({
  name: 'lil-form-item'
})
const bem = createNamespace('form-item')
const props = defineProps(formItemProps)
</script>
