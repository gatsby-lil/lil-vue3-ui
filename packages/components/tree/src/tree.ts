import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'

export type TypeTreeKey = number | string

export interface TreeOption {
  label?: TypeTreeKey
  key?: TypeTreeKey
  children?: TreeOption[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: unknown
}

export interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
  parentKey: TypeTreeKey | null
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
    type: Boolean
  },
  checked: {
    type: Boolean
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean
  },
  indeterminate: {
    type: Boolean
  },
  loadingKeys: {
    type: Object as PropType<Set<TypeTreeKey>>
  }
} as const

export const treeNodeEmitts = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node,
  check: (node: TreeNode, val: boolean) => node
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
  defaultCheckedKeys: {
    type: Array as PropType<TypeTreeKey[]>,
    default: () => []
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
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
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
} as const

export const treeEmits = {
  'update:selectedKeys': (keys: TypeTreeKey[]) => keys
}

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>

export interface TreeContext {
  slots: SetupContext['slots']
}

export const treeInjectionKey: InjectionKey<TreeContext> =
  Symbol('treeInjectionKey')

// jsx组件的props类型
export const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  }
} as const

export type TreeNodeContentProps = Partial<
  ExtractPropTypes<typeof treeNodeContentProps>
>
