<script setup lang="ts">
import { ref } from 'vue'
import { AddCircle } from '@vicons/ionicons5'

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(6 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      customLabel: createLabel(level), // 显示的内容
      customKey: key, // 为了唯一性
      customChildren: createData(level - 1, key) // 孩子
    }
  })
}
const treeData = ref(createData())
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <lil-tree
      :data="treeData"
      :default-expanded-keys="['40', '4032']"
      label-field="customLabel"
      key-field="customKey"
      children-field="customChildren"
    />
    <lil-icon :size="36" color="red">
      <AddCircle />
    </lil-icon>
  </div>
</template>

<style scoped></style>
