import { defineComponent, h, onMounted, onUpdated, ref, VNode } from 'vue'
import { virtualItemProps } from './virtualScrollList'

export default defineComponent({
  name: 'lil-virtual-item',
  props: virtualItemProps,
  emits: ['itemResize'], // 发射的事件去掉on, 外部传递的是onItemResize
  setup(props, { emit }): () => VNode {
    const root = ref<HTMLDivElement>()
    function dispatchResize() {
      if (root.value) {
        const { offsetHeight } = root.value
        emit('itemResize', props.uniqueKey, offsetHeight)
      }
    }
    onMounted(() => {
      dispatchResize()
    })
    onUpdated(() => {
      dispatchResize()
    })
    return () => {
      const { component: Comp, source, uniqueKey } = props
      return (
        Comp && (
          <div key={uniqueKey} ref={root}>
            <Comp source={source}></Comp>
            <div>{source.index}</div>
          </div>
        )
      )
    }
  }
})
