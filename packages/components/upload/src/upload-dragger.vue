<template>
  <div
    @dragover.prevent="handleOnDragOver"
    @dragleave.prevent="isOver = false"
    @drop.prevent="handleOnDrop"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'lil-upload-dragger'
})
const emits = defineEmits({})
const isOver = ref(false)
function handleOnDrop(e: DragEvent) {
  e.stopPropagation()
  emits('file', e.dataTransfer?.files)
}

function handleOnDragOver() {
  isOver.value = true
}
</script>
