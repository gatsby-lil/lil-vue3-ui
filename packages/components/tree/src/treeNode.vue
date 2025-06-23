<template>
  <div :class="[bem.b(), bem.is('selected', selected)]">
    <div
      :class="[bem.e('content')]"
      :style="{ paddingLeft: `${node!.level * 16}px` }"
    >
      <span
        :class="[bem.e('expand-icon'), bem.is('leaf', node!.isLeaf)]"
        @click="handleExpand"
      >
        <lil-icon :size="16">
          <Loading v-if="isLoading" />
          <Switcher v-else />
        </lil-icon>
      </span>
      <lil-checkbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleCheckChange"
      />
      <span :class="[bem.e('label')]" @click="handleContentClick">
        <TreeNodeContent :node="node!" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { createNamespace } from '@lil-ui/utils/createClassName'
import LilIcon from '@lil-ui/components/icon'
import LilCheckbox from '@lil-ui/components/checkbox'
import Switcher from '@lil-ui/components/internal-icon/Switcher'
import Loading from '@lil-ui/components/internal-icon/Loading'
import TreeNodeContent from './tree-node-content'
import { treeNodeEmitts, treeNodePorps } from './tree'

const bem = createNamespace('tree-node')

const emits = defineEmits(treeNodeEmitts)

const props = defineProps(treeNodePorps)

const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node!.key)
})

function handleCheckChange(val: string | number | boolean) {
  emits('check', props.node!, val as boolean)
}
function handleExpand() {
  emits('toggle', props.node!)
}

function handleContentClick() {
  if (props?.node?.disabled) return
  emits('select', props.node!)
}
</script>
