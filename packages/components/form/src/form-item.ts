import { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import type { RuleItem } from 'async-validator'
export type Arrayable<T> = T | T[]
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}
export const formItemValidateState = ['success', 'error', ''] as const
// [number] 提取数组的类型作为联合类型
export type FormItemValidateState = (typeof formItemValidateState)[number]

export const formItemProps = {
  prop: {
    type: String
  },
  label: {
    type: String
  },
  rules: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  showMessage: {
    type: Boolean,
    default: true
  }
} as const

export type FormItemProps = ExtractPropTypes<typeof formItemProps>

export interface FormItemContext extends FormItemProps {
  validate: (
    trigger: string,
    callback?: (isValid: boolean) => void
  ) => Promise<any>
}

export const FormItemContextKey:InjectionKey<FormItemContext> = Symbol('form-item-context')
