<template>
  <div :class="bem.b()">
    <template v-for="node in flattenTree">
      <tree-node
        :node="node"
        :expanded="isExpanded(node)"
        :selected="isSelected(node)"
        :loading-keys="loadingKeysRef"
        @toggle="toggleExpand"
        @select="handleSelect"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useSlots, watch } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import TreeNode from './treeNode.vue'
import {
  TreeNode as TreeNodeType,
  TreeOption,
  treeProps,
  TypeTreeKey,
  treeEmits,
  treeInjectionKey
} from './tree'

const bem = createNamespace('tree')

defineOptions({
  name: 'lil-tree'
})

const props = defineProps(treeProps)
const emits = defineEmits(treeEmits)

const tree = ref<TreeNodeType[]>([])
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))
const selectedKeys = ref<TypeTreeKey[]>([])
const loadingKeysRef = ref(new Set<TypeTreeKey>())

provide(treeInjectionKey, {
  slots: useSlots()
})

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

function createTree(
  data: TreeOption[],
  parentNode: TreeNodeType | null = null
) {
  function traversal(
    data: TreeOption[],
    parentNode: TreeNodeType | null = null
  ) {
    return data.map(node => {
      const children = treeFieldOptions.getChildren(node)
      const treeNode: TreeNodeType = {
        label: treeFieldOptions.getLabel(node),
        key: treeFieldOptions.getKey(node),
        rawNode: node,
        level: parentNode ? parentNode.level + 1 : 0,
        disabled: !!node.disabled,
        children: [],
        isLeaf: node.isLeaf ?? children.length === 0
      }
      if (children && children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  return traversal(data, parentNode)
}

// !关键方法: 根据当前展开的节点, 动态计算
const flattenTree = computed(() => {
  const expandedKeys = expandedKeysSet.value
  // 拍平后的结果
  const flattenNodes: TreeNodeType[] = []
  // 格式化后的结果
  const nodes = tree.value
  // 用于遍历树的栈
  const stack: TreeNodeType[] = []
  for (let i = nodes.length - 1; i >= 0; i--) {
    // 树的最外层是一样需要展示的
    stack.push(nodes[i])
  }
  while (stack.length) {
    const node = stack.pop()
    if (!node) {
      continue
    }
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children
      if (Array.isArray(children) && children.length > 0) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i])
        }
      }
    }
  }
  return flattenNodes
})

// 实现树的展开和收缩
function isExpanded(node: TreeNodeType): boolean {
  return expandedKeysSet.value.has(node.key)
}

function expand(node: TreeNodeType) {
  expandedKeysSet.value.add(node.key)
  return triggerLoad(node)
}

function collpase(node: TreeNodeType) {
  return expandedKeysSet.value.delete(node.key)
}

function toggleExpand(node: TreeNodeType) {
  const expandedKeys = expandedKeysSet.value
  if (expandedKeys.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}

// 实现选中逻辑
function isSelected(node: TreeNodeType): boolean {
  return selectedKeys.value.includes(node.key)
}

function handleSelect(node: TreeNodeType) {
  if (!props.selectable) {
    return
  }
  let keys = [...selectedKeys.value]
  if (props.multiple) {
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      // 删除
      keys.splice(index, 1)
    } else {
      // 新增
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      keys = []
    } else {
      keys = [node.key]
    }
  }
  selectedKeys.value = keys
  emits('update:selectedKeys', keys)
}

// 实现异步加载
function triggerLoad(node: TreeNodeType) {
  if (!node?.children?.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      if (typeof props.onLoad === 'function') {
        props.onLoad(node).then(children => {
          node.rawNode.children = children
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

watch(
  props.data,
  (data: TreeOption[]) => {
    const newTreeData = createTree(data)
    tree.value = newTreeData
  },
  { immediate: true }
)

watch(
  props.selectedKeys,
  keys => {
    if (Array.isArray(keys)) {
      selectedKeys.value = keys
    }
  },
  { immediate: true }
)
</script>
