import { ExtractPropTypes, PropType } from "vue";

export const calendarProps = {
    modelValue: {
        type:Date
    },
    range: {
        type: Array as any as PropType<[Date, Date]>,
    }
}

export const calendarEmits = {
    'update:modelValue': (val: Date) => val instanceof Date
}

export type CalendarProps = ExtractPropTypes<typeof calendarProps>
export type CalendarEmits = typeof calendarEmits
export type CalendarDateCellType = 'prev' | 'current' | 'next'
export type CalendarDateCell = {
    text:number,
    type: CalendarDateCellType,
}
