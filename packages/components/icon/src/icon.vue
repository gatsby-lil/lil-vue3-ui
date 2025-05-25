<template>
  <i class="lil-icon" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts">
defineComponent;
import { computed, defineComponent } from "vue";
import { iconProps } from "./icon";
export default defineComponent({
  name: "LilIcon",
  props: iconProps,
  setup(props) {
    const style = computed(() => {
      if (!props.size && !props.color) {
        return {};
      }
      return {
        ...(props.color ? { color: props.color } : {}),
        ...(props.size ? { "font-size": props.size } : {}),
      };
    });
    return {
      style,
    };
  },
});
</script>

<style lang="less" scoped></style>
