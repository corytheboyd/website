<template>
  <div
    class="pointer-events-auto flex h-18 w-18 items-center justify-center bg-gray-800"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <div class="relative flex flex-col items-center gap-2">
      <img :src="icon" :alt="name" class="h-8 w-8" />
      <div class="icon-text text-center text-sm text-white">
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
}

const props = defineProps<Props>();
const store = useWindowStore();

const handleClick = () => {
  // Single click behavior if needed
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
};
</script>

<style scoped>
.icon-text {
  -webkit-font-smoothing: none;
  font-family: "Pixelated MS Sans Serif";
  font-size: 11px;
}
</style>
