import { ExtractPropTypes, PropType } from "vue";

export const inputProps = {
    type: {
        type: String,
        default: 'text'
    },
    modelValue: {
        type: [String, Number] as PropType<string | number>,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    clearable: {
        type: Boolean,
        default: false
    },
    showPassword: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
} as const 

export type InputProps = Partial<ExtractPropTypes<typeof inputProps>>

export const inputEmits = {
    'update:modelValue':(val:string) => typeof val === 'string',
    input:(val:string) => typeof val === 'string',
    change:(val:string) => typeof val === 'string',
    focus:(e:FocusEvent) => e instanceof FocusEvent,
    blur:(e:FocusEvent) => e instanceof FocusEvent,
    clear:() => true,
}

export type InputEmits = typeof inputEmits