<template>
  <lil-virtual-scroll-list
    class="virtual-list"
    data-key="id"
    :data-sources="items"
    :keeps="30"
    :estimate-size="80"
    :data-component="(Item as DefineComponent<{},{},any>)"
  ></lil-virtual-scroll-list>
</template>
<script lang="ts" setup>
import { DefineComponent, ref } from 'vue'
import { Random } from 'mockjs'
import Item from './Item.vue'
interface DataType {
  id: number
  name: string
  desc: string
  index: number
}
const data: Array<DataType> = []
const totalCount = 100
let index = 0
while (index < totalCount) {
  data.push({
    id: index,
    name: Random.name(),
    desc: Random.csentence(20, 120),
    index
  })
  index++
}
const items = ref<any>(data)
</script>
<style>
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 3px solid red;
}
</style>
