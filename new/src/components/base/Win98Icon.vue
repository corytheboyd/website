<template>
  <div
    class="win98-icon flex h-20 w-20 flex-col items-center justify-center gap-2"
  >
    <div
      class="relative flex flex-col items-center justify-center gap-2"
      @dblclick="handleDoubleClick"
      @click="handleClick"
      @focus="handleFocus"
      tabindex="0"
    >
      <div class="relative">
        <img
          :src="icon"
          :alt="name"
          class="h-8 w-8"
          :class="{ 'icon-focused': props.isFocused }"
        />
      </div>
      <div
        class="win98-font flex items-center justify-center px-1 text-center text-sm text-white"
        :class="{
          'outline-[1px] -outline-offset-[1px] outline-dotted': props.isFocused,
        }"
      >
        {{ name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowStore } from "@/state/store";
import type { WindowContentComponent } from "@/state/windowTypes";

interface Props {
  id: string;
  name: string;
  icon: string;
  component: WindowContentComponent;
  isFocused?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["focus"]);
const store = useWindowStore();

const handleClick = () => {
  emit("focus", props.id);
};

const handleFocus = () => {
  emit("focus", props.id);
};

const handleDoubleClick = () => {
  store.addWindow({
    name: props.name,
    width: 400,
    height: 255,
    minHeight: 175,
    minWidth: 200,
    position: { x: 150, y: 150 },
    component: props.component,
  });
  emit("focus", props.id);
};
</script>

<style>
.icon-focused {
  filter: invert(9%) sepia(100%) saturate(7217%) hue-rotate(193deg)
    brightness(87%) contrast(145%);
}
</style>
