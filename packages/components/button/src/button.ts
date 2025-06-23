import { ExtractPropTypes, PropType } from 'vue'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | ''
export type ButtonNativeType = 'button' | 'submit' | 'reset'
export type ButtonPlacement = 'left' | 'right'

export const buttonProps = {
  size: {
    type: String as PropType<ButtonSize>
  },
  type: {
    type: String as PropType<ButtonType>,
    validator: (val: string) =>
      ['primary', 'success', 'warning', 'danger', 'info', ''].includes(val),
    default: ''
  },
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: 'button'
  },
  iconPlacement: {
    type: String as PropType<ButtonPlacement>,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
} as const 

export const buttonEmits = {
    click:(e: MouseEvent) => e instanceof MouseEvent,
    mousedown:(e: MouseEvent) => e instanceof MouseEvent,
    // ....
}

export type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>
export type ButtonEmits = typeof buttonEmits