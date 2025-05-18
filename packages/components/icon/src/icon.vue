<template>
  <i class="lil-icon" :style="style">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { iconProps } from "./icon";
defineOptions({
  name: "LilIcon",
});
const props = defineProps(iconProps);
const style = computed(() => {
  if (!props.size && !props.color) {
    return {};
  }
  return {
    ...(props.color ? { color: props.color } : {}),
    ...(props.size ? { "font-size": props.size } : {}),
  };
});
</script>

<style lang="less" scoped></style>
