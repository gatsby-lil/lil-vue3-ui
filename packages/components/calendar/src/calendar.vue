<template>
  <div :class="nsCal.b()">
    <div :class="nsCal.e('header')">
      <div :class="nsCal.e('title')">日历</div>
      <div :class="nsCal.e('button-group')">
        <lil-button>前一年</lil-button>
        <lil-button>上个月</lil-button>
        <lil-button>今天</lil-button>
        <lil-button>下个月</lil-button>
        <lil-button>下一年</lil-button>
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
            <td v-for="day in week">{{ day.text }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import LilButton from '@lil-ui/components/button'
import { createNamespace } from '@lil-ui/utils/createClassName'
import { CalendarDateCell, calendarEmits, calendarProps } from './calendar'
import { computed } from 'vue'
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

// 展示7*6
const weeks = computed(() => {
  const dayList: CalendarDateCell[] = []
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
</script>
