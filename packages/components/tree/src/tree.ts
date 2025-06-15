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

export const treeNodePorps = {}

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
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
