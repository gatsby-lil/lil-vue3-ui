import { defineComponent, onBeforeMount, ref, DefineComponent, h, Component } from 'vue'
import { RangeOptions, virtualScrollListProps, VirtualScrollListProps } from './virtualScrollList'
import { initVirtual } from './virtual'

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
    let virtual: ReturnType<typeof initVirtual>

    function genRenderComponent() {
      const { start, end } = range.value!
      const slots = []
      for (let i = start; i <= end; i++) {
        const dataSource = dataSources[i]

        if (dataSource) {
          const uniqueKey = (dataSource as any)[dataKey as string]
          slots.push(
            h(DataComponent!, { key: uniqueKey, source: dataSource })
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
    onBeforeMount(() => {
      installVirtual()
    })
    return () => {
      const { padFront, padBehind } = range.value!
      const paddingStyle = {
        padding: `${padFront}px 0 ${padBehind}px`
      }
      return (
        <div>
          <div style={paddingStyle}>{genRenderComponent()}</div>
        </div>
      )
    }
  }
})