import { ExtractPropTypes, InjectionKey, PropType } from "vue"
import { Arrayable, FormItemContext, FormItemRule } from "./form-item"

const formProps = {
  model: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object as PropType<Record<string, Arrayable<FormItemRule>>>
  },
  showMessage: {
    type: Boolean,
    default: true
  },
}

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps { 
  addField(field: FormItemContext): void;
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('form-context')