<template>
  <div
    class="win98-icon flex h-20 w-20 flex-col items-center justify-center gap-2 bg-gray-800/10"
  >
    <div
      class="relative flex flex-col items-center justify-center gap-2 bg-gray-200/10"
      @dblclick="handleDoubleClick"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div class="relative">
        <img
          :src="icon"
          :alt="name"
          class="h-8 w-8"
          :class="{ 'icon-focused': isContainerFocused }"
        />
      </div>
      <div
        class="win98-font flex items-center justify-center px-1 text-center text-sm text-white"
        :class="{
          'outline-[1px] -outline-offset-[1px] outline-dotted':
            isContainerFocused,
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
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  id: string;
  name: string;
  icon: string;
  component: WindowContentComponent;
}

const props = defineProps<Props>();
const store = useWindowStore();
const isContainerFocused = ref(false);

const handleClick = () => {
  isContainerFocused.value = true;
};

const handleFocus = () => {
  isContainerFocused.value = true;
};

const handleBlur = () => {
  isContainerFocused.value = false;
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

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".win98-icon")) {
    isContainerFocused.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style>
.icon-focused {
  filter: invert(9%) sepia(100%) saturate(7217%) hue-rotate(193deg)
    brightness(87%) contrast(145%);
}
</style>
