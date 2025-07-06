import { defineComponent, onBeforeMount, ref, h } from 'vue'
import {
  RangeOptions,
  virtualScrollListProps,
  VirtualScrollListProps
} from './virtualScrollList'
import { initVirtual } from './virtual'
import VirtualItem from './virtual-item'

export default defineComponent({
  name: 'lil-virtual-scroll-list',
  props: virtualScrollListProps,
  setup(props) {
    const {
      dataSources,
      dataKey,
      keeps,
      estimateSize,
      dataComponent: DataComponent
    } = props as VirtualScrollListProps
    const range = ref<RangeOptions | null>(null)
    const root = ref<HTMLElement | null>(null)
    let virtual: ReturnType<typeof initVirtual>

    function onItemResize(id: string, size: number) {
      virtual.saveSize(id, size)
    }

    function genRenderComponent() {
      const { start, end } = range.value!
      const slots = []
      for (let i = start; i <= end; i++) {
        const dataSource = dataSources[i]

        if (dataSource) {
          const uniqueKey = (dataSource as any)[dataKey as string]
          slots.push(
            <VirtualItem
              uniqueKey={uniqueKey}
              source={dataSource}
              component={DataComponent}
              onItemResize={onItemResize}
            ></VirtualItem>
          )
        }
      }
      return slots
    }
    function update(newRange: RangeOptions) {
      range.value = newRange
    }
    function getUniqueIdFromDataSources(): string[] {
      return dataSources.map(item => (item as any)[dataKey as string])
    }
    function installVirtual() {
      virtual = initVirtual(
        {
          keeps,
          estimateSize,
          buffer: Math.round(keeps / 3),
          uniqueIds: getUniqueIdFromDataSources()
        },
        update
      )
    }
    function handleOnScroll() {
      if (root.value) {
        const offset = root.value.scrollTop
        virtual.handleScroll(offset)
      }
    }
    onBeforeMount(() => {
      installVirtual()
    })
    return () => {
      const { padFront, padBehind } = range.value!
      const paddingStyle = {
        padding: `${padFront}px 0 ${padBehind}px`
      }
      return (
        <div
          class="virtual-scroll-list-wrapper"
          onScroll={handleOnScroll}
          ref={root}
        >
          <div style={paddingStyle}>{genRenderComponent()}</div>
        </div>
      )
    }
  }
})
