<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { AddCircle } from '@vicons/ionicons5'
import { TreeOption } from '@lil-ui/components/tree'

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(6 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      customLabel: createLabel(level), // 显示的内容
      customKey: key, // 为了唯一性
      customChildren: createData(level - 1, key) // 孩子
    }
  })
}

function asyncCreateData() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false // 这里isLeaf 为false 表示点击的时候动态的加载子节点
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false
    }
  ]
}

function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

const handleLoad = (node: TreeOption) => {
  // 每次实现懒加载时，会触发此方法，将当前点击的node传入
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false,
          children: []
        }
      ])
    }, 2000)
  })
}

const treeData = ref(createData())
const asyncTreeData = ref(asyncCreateData())
const selectedKeys = ref([])

const checkValue = ref('Hello')

const inputValue = ref('Hello-input')

const formRef = ref()
const currentDate = ref(new Date())

const state = reactive({ username: '', password: '' })

function checkboxChange(val: boolean | string | number) {
  console.log(val, '33333')
}

function buttonClick(e: MouseEvent) {
  console.log(e, 'buttonClick')
}

function buttonMousedown(e: MouseEvent) {
  console.log(e, 'buttonMousedown')
}

function validateForm() {
  formRef.value?.validate?.((valid: boolean, errors: any) => {
    console.log(valid, errors, 'form-form-form')
  })
}

watch(selectedKeys, keys => {
  console.log(keys, 'kkkkkk')
})

watch(checkValue, value => {
  console.log(value, 'vvvv')
  return !!value
})

watch(inputValue, value => {
  console.log(value, 'inputValue')
})

watch(currentDate, () => {
  console.log(currentDate, 'currentDate')
})
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <!-- :default-expanded-keys="['40', '4032']" -->
    <!-- label-field="customLabel"
      key-field="customKey"
      children-field="customChildren" -->
    <!-- :onLoad="false" -->
    <lil-tree
      :data="treeData"
      :showCheckbox="true"
      label-field="customLabel"
      key-field="customKey"
      children-field="customChildren"
      v-model:selected-keys="selectedKeys"
      :default-checked-keys="['40']"
      selectable
    >
      <!-- 测试插槽 -->
      <template #default="{ node }">
        <span style="color: darkgoldenrod"
          >{{ node.label }} - 哈哈哈 - 777</span
        >
      </template>
    </lil-tree>
    <lil-icon :size="36" color="red">
      <AddCircle />
    </lil-icon>
    <lil-checkbox
      v-model="checkValue"
      label="333"
      :indeterminate="true"
      :disabled="false"
      @change="checkboxChange"
    >
      <!-- 插槽的两种方式 -->
      <!-- <template #default>
        <span style="color: darkgoldenrod">lil</span>
      </template> -->
      <span style="color: brown">lil</span>
    </lil-checkbox>
  </div>
  <div>
    <lil-button
      type="primary"
      size="small"
      :disabled="false"
      @click="buttonClick"
      @mousedown="buttonMousedown"
    >
      <!-- <lil-icon>
        <AddCircle />
      </lil-icon>
      <span style="color: darkgoldenrod">lil</span> -->
      lil
    </lil-button>
    <div style="margin-top: 10px">
      <lil-input v-model="inputValue" clearable showPassword>
        <template #prepend>
          <lil-icon>
            <AddCircle />
          </lil-icon>
        </template>
        <template #append>
          <lil-icon>
            <AddCircle />
          </lil-icon>
        </template>
        <template #prefixIcon>
          <lil-icon>
            <AddCircle />
          </lil-icon>
        </template>
        <template #suffixIcon>
          <lil-icon>
            <AddCircle />
          </lil-icon>
        </template>
      </lil-input>
    </div>
    <div style="margin-top: 10px">
      <lil-form
        ref="formRef"
        :model="state"
        :rules="{
          username: {
            min: 6,
            max: 10,
            message: '用户名6-10位',
            trigger: ['change', 'blur']
          }
        }"
      >
        <lil-form-item
          prop="username"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]"
        >
          <lil-input placeholder="请输入用户名" v-model="state.username" />
          <template #label> 用户名 </template>
        </lil-form-item>

        <lil-form-item
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <lil-input
            placeholder="请输入密码"
            v-model="state.password"
            type="password"
          />
          <template #label> 用户名 </template>
        </lil-form-item>
        <lil-button
          a="1"
          b="2"
          size="medium"
          type="primary"
          :round="true"
          @click="validateForm"
        >
          按钮
        </lil-button>
      </lil-form>
    </div>
    <lil-calendar v-model="currentDate">
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
        </p>
      </template>
    </lil-calendar>
  </div>
</template>

<style scoped></style>
