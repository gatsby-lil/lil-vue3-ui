import { ExtractPropTypes, PropType } from 'vue'
export const checkProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: ''
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String as PropType<string>,
    default: ''
  }
} as const

export type CheckProps = ExtractPropTypes<typeof checkProps>

export const checkEmits = {
  // v-model是Vue的语法糖，它自动处理了props:modelValue和update:modelValue事件
  // 必须显式的返回true, 否则控制台会报警告:Invalid event arguments:event validation failed for event "update:modelValue"
  'update:modelValue': (value: string | number | boolean) => true,
  change: (value: string | number | boolean) => true
}

export type CheckEmits = typeof checkEmits
