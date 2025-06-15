<template>
  <div :class="bem.b()">Tree</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import { TreeNode, TreeOption, treeProps } from './tree'

const bem = createNamespace('tree')
defineOptions({
  name: 'lil-tree'
})
const props = defineProps(treeProps)
const tree = ref<TreeNode[]>([])

function createOptions(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}

const treeFieldOptions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
)

function createTree(data: TreeOption[], parentNode: TreeNode | null = null) {
  function traversal(data: TreeOption[], parentNode: TreeNode | null = null) {
    return data.map(node => {
      const children = treeFieldOptions.getChildren(node)
      const treeNode: TreeNode = {
        label: treeFieldOptions.getLabel(node),
        key: treeFieldOptions.getKey(node),
        rawNode: node,
        level: parentNode ? parentNode.level + 1 : 0,
        disabled: !!node.disabled,
        children: [],
        isLeaf: node.isLeaf ?? children.length === 0
      }
      if (node.children && node.children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  return traversal(data)
}

function formatTreeData() {}

watch(
  props.data,
  (data: TreeOption[]) => {
    const newTreeData = createTree(data)
    console.log(newTreeData)
  },
  { immediate: true }
)
</script>
