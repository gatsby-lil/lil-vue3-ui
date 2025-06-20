import { ExtractPropTypes, PropType } from 'vue'

export type TypeTreeKey = number | string
export interface TreeOption {
  label?: TypeTreeKey
  key?: TypeTreeKey
  children: TreeOption[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: unknown
}
export interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
}

export const treeNodePorps = {
  node: {
    type: Object as PropType<TreeNode>,
    require: true
  },
  expanded: {
    type: Boolean,
    require: true
  },
  selected: {
    type: Boolean,
  }
} as const

export const treeNodeEmitts = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node
}



export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<TypeTreeKey[]>,
    default: () => []
  },
  selectedKeys: {
    type: Array as PropType<TypeTreeKey[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  }
} as const

export const treeEmits = {
  'update:selectedKeys': (keys: TypeTreeKey[]) => keys
}

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
