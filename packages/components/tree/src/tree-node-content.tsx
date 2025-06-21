import { defineComponent, inject, toRef } from 'vue'
import {
  treeInjectionKey,
  TreeNodeContentProps,
  treeNodeContentProps
} from './tree'

export default defineComponent({
  name: 'lil-tree-node-content',
  props: treeNodeContentProps,
  setup(props: TreeNodeContentProps) {
    const treeContext = inject(treeInjectionKey)
    console.log(treeContext?.slots, 'slots')
    const node = toRef(props.node)
    return () => {
      return treeContext?.slots.default
        ? treeContext?.slots.default({ node: node.value })
        : node?.value?.label
    }
  }
})
