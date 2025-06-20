<script setup lang="ts">
import { ref, watch } from 'vue'
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

function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

const handleLoad = (node: TreeOption) => {
  // 每次实现懒加载时，会触发此方法，将当前点击的node传入
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 2000)
  })
}

const treeData = ref(createData())
const selectedKeys = ref([])

watch(selectedKeys, keys => {
  console.log(keys, 'kkkkkk')
})
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <lil-tree
      :data="treeData"
      :default-expanded-keys="['40', '4032']"
      :onLoad="handleLoad"
      v-model:selected-keys="selectedKeys"
      selectable
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
