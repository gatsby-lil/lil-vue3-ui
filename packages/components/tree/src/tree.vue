<template>
  <div :class="bem.b()">Tree</div>
</template>

<script setup>
import { createNamespace } from '@lil-ui/utils/createClassName'

const bem = createNamespace('tree')
defineOptions({
  name: 'lil-tree'
})
</script>
