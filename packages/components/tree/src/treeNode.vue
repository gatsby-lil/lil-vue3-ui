<template>
  <div :class="[bem.b()]">
    <div
      :class="[bem.e('content')]"
      :style="{ paddingLeft: `${node!.level * 16}px` }"
    >
      <span :class="[bem.e('expand-icon')]" @click="handleExpand">
        <lil-icon :size="16">
          <Switcher />
        </lil-icon>
      </span>
      <span>
        <span style="color: crimson">{{ node?.key }}</span>
        {{ node?.label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@lil-ui/utils/createClassName'
import LilIcon from '@lil-ui/components/icon'
import Switcher from './icons/Switcher'
import { treeNodeEmitts, treeNodePorps } from './tree'

const bem = createNamespace('tree-node')
const emits = defineEmits(treeNodeEmitts)
const props = defineProps(treeNodePorps)
function handleExpand() {
  emits('toggle', props.node!)
}
</script>
