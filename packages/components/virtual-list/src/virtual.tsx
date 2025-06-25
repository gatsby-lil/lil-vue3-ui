import { computed, defineComponent, onMounted, reactive, ref, VNode, watch } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any
    }
  }
}

export default defineComponent({
  name: 'lil-virtual-list',
  props: {
    size: {
      type: Number,
      default: 20
    },
    remain: {
      type: Number,
      default: 5
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { slots }): () => VNode {
    const bem = createNamespace('vl')
    const wrapperRef = ref<HTMLDivElement>()
    const barRef = ref<HTMLDivElement>()
    // 记录开始和结束
    const state = reactive({
      start: 0,
      end: props.remain
    })
    // 记录偏移量
    const offset = ref(0)

    // 当前开始的4条
    const prev = computed(() => Math.min(state.start, props.remain))
    // 后续的条数
    const next = computed(() =>
      Math.min(props.remain, props.items.length - state.end)
    )

    // 当前展示的条数
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    // 根据当前的滚动高度判断划过去了几条数据
    function handleScroll() { 
      const scrollTop = wrapperRef.value!.scrollTop
      state.start = Math.floor(scrollTop / props.size)
      state.end = state.start + props.remain
      const os = state.start * props.size - props.size * prev.value
      console.log(os, 'os');
      offset.value = os
    }

    function initWrapper() { 
      if(wrapperRef.value) {
        wrapperRef.value.style.height = props.remain * props.size + 'px'
      }
      if(barRef.value) {
        barRef.value.style.height = props.items.length * props.size + 'px'
      }
    }

    watch(() => props.items, () =>{
      initWrapper()
    })

    onMounted(() => {
      initWrapper()
    })

    return () => (
      <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
        <div class={bem.e('scroll-bar')} ref={barRef}></div>
        <div
          class={bem.e('scroll-list')}
          style={{ transform: `translate3d(0,${offset.value}px,0)` }}
        >
          {visibleData.value.map(item => {
            return slots.default!({node: item})
          })}
        </div>
      </div>
    )
  }
})
