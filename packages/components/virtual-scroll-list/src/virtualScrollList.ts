import { DefineComponent, ExtractPropTypes, PropType } from 'vue'

export const virtualScrollListProps = {
  dataSources: {
    type: Array,
    required: true,
    default: () => []
  },
  // 每条数据的标识
  dataKey: {
    type: String,
    required: true
  },
  // 默认显示的个数
  keeps: {
    type: Number,
    default: 30
  },
  // 每个元素的高度
  estimateSize: {
    type: Number,
    default: 80
  },
  // 用户渲染每项所提供的组件
  dataComponent: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>
  }
}

export type VirtualScrollListProps = ExtractPropTypes<
  typeof virtualScrollListProps
>

export type RangeOptions = {
  start: number
  end: number
  padFront: number
  padBehind: number
}

export type VirtualOptions = {
  keeps: number
  buffer: number
  estimateSize: number
  uniqueIds: string[]
}

export type updateType = (range: RangeOptions) => void

export const virtualItemProps = {
  uniqueKey: {
    type: [String, Number] as PropType<string | number>
  },
  source: {
    type: Object,
    required: true
  },
  component: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>
  }
} as const
export type VirtualItemProps = ExtractPropTypes<typeof virtualItemProps>
