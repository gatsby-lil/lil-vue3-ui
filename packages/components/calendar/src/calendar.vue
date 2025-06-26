<template>
  <div :class="nsCal.b()">
    <div :class="nsCal.e('header')">
      <div :class="nsCal.e('title')">{{ currentDate }}</div>
      <div :class="nsCal.e('button-group')">
        <lil-button @click="selectDate('prev-year')">前一年</lil-button>
        <lil-button @click="selectDate('prev-month')">上个月</lil-button>
        <lil-button @click="selectDate('today')">今天</lil-button>
        <lil-button @click="selectDate('next-month')">下个月</lil-button>
        <lil-button @click="selectDate('next-year')">下一年</lil-button>
      </div>
    </div>
    <div :class="nsCal.e('body')">
      <table :class="nsTable.b()" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="day in weekDays">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in weeks">
            <td
              v-for="day in week"
              @click="handlePick(day)"
              :class="[nsDay.b(), getCellClass(day), day.type]"
            >
              <slot name="date-cell" :data="getSlotsData(day)">
                {{ day.text }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import LilButton from '@lil-ui/components/button'
import { createNamespace } from '@lil-ui/utils/createClassName'
import {
  CalendarDateCell,
  calendarEmits,
  calendarProps,
  CalendarDateType,
  CalendarDateCellType
} from './calendar'
import { computed, ref } from 'vue'
defineOptions({
  name: 'lil-calendar'
})
const nsCal = createNamespace('calendar')
const nsTable = createNamespace('calendar-table')
const nsDay = createNamespace('calendar-day')

const props = defineProps(calendarProps)
const emits = defineEmits(calendarEmits)

const weekMaping = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]

const firstDayofWeek = dayjs().startOf('week').day()
const now = dayjs()
const selectDay = ref<Dayjs>()

const date = computed(() => {
  if (!props.modelValue) {
    return now
  }
  return dayjs(props.modelValue)
})

const weekDays = computed(() => {
  return [
    ...weekMaping.slice(firstDayofWeek),
    ...weekMaping.slice(0, firstDayofWeek)
  ]
})

const currentDate = computed(() => {
  return `${date.value.year()}年${
    date.value.month() + 1
  }月${date.value.date()}日`
})

// 展示7*6
const weeks = computed(() => {
  const dayList: CalendarDateCell[] = []
  debugger
  // 获取本月的第一天是星期几
  const firstDay = date.value.startOf('month').day()
  // 前一个月的最后一天
  const lastDay = date.value.subtract(1, 'month').endOf('month').date()
  // 本月的第一天到前面需要几天
  const prevMonthsCount = firstDay === 0 ? 6 : 7 - firstDay
  const prevMonthDays: CalendarDateCell[] = Array.from({
    length: prevMonthsCount
  })
    .map((_, idx) => {
      return lastDay - (prevMonthsCount - idx - 1)
    })
    .map(day => {
      return {
        text: day,
        type: 'prev'
      }
    })
  // 获取当前月有多少天
  const currentMonthDayCounts = date.value.daysInMonth()
  // 当前月的天数
  const currentMonthDays: CalendarDateCell[] = Array.from({
    length: currentMonthDayCounts
  }).map((_, idx) => {
    return {
      text: idx + 1,
      type: 'current'
    }
  })
  // 获取需要补充的下一个月天数
  const nextMonthDays: CalendarDateCell[] = Array.from({
    length: 42 - currentMonthDayCounts - prevMonthDays.length
  }).map((_, idx) => {
    return {
      text: idx + 1,
      type: 'next'
    }
  })
  dayList.push(...prevMonthDays, ...currentMonthDays, ...nextMonthDays)
  // 拆分成7个为一组，共6组
  return Array.from({ length: 6 }).map((_, idx) => {
    return dayList.slice(idx * 7, idx * 7 + 7)
  })
})

const prevMonthDays = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDays = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))

function formatter(text: number, type: CalendarDateCellType) {
  switch (type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text)
    case 'current':
      return date.value.date(text)
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text)
  }
}
function pickDay(day: Dayjs) {
  selectDay.value = day
  emits('update:modelValue', day.toDate())
}

function handlePick({ text, type }: CalendarDateCell) {
  const day = formatter(text, type)
  pickDay(day)
}
function selectDate(type: CalendarDateType) {
  const dateMap: Record<CalendarDateType, Dayjs> = {
    'prev-month': prevMonthDays.value,
    'next-month': nextMonthDays.value,
    'prev-year': prevYearDay.value,
    'next-year': nextYearDay.value,
    today: now
  }
  const day = dateMap[type]
  pickDay(day)
}

function getCellClass({ text, type }: CalendarDateCell) {
  const classNameList: string[] = []
  const date = formatter(text, type)
  if (date.isSame(selectDay.value, 'day')) {
    // 如果选中的日期和 当前循环的日期相同，就标识选中了
    classNameList.push(nsDay.is('selected', true))
  }
  if (date.isSame(now, 'day')) {
    classNameList.push(nsDay.is('today', true))
  }
  return classNameList
}

function getSlotsData({ text, type }: CalendarDateCell) {
  const day = formatter(text, type)
  return {
    isSelected: day.isSame(selectDay.value),
    day: day.format('YYYY-MM-DD'),
    date: day.toDate(),
    type
  }
}
</script>
