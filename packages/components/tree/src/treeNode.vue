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
      <span :class="[bem.e('label')]" @click="handleContentClick">
        {{ node?.label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@lil-ui/utils/createClassName'
import LilIcon from '@lil-ui/components/icon'
import Switcher from './icons/Switcher'
import Loading from './icons/Loading'
import { treeNodeEmitts, treeNodePorps } from './tree'
import { computed } from 'vue'

const bem = createNamespace('tree-node')

const emits = defineEmits(treeNodeEmitts)

const props = defineProps(treeNodePorps)

const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node!.key)
})
function handleExpand() {
  emits('toggle', props.node!)
}

function handleContentClick() {
  if (props?.node?.disabled) return
  emits('select', props.node!)
}
</script>
