import { ExtractPropTypes, PropType } from 'vue'

export type TreeKey = number | string
export interface TreeOption {
  label?: TreeKey
  key?: TreeKey
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
  }
} as const

export const treeNodeEmitts = {
  toggle: (node: TreeNode) => node
}

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<TreeKey[]>,
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
  }
} as const

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
